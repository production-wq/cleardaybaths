import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import Section, { SectionHead } from '@/components/Section';
import Marquee from '@/components/Marquee';
import Mascot from '@/components/Mascot';
import ServiceCards from '@/components/ServiceCards';
import AdvantageGrid from '@/components/AdvantageGrid';
import CityChips from '@/components/CityChips';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import StatsRow from '@/components/StatsRow';
import Testimonials from '@/components/Testimonials';
import CtaBand from '@/components/CtaBand';
import FaqAccordion from '@/components/FaqAccordion';
import { business } from '@/lib/business';
import { byCategory, pick, sliderPairs } from '@/lib/gallery';
import faqs from '@/data/faqs.json';
import { Phone, ArrowRight, Check } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Bathroom Remodeling in Northern Virginia & Maryland',
  description:
    'Clear Day Bath Solutions installs tub-to-shower conversions, walk-in bathtubs, accessible bathrooms and full bath remodels across Northern Virginia, Maryland and the DC metro. Locally owned. Free in-home estimates.',
  alternates: { canonical: '/' },
};

const DIFFERENCE = pick(byCategory('bath-and-shower'), 2, 'home-difference');
const WHY = pick(byCategory('bathrooms'), 1, 'home-why')[0];

const EXPERTISE = [
  { title: 'Custom wet-area remodeling',
    body: 'Bases and surrounds sized to your actual opening, not a stock kit forced into a space it was never made for.' },
  { title: 'Tub-to-shower conversions',
    body: 'Remove the 15-inch wall you step over today and replace it with a low-threshold shower, usually without moving plumbing.' },
  { title: 'Safety shower installation',
    body: 'Grab bars anchored into blocking, slip-resistant floors and built-in seating, specified for how you will use the room in ten years.' },
  { title: 'Local expertise across VA & MD',
    body: 'We work in the counties we live in, so we know which jurisdictions pull permits for a like-for-like swap and which do not.' },
  { title: 'Flexible scheduling',
    body: 'Most conversions finish in a day or two. We give you a real window rather than a vague morning-or-afternoon.' },
];

