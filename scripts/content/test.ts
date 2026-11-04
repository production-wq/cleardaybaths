import assert from 'node:assert/strict';
import { isPublished, publicationDate, publishedPosts, postBySlug, pageCount, PER_PAGE } from '../../lib/blog';
import { authorized, notifyPublished, type PublisherDependencies } from '../../lib/publishing';

async function main() {

assert.equal(publicationDate(new Date('2026-11-06T04:59:59Z')), '2026-11-05');
assert.equal(isPublished({ date: '2026-11-06' }, new Date('2026-11-06T04:59:59Z')), false);
assert.equal(isPublished({ date: '2026-11-06' }, new Date('2026-11-06T05:00:00Z')), true);
assert.equal(publicationDate(new Date('2026-07-01T03:59:59Z')), '2026-06-30');
assert.equal(publicationDate(new Date('2026-07-01T04:00:00Z')), '2026-07-01');
const now = new Date('2026-11-04T18:00:00Z');
assert(publishedPosts(now).every(p => p.date <= '2026-11-04'));
assert.equal(pageCount(now), Math.ceil(publishedPosts(now).length / PER_PAGE));
assert.equal(postBySlug('not-a-real-post', now), undefined);
assert(!authorized(null, 'secret'));
assert(!authorized('Bearer secret', undefined));
assert(!authorized('Bearer wrong', 'secret'));
assert(authorized('Bearer secret', 'secret'));

const post = { ...publishedPosts(now)[0], slug: 'test-publish', notifyOnPublish: true };
const memory = new Map<string, string>();
let messages = 0;
const deps: PublisherDependencies = {
  async command(args) {
    const [op, key, value] = args.map(String);
    if (op === 'GET') return memory.get(key) ?? null;
    if (op === 'SET') {
      if (args.includes('NX') && memory.has(key)) return null;
      memory.set(key, value); return 'OK';
    }
    if (op === 'EVAL') {
      if (memory.get(String(args[3])) === String(args[4])) memory.delete(String(args[3]));
      return 1;
    }
    throw new Error('Unexpected command');
  },
  async verifyLive() { return true; },
  async notify() { messages++; },
};
await Promise.all([notifyPublished(deps, now, [post]), notifyPublished(deps, now, [post])]);
assert.equal(messages, 1, 'Overlapping jobs must not duplicate delivery');
await notifyPublished(deps, now, [post]);
assert.equal(messages, 1, 'Receipts must suppress subsequent runs');
memory.clear();
const notLive = await notifyPublished({ ...deps, verifyLive: async () => false }, now, [post]);
assert.equal(notLive.failed.length, 1);
assert.equal(messages, 1, 'Preview/soft-404 pages must not trigger Slack');
const failure = await notifyPublished({ ...deps, notify: async () => { throw new Error('Slack unavailable'); } }, now, [post]);
assert.equal(failure.failed.length, 1);
assert.equal(memory.size, 0, 'A failed send must release its lease without writing a receipt');
await notifyPublished(deps, now, [post]);
assert.equal(messages, 2, 'Failed notices must be retried');
console.log('Publishing tests passed: Eastern date boundaries, summer offset, visibility, authorization, overlap, receipts, live verification and retry.');

}
main().catch(error => { console.error(error); process.exitCode = 1; });
