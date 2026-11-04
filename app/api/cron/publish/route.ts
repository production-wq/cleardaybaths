import { authorized, configuredPublisher, notifyPublished } from '@/lib/publishing';

export const runtime = 'nodejs';
export const maxDuration = 300;

export async function GET(request: Request) {
  if (!authorized(request.headers.get('authorization'), process.env.CRON_SECRET))
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (process.env.VERCEL_ENV !== 'production')
    return Response.json({ skipped: 'Notifications only run in production' });
  try {
    const result = await notifyPublished(configuredPublisher());
    return Response.json(result, { status: result.failed.length ? 503 : 200, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Publishing notifications are not configured or temporarily unavailable' }, { status: 503 });
  }
}
