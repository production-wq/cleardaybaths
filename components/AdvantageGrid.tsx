import { advantages } from '@/lib/content';
import { Check } from './Icons';

export default function AdvantageGrid({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {advantages.map((a) => (
        <div key={a.key}>
          <span className={`grid h-12 w-12 place-items-center rounded-full ${tone === 'dark' ? 'bg-white/10 text-sage' : 'bg-mint text-teal'}`}>
            <Check width={22} height={22} />
          </span>
          <h3 className="mt-5 font-display text-lg font-bold">{a.title}</h3>
          <p className="mt-2 text-sm leading-relaxed opacity-75">{a.body}</p>
        </div>
      ))}
    </div>
  );
}
