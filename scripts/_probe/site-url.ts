import { SITE_URL } from '../../lib/business';
new URL(SITE_URL); // must not throw — this is what metadataBase does
process.stdout.write(SITE_URL);
