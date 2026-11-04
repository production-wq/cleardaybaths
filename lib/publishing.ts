import { timingSafeEqual, randomUUID } from 'node:crypto';
import { publishedPosts, type Post } from './blog';
import { SITE_URL } from './business';

const ORIGIN = SITE_URL;
type Command = (args: (string | number)[]) => Promise<unknown>;
export function authorized(header: string | null, secret: string | undefined): boolean {
  if (!secret || !header) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(header);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export interface PublisherDependencies {
  command: Command;
  verifyLive: (post: Post) => Promise<boolean>;
  notify: (post: Post) => Promise<void>;
}

/** Durable receipts survive cold starts/redeploys; leases prevent overlapping cron runs. */
export async function notifyPublished(deps: PublisherDependencies, now = new Date(), candidates = publishedPosts(now)) {
  const result = { notified: [] as string[], skipped: 0, failed: [] as string[] };
  for (const post of candidates.filter(p => p.notifyOnPublish)) {
    const receipt = `cleardaybaths:published:v1:${post.slug}`;
    const lock = `${receipt}:lock`;
    const token = randomUUID();
    let locked = false;
    try {
      if (await deps.command(['GET', receipt])) { result.skipped++; continue; }
      locked = await deps.command(['SET', lock, token, 'NX', 'EX', 300]) === 'OK';
      if (!locked) { result.skipped++; continue; }
      if (await deps.command(['GET', receipt])) { result.skipped++; continue; }
      if (!(await deps.verifyLive(post))) throw new Error('Article is not live');
      await deps.notify(post);
      await deps.command(['SET', receipt, now.toISOString()]);
      result.notified.push(post.slug);
    } catch {
      result.failed.push(post.slug);
    } finally {
      if (locked) {
        try {
          await deps.command(['EVAL', "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end", 1, lock, token]);
        } catch { /* Lease expires if Redis is temporarily unavailable. */ }
      }
    }
  }
  return result;
}

export function configuredPublisher(): PublisherDependencies {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  const webhook = process.env.SLACK_PUBLISH_WEBHOOK_URL;
  if (!redisUrl || !redisToken || !webhook) throw new Error('Missing publishing environment variables');
  if (!['https://cleardaybaths.com', 'https://www.cleardaybaths.com'].includes(ORIGIN))
    throw new Error('Publication origin must be the live Clear Day Baths site');
  if (new URL(redisUrl).protocol !== 'https:' || new URL(webhook).hostname !== 'hooks.slack.com')
    throw new Error('Invalid publishing endpoints');
  return {
    async command(args) {
      const response = await fetch(redisUrl, {
        method: 'POST', headers: { Authorization: `Bearer ${redisToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(args), cache: 'no-store', signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) throw new Error('Receipt store request failed');
      const data = await response.json();
      if (data.error) throw new Error('Receipt store command failed');
      return data.result;
    },
    async verifyLive(post) {
      const response = await fetch(`${ORIGIN}${post.path}`, { cache: 'no-store', redirect: 'follow', signal: AbortSignal.timeout(15000) });
      if (response.status !== 200) return false;
      const finalUrl = new URL(response.url);
      if (!['cleardaybaths.com', 'www.cleardaybaths.com'].includes(finalUrl.hostname) || finalUrl.pathname !== post.path) return false;
      const html = await response.text();
      // A real article marker prevents notices for an old deployment, soft 404 or challenge page.
      return html.includes(`data-published-slug="${post.slug}"`) &&
        [ORIGIN, finalUrl.origin].some(origin => html.includes(`href="${origin}${post.path}"`));
    },
    async notify(post) {
      const response = await fetch(webhook, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `Content has been published: ${post.title}\n${ORIGIN}${post.path}`, unfurl_links: false, unfurl_media: false }),
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok || (await response.text()).trim() !== 'ok') throw new Error('Slack delivery failed');
    },
  };
}
