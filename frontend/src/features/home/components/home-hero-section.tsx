import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactElement } from 'react';

import { HomeCtaLink } from '@/features/home/components/home-cta-link';
import type { HomePageResponse } from '@/generated/public-home.contract';

/* ─────────────────────────────────────────────────────────────────────────────
   Pharmaceutical visual system
   All decorative elements are aria-hidden.
   Animations:
     - slow orbital rotation on the rings
     - gentle float on the glass orb and capsules
     - opacity pulse on the heartbeat ECG path
   @media(prefers-reduced-motion) handled via useReducedMotion() — all
   animate/transition props become empty / zero-duration when reduced.
───────────────────────────────────────────────────────────────────────────── */

type PharmaVisualProps = {
  readonly shouldReduceMotion: boolean | null;
};

/** Center a fixed-size box around the visual focal point (50 % x, 46 % y). */
function centeredStyle(size: number, dx = 0, dy = 0): CSSProperties {
  return {
    position: 'absolute',
    top: '46%',
    left: '50%',
    marginTop: -(size / 2) + dy,
    marginLeft: -(size / 2) + dx,
    width: size,
    height: size,
  };
}

function PharmaVisual({ shouldReduceMotion }: PharmaVisualProps): ReactElement {
  const rm = shouldReduceMotion;

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden"
      style={{ minHeight: 400, height: '100%' }}
    >
      {/* ── Background colour blobs ──────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute"
        style={{ top: '-4%', right: '-4%', width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(130,217,210,0.22) 0%, transparent 70%)',
          filter: 'blur(40px)' }}
      />
      <div
        className="pointer-events-none absolute"
        style={{ bottom: '2%', left: '-6%', width: 260, height: 260, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(110,136,232,0.18) 0%, transparent 70%)',
          filter: 'blur(36px)' }}
      />
      <div
        className="pointer-events-none absolute"
        style={{ bottom: '30%', right: '20%', width: 180, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,235,255,0.55) 0%, transparent 70%)',
          filter: 'blur(24px)' }}
      />

      {/* ── Outer orbital ring (clockwise) ───────────────────────────────── */}
      <motion.div
        animate={rm ? {} : { rotate: 360 }}
        style={{
          ...centeredStyle(340),
          borderRadius: '50%',
          border: '1px solid rgba(110,136,232,0.15)',
        }}
        transition={rm ? { duration: 0 } : { duration: 42, repeat: Infinity, ease: 'linear' }}
      >
        {/* Aqua orbiting dot */}
        <div style={{
          position: 'absolute', top: -6, left: '50%', marginLeft: -6,
          width: 12, height: 12, borderRadius: '50%',
          background: '#82D9D2', opacity: 0.75,
          boxShadow: '0 0 8px rgba(130,217,210,0.6)',
        }} />
        {/* Periwinkle dot at 135° */}
        <div style={{
          position: 'absolute', bottom: 28, right: 28,
          width: 8, height: 8, borderRadius: '50%',
          background: '#6E88E8', opacity: 0.55,
        }} />
      </motion.div>

      {/* ── Inner dashed orbital ring (counter-clockwise) ────────────────── */}
      <motion.div
        animate={rm ? {} : { rotate: -360 }}
        style={{
          ...centeredStyle(220),
          borderRadius: '50%',
          border: '1px dashed rgba(130,217,210,0.24)',
        }}
        transition={rm ? { duration: 0 } : { duration: 26, repeat: Infinity, ease: 'linear' }}
      >
        {/* Lavender dot at 270° (left) */}
        <div style={{
          position: 'absolute', top: '50%', left: -5, marginTop: -5,
          width: 10, height: 10, borderRadius: '50%',
          background: '#ECEBFF', border: '1px solid rgba(110,136,232,0.4)',
        }} />
      </motion.div>

      {/* ── Main glass orb — visual anchor ──────────────────────────────── */}
      <motion.div
        animate={rm ? {} : { y: [0, -10, 0] }}
        style={{
          ...centeredStyle(164),
          borderRadius: '50%',
          background: 'radial-gradient(circle at 36% 32%, rgba(255,255,255,0.88) 0%, rgba(236,235,255,0.40) 55%, rgba(110,136,232,0.07) 100%)',
          border: '1px solid rgba(255,255,255,0.92)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,1), 0 8px 40px rgba(110,136,232,0.14)',
          backdropFilter: 'blur(6px)',
        }}
        transition={rm ? { duration: 0 } : { duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Primary capsule (upper-right of orb) ────────────────────────── */}
      <motion.div
        animate={rm ? {} : { y: [0, -14, 0], rotate: [-6, -4, -6] }}
        style={{
          position: 'absolute',
          top: '24%',
          left: '62%',
          width: 64,
          height: 26,
          borderRadius: 50,
          background: 'linear-gradient(135deg, #6E88E8 0%, #82D9D2 100%)',
          boxShadow: '0 4px 18px rgba(110,136,232,0.30)',
          overflow: 'hidden',
        }}
        transition={rm ? { duration: 0 } : { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
      >
        {/* Capsule half-divide */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: '50%',
          width: 1, background: 'rgba(255,255,255,0.4)',
        }} />
        {/* Specular highlight */}
        <div style={{
          position: 'absolute', top: 4, left: 8, width: 18, height: 5,
          borderRadius: 10, background: 'rgba(255,255,255,0.45)',
        }} />
      </motion.div>

      {/* ── Secondary capsule (lower-right, coral/lavender) ─────────────── */}
      <motion.div
        animate={rm ? {} : { y: [0, 12, 0], rotate: [10, 8, 10] }}
        style={{
          position: 'absolute',
          top: '64%',
          left: '60%',
          width: 44,
          height: 18,
          borderRadius: 50,
          background: 'linear-gradient(135deg, #F09A8E 0%, #ECEBFF 100%)',
          opacity: 0.85,
          boxShadow: '0 3px 10px rgba(240,154,142,0.25)',
        }}
        transition={rm ? { duration: 0 } : { duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
      />

      {/* ── Full-overlay SVG: molecular connections + heartbeat ─────────── */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        fill="none"
        viewBox="0 0 400 500"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Molecular connection lines */}
        <line stroke="#6E88E8" strokeOpacity="0.28" strokeWidth="0.8" x1="52" x2="148" y1="88" y2="170" />
        <line stroke="#82D9D2" strokeOpacity="0.28" strokeWidth="0.8" x1="148" x2="276" y1="170" y2="118" />
        <line stroke="#6E88E8" strokeOpacity="0.22" strokeWidth="0.8" x1="276" x2="318" y1="118" y2="228" />
        <line stroke="#ECEBFF" strokeOpacity="0.5"  strokeWidth="0.8" x1="148" x2="132" y1="170" y2="306" />
        <line stroke="#82D9D2" strokeOpacity="0.25" strokeWidth="0.8" x1="132" x2="260" y1="306" y2="344" />
        {/* Molecular node dots */}
        <circle cx="52"  cy="88"  fill="#6E88E8" fillOpacity="0.55" r="5" />
        <circle cx="276" cy="118" fill="#82D9D2" fillOpacity="0.65" r="6.5" />
        <circle cx="318" cy="228" fill="#DFF7F0" fillOpacity="1"    r="4.5" stroke="#82D9D2" strokeOpacity="0.5" strokeWidth="1" />
        <circle cx="132" cy="306" fill="#6E88E8" fillOpacity="0.5"  r="5" />
        <circle cx="260" cy="344" fill="#ECEBFF" fillOpacity="1"    r="4.5" stroke="#6E88E8" strokeOpacity="0.38" strokeWidth="0.8" />

        {/* Heartbeat / ECG path — restrained opacity pulse via animate */}
        <motion.path
          animate={rm ? {} : { opacity: [0.45, 0.80, 0.45] }}
          d="M20,340 L80,340 L96,318 L114,362 L130,340 L160,340 L174,314 L190,366 L206,340 L240,340 L252,330 L264,350 L276,340 L380,340"
          stroke="#F09A8E"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          transition={rm ? { duration: 0 } : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>

      {/* ── Fine cross registration marks ────────────────────────────────── */}
      {/* top-right */}
      <div style={{ position: 'absolute', top: '19%', right: '14%' }}>
        <div style={{ width: 16, height: 1, background: 'rgba(110,136,232,0.30)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 1, height: 16, background: 'rgba(110,136,232,0.30)' }} />
      </div>
      {/* bottom-left */}
      <div style={{ position: 'absolute', bottom: '22%', left: '12%' }}>
        <div style={{ width: 14, height: 1, background: 'rgba(130,217,210,0.38)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 1, height: 14, background: 'rgba(130,217,210,0.38)' }} />
      </div>

      {/* ── Experience label — upper-right editorial annotation ─────────── */}
      <div
        style={{
          position: 'absolute',
          top: '7%',
          right: '7%',
          textAlign: 'right',
          lineHeight: 1.45,
          pointerEvents: 'none',
        }}
      >
        <p style={{ fontSize: 11, fontWeight: 500, color: 'rgba(44,52,112,0.52)', letterSpacing: '0.01em' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'rgba(44,52,112,0.72)' }}>+20</span>
          {' '}years of advancing
        </p>
        <p style={{ fontSize: 11, fontWeight: 500, color: 'rgba(44,52,112,0.52)', letterSpacing: '0.01em' }}>
          healthcare in Syria
        </p>
      </div>

      {/* ── Small accent dots ─────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', top: '32%', right: '10%', width: 10, height: 10, borderRadius: '50%', background: '#F09A8E', opacity: 0.65 }} />
      <div style={{ position: 'absolute', bottom: '34%', left: '8%',  width: 7,  height: 7,  borderRadius: '50%', background: '#DFF7F0', boxShadow: '0 0 0 1.5px rgba(130,217,210,0.5)' }} />
      <div style={{ position: 'absolute', top: '14%', right: '32%', width: 5, height: 5, borderRadius: '50%', background: '#6E88E8', opacity: 0.45 }} />
      <div style={{ position: 'absolute', bottom: '14%', right: '18%', width: 6, height: 6, borderRadius: '50%', background: '#82D9D2', opacity: 0.55 }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Hero section
───────────────────────────────────────────────────────────────────────────── */

type HomeHeroSectionProps = {
  readonly homePage: HomePageResponse;
};

export function HomeHeroSection({ homePage }: HomeHeroSectionProps): ReactElement {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative isolate overflow-hidden border-b"
      style={{ background: 'linear-gradient(140deg, #F8FCFC 0%, #FFFFFF 45%, #F0F7FF 100%)' }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 px-4 md:px-6 lg:grid-cols-2 lg:min-h-[88vh] lg:items-center">

        {/* ── Left: editorial text ──────────────────────────────────────── */}
        <motion.div
          className="flex flex-col gap-6 py-20 lg:py-28 lg:pr-10"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          viewport={{ once: true }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5">
            <div className="h-px w-7 shrink-0" style={{ background: '#6E88E8', opacity: 0.7 }} />
            <p
              className="text-xs font-semibold uppercase"
              style={{ color: '#6E88E8', letterSpacing: '0.2em' }}
            >
              FORMULATION / 01 — SYRIA
            </p>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl font-semibold leading-[1.1] tracking-tight text-primary md:text-5xl lg:text-[3rem]"
            id="home-hero-title"
          >
            {homePage.heroTitle}
          </h1>

          {/* Body copy */}
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            {homePage.heroDescription}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <HomeCtaLink href={homePage.primaryCtaUrl} size="lg">
              {homePage.primaryCtaText}
            </HomeCtaLink>
            <HomeCtaLink href={homePage.secondaryCtaUrl} size="lg" variant="outline">
              {homePage.secondaryCtaText}
            </HomeCtaLink>
          </div>
        </motion.div>

        {/* ── Right: pharma visual — hidden on small mobile ─────────────── */}
        <motion.div
          className="hidden sm:block lg:block"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          viewport={{ once: true }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
          style={{ minHeight: 400, height: '100%' }}
        >
          <PharmaVisual shouldReduceMotion={shouldReduceMotion} />
        </motion.div>
      </div>
    </section>
  );
}
