import { business } from '@/lib/business';
import { quoteBenefits } from '@/lib/content';
import LeadForm from './LeadForm';
import PhotoBackdrop from './PhotoBackdrop';
import { Phone, Check } from './Icons';

/**
 * Photo ground, with the lead form as a fully opaque card on top — so the
 * legibility problem a photo caused here previously (a translucent form
 * losing contrast against a light patch of the image) doesn't recur. The
 * form panel is solid (bg-forest-800, no opacity), so it reads cleanly
 * regardless of what's behind it.
 */
export default function CtaBand({ id = 'quote' }: { id?: string }) {
  return (
    <section id={id} className="on-dark relative isolate overflow-hidden bg-forest-950 text-white">
      <PhotoBackdrop src="/img/gallery/shower-replacement15.webp" focus="left" intensity="strong" />
      <div className="container-page relative z-10 grid items-center gap-12 py-section lg:grid-cols-2">
        <div>
          <p className="eyebrow">Ready when you are</p>
          <h2 className="mt-3 text-display-lg">
            Get started today <span className="text-sage">on your project</span>
          </h2>
          <p className="mt-4 text-white/75">{business.tagline}.</p>
          <ul className="mt-8 space-y-3">
            {quoteBenefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal">
                  <Check width={12} height={12} />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <a
            href={business.phone.href}
            data-analytics="call-click"
            data-location="cta-band"
            className="mt-8 inline-flex items-center gap-2.5 font-display text-2xl font-bold text-white hover:text-sage"
          >
            <Phone width={22} height={22} className="text-sage" /> {business.phone.display}
          </a>
          <p className="mt-2 text-sm text-white/55">{business.hoursDisplay}</p>
        </div>

        <LeadForm />
      </div>
    </section>
  );
}