export default function HomePage() {
  return (
    <>
      <Hero
        image="/img/gallery/bath-and-shower-remodel17.webp"
        title={<>Premier Bathroom Remodeling in Northern Virginia &amp; Maryland</>}
        lead="Locally owned and dedicated to quality across the Greater DC Metro area — from tub-to-shower conversions to full custom bathrooms."
      />

      {/* Experience a CLEAR difference */}
      <Section tone="cream">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="overflow-hidden rounded-panel">
              <Image src={DIFFERENCE[0].src} alt="A completed Clear Day shower installation"
                     width={DIFFERENCE[0].width} height={DIFFERENCE[0].height}
                     className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-10 -right-4 hidden w-2/5 overflow-hidden rounded-card ring-8 ring-cream sm:block">
              <Image src={DIFFERENCE[1].src} alt="" width={DIFFERENCE[1].width} height={DIFFERENCE[1].height}
                     className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="relative">
            <Mascot n={2} width={96} className="-bottom-6 -right-4 xl:-right-14" />
            <SectionHead align="left" eyebrow="Who we are" title="Experience a" accent="CLEAR difference" />
            <div className="prose-cd mt-5">
              <p>
                Most bathroom companies quote from a price book. We measure your room, look at what
                is behind the wall, and tell you what the job actually needs — including when a
                smaller scope will get you what you want.
              </p>
              <p>
                That matters most in the houses we work in every day: 1970s split-levels in{' '}
                <Link href="/woodbridge/">Woodbridge</Link>, rowhomes in{' '}
                <Link href="/alexandria/">Alexandria</Link> under historic review, and planned-community
                villages in <Link href="/columbia-bathroom-remodeling/">Columbia</Link> where the
                original baths have reached the end of their life all at once.
              </p>
            </div>
            <Link href="/about-us/" className="btn-primary mt-7">About Clear Day <ArrowRight /></Link>
          </div>
        </div>
      </Section>

      <Marquee tone="dark" />

      {/* Services */}
      <Section tone="white">
        <SectionHead
          eyebrow="Our services"
          title="Custom wet-area remodeling"
          accent="& safety showers"
          lead="Three ways we work, covering everything from a single shower swap to a bathroom taken back to the studs."
        />
        <ServiceCards />
        <div className="mt-10 text-center">
          <Link href="/bathrooms/" className="btn-outline">View all services <ArrowRight /></Link>
        </div>
      </Section>

      {/* Why choose */}
      <Section tone="cream">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHead align="left" eyebrow="Trusted across NoVA & Maryland"
                         title="Why homeowners choose" accent="Clear Day Bath Solutions" />
            <div className="prose-cd mt-5">
              <p>
                We are a local company, not a franchise routing you through a call centre. The person
                who quotes your bathroom is accountable for how it turns out, and you can reach us
                afterwards.
              </p>
              <p>
                Our work covers{' '}
                <Link href="/bath-conversions/tub-to-shower-conversions/">tub-to-shower conversions</Link>,{' '}
                <Link href="/bath-conversions/walk-in-bathtubs/">walk-in bathtubs</Link>,{' '}
                <Link href="/bathrooms/accessible-bathroom/">accessible bathrooms</Link> and{' '}
                <Link href="/showers/acrylic-showers/">acrylic showers</Link> across Prince William,
                Fairfax, Stafford, Loudoun, Frederick, Howard, Anne Arundel and Montgomery counties.
              </p>
              <p>
                Every job is quoted in writing after an in-home measure, so the number you see is the
                number you pay.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/get-quote/" className="btn-primary">Get free estimate <ArrowRight /></Link>
              <a href={business.phone.href} data-analytics="call-click" data-location="why-choose"
                 className="btn-outline">
                <Phone width={16} height={16} className="text-teal" /> Call {business.phone.display}
              </a>
            </div>
          </div>

          <div className="relative">
            {WHY && (
              <div className="overflow-hidden rounded-panel">
                <Image src={WHY.src} alt="A Clear Day bathroom renovation in Northern Virginia"
                       width={WHY.width} height={WHY.height} className="h-full w-full object-cover" />
              </div>
            )}
            <div className="absolute -bottom-6 left-6 rounded-card bg-teal px-6 py-5 text-white shadow-lg">
              <p className="font-display text-xl font-bold">Woodbridge, VA</p>
              <p className="mt-1 text-xs text-white/80">Serving Northern Virginia,<br />Maryland &amp; the DC metro</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Advantage */}
      <Section tone="mint">
        <div className="relative">
          <Mascot n={4} width={128} className="-top-10 right-0 xl:-right-6" />
          <SectionHead align="left" eyebrow="Why Clear Day" title="The Clear Day" accent="advantage"
                       lead="Four things we hold ourselves to on every job." />
        </div>
        <AdvantageGrid />
      </Section>

      {/* Service areas */}
      <Section tone="dark" image="/img/gallery/shower-replacement17.webp" imageFocus="left">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHead align="left" eyebrow="Where we work"
                         title="Proudly serving NoVA, Maryland" accent="& the DC metro" />
            <p className="mt-5 text-white/75">
              Based in Woodbridge and working across both states. Pick your city to see what we do
              there, what the housing stock is like, and what a project usually involves.
            </p>
            <CityChips limit={14} tone="dark" />
          </div>
          <div className="relative">
            <Mascot n={6} width={120} className="-top-28 right-2" />
            <div className="rounded-panel bg-white/5 p-8 ring-1 ring-white/10">
              <h3 className="font-display text-xl font-bold text-white">Not sure if you are in range?</h3>
              <p className="mt-3 text-sm text-white/70">
                Call us and we will tell you straight away rather than sending someone on a wasted trip.
              </p>
              <a href={business.phone.href} data-analytics="call-click" data-location="service-areas"
                 className="mt-6 inline-flex items-center gap-2.5 font-display text-2xl font-bold text-white hover:text-sage">
                <Phone width={22} height={22} className="text-sage" /> {business.phone.display}
              </a>
              <p className="mt-2 text-sm text-white/50">{business.hoursDisplay}</p>
              <Link href="/service-areas/" className="btn-outline mt-6 w-full">All service areas <ArrowRight /></Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Expertise */}
      <Section tone="cream">
        <SectionHead eyebrow="What we do best" title="Expert bath remodeling in" accent="NoVA & Maryland" />
        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {EXPERTISE.map((e) => (
            <li key={e.title}>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-teal text-white">
                <Check width={20} height={20} />
              </span>
              <h3 className="mt-4 font-display text-base font-bold">{e.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{e.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Before / after */}
      {sliderPairs.length > 0 && (
        <Section tone="white">
          <div className="relative">
            <Mascot n={8} width={112} className="-top-14 right-4 xl:right-16" />
            <SectionHead eyebrow="Before & after" title="From outdated to" accent="outstanding"
                         lead="Real Clear Day projects. Drag the handle to see the same bathroom before and after." />
          </div>
          <div className="mx-auto mt-12 max-w-4xl">
            <BeforeAfterSlider pair={sliderPairs[0]} label="Clear Day bathroom project" />
          </div>
          <div className="mt-10 text-center">
            <Link href="/gallery/" className="btn-outline">See the full gallery <ArrowRight /></Link>
          </div>
        </Section>
      )}

      {/* Stats + reviews */}
      <Section tone="dark">
        <div className="relative">
          <Mascot n={3} width={124} className="-top-12 left-0 xl:-left-8" />
          <SectionHead title="What sets us" accent="apart" />
        </div>
        <StatsRow />
        <div className="mt-20">
          <SectionHead align="left" eyebrow="What our clients say" title="Reviews &" accent="testimonials" />
          <Testimonials />
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="cream">
        <SectionHead eyebrow="Common questions" title="Bath remodeling" accent="FAQs" />
        <FaqAccordion faqs={faqs.general} />
      </Section>

      <CtaBand />
      <Marquee tone="mint" />
    </>
  );
}
