# Calendar publishing

The imported calendar contains 52 topics. The original 20 posts in `data/blog-posts.json` are preserved. The 32 missing articles and their Gemini-generated WebP images are prepared: 17 are due as of November 4, 2026, and 15 are scheduled through December 25, 2026.

## Release

Commit and push the changes on `push/nextjs`. Vercel's production branch is now `push/nextjs`, with automatic custom-domain assignment enabled. No deployment was triggered during setup. The next production deployment activates the environment variables and cron configuration.

Articles become visible at midnight America/New_York on their calendar date, without rebuilding. Blog listings, article routes, pagination, metadata, and both sitemaps apply the same date filter. Future articles return 404. Images are labeled AI-generated design inspiration rather than completed client projects.

## Slack notifications

Vercel calls `/api/cron/publish/` daily at 14:15 UTC (9:15 AM Eastern standard time; 10:15 AM daylight time). The job checks the canonical live article before sending its title and link to **#client-clear-day-baths** through **Clear Day Baths Publishing**. Preview and local deployments cannot send publication notices. On the first run after release, all newly added articles already due will receive a notice; original articles will not.

Production variables are configured in Vercel:

- `CRON_SECRET`: authenticates the scheduler.
- `SLACK_PUBLISH_WEBHOOK_URL`: channel-specific incoming webhook.
- `KV_REST_API_URL` and `KV_REST_API_TOKEN`: automatically supplied by the dedicated Upstash integration. The code also supports `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

Upstash stores durable receipts and short-lived locks so redeploys and overlapping jobs normally do not duplicate notices. Failed sends retry on the next daily run. Slack webhooks do not provide transactional delivery: a successful Slack send followed by a failed receipt write can produce a duplicate on retry. Cron failures return HTTP 503 and can be inspected in Vercel function logs. If cron is disabled or fails, date-based website publication still works; notices wait until a successful run.

The dedicated `cleardaybaths-publishing` database uses Upstash's Free plan, with no paid upgrade enabled. Slack incoming webhooks do not require a paid Workflow Builder subscription. Vercel cron has no separate subscription, but requests/functions count toward the existing hosting plan's usage. This is not a guarantee that overall hosting is free. Current workload is small (32 receipts, one job daily). Free-plan limits and provider policies can change.

## Maintenance

- Calendar metadata: `data/content/calendar.json`.
- Editable article drafts: `data/content/articles/*.json`.
- Gemini images: `public/img/blog/*.webp`.
- `npm run content:assemble` validates internal links and image files, then rebuilds `data/content/generated-posts.json` after draft edits.
- `npm run content:generate` generates missing drafts/images using `GEMINI_API_KEY` from ignored `.env.local`; it skips existing files. Generation uses paid Gemini quota; it is not run by cron or Vercel builds. Do not delete existing images unless intentionally regenerating them.
- `scripts/content/editorial/finish.py` is a one-time editorial assembly helper; rerunning it overwrites draft JSON. Edit the drafts directly for ongoing maintenance.
- Run `npm run verify`, `npm run test:publishing`, and `npm run build` before release.

Secrets belong in ignored local environment files or Vercel, never Git. The current automation publishes only the supplied calendar; adding future topics requires authoring, assembling, and pushing their content.
