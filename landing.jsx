// landing.jsx — Asori marketing site (Dutch). Exported to window.
const { useState: useSL2, useEffect: useEL2 } = React;

function Landing({ toGapp }) {
  return (
    <div className="scroll" style={{ height: '100vh', overflowY: 'auto', background: 'var(--paper)' }}>
      <LandingNav toGapp={toGapp} />
      <LandingHero toGapp={toGapp} />
      <TrustBar />
      <HowItWorks />
      <GuaranteeBlock />
      <BranchesBlock />
      <PricingBlock toGapp={toGapp} />
      <LandingFooter />
    </div>
  );
}

function LandingNav({ toGapp }) {
  const links = ['Hoe het werkt', 'Branches', 'Tarieven'];
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 20, backdropFilter: 'blur(12px)', background: 'color-mix(in srgb, var(--paper) 82%, transparent)', borderBottom: '1px solid var(--line)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 20 }}>
        <Wordmark size={20} />
        <nav style={{ display: 'flex', gap: 26, marginLeft: 28 }}>
          {links.map(l => <a key={l} href="#" style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink-2)', textDecoration: 'none' }}>{l}</a>)}
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={toGapp} className="focusable" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>Inloggen</button>
          <Btn primary onClick={toGapp}>Probeer gratis</Btn>
        </div>
      </div>
    </div>
  );
}

function LandingHero({ toGapp }) {
  return (
    <section style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 32px 40px', display: 'grid', gridTemplateColumns: '1fr 0.92fr', gap: 48, alignItems: 'center' }}>
      <div className="fade-up">
        <Badge soft="var(--primary-soft)" color="var(--primary)" dot>Nederlandse AI · neemt op vanaf de eerste rinkel</Badge>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 52, lineHeight: 1.04, letterSpacing: '-.03em', color: 'var(--ink)', margin: '20px 0 0' }}>
          De telefoon gaat.<br />Asori neemt op.
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.55, color: 'var(--ink-2)', margin: '20px 0 0', maxWidth: 460, textWrap: 'pretty' }}>
          Een digitale receptionist die in vloeiend Nederlands afspraken inplant in je agenda, korte vragen beantwoordt en netjes doorschakelt wanneer het moet. 24/7, voor het MKB.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
          <Btn primary icon="phone" onClick={toGapp}>Plan een demo-gesprek</Btn>
          <Btn icon="play" onClick={toGapp}>Bekijk de console</Btn>
        </div>
        <div style={{ display: 'flex', gap: 26, marginTop: 30 }}>
          {[['0,7s', 'gem. responstijd'], ['10', 'branches'], ['63%', 'belt → boekt']].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 24, color: 'var(--ink)' }}><AnimNumber value={n} /></div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <HeroDemo />
    </section>
  );
}

// mini live-call demo card on the hero
const HERO_BEATS = [
  { who: 'asori', t: 'U spreekt met de digitale assistent van Salon Lumière. Hoe kan ik u helpen?' },
  { who: 'caller', t: 'Ik wil graag donderdagavond geknipt worden.' },
  { who: 'tool', t: 'check_beschikbaarheid → do 19:30 vrij' },
  { who: 'asori', t: 'Donderdag 19:30 kan bij Imran. Zal ik het vastleggen?' },
  { who: 'caller', t: 'Ja, op naam van Daan Visser.' },
  { who: 'booked', t: 'Afspraak geboekt · sms verstuurd' },
];

function HeroDemo() {
  const [n, setN] = useSL2(1);
  useEL2(() => {
    const id = setInterval(() => setN(v => (v >= HERO_BEATS.length ? 1 : v + 1)), 1700);
    return () => clearInterval(id);
  }, []);
  const shown = HERO_BEATS.slice(0, n);
  return (
    <div className="fade-up" style={{ animationDelay: '.12s', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '14px 18px', borderBottom: '1px solid var(--line)', background: 'var(--surface-2)' }}>
        <AsoriMark size={26} />
        <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--ink)' }}>Inkomend gesprek</div>
        <Badge color="var(--live)" soft="var(--live-soft)" dot live>LIVE</Badge>
        <div style={{ marginLeft: 'auto' }}><Waveform active color="var(--live)" height={20} bars={12} idle /></div>
      </div>
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 320, justifyContent: 'flex-end' }}>
        {shown.map((b, i) => {
          if (b.who === 'tool') return (
            <div key={i} className="fade-up" style={{ alignSelf: 'center', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--info)', background: 'var(--info-soft)', padding: '6px 11px', borderRadius: 8 }}>{b.t}</div>
          );
          if (b.who === 'booked') return (
            <div key={i} className="fade-up" style={{ alignSelf: 'center', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-soft)', padding: '8px 14px', borderRadius: 99 }}>
              <Icon name="calendar-check" size={15} stroke={2} />{b.t}</div>
          );
          const asori = b.who === 'asori';
          return (
            <div key={i} className="fade-up" style={{ display: 'flex', flexDirection: asori ? 'row' : 'row-reverse', gap: 8 }}>
              <div style={{ maxWidth: '82%', padding: '9px 13px', borderRadius: asori ? '4px 13px 13px 13px' : '13px 4px 13px 13px',
                background: asori ? 'var(--primary-soft)' : 'var(--surface-2)', border: '1px solid ' + (asori ? 'transparent' : 'var(--line)'),
                fontSize: 13.5, lineHeight: 1.45, color: 'var(--ink)' }}>{b.t}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrustBar() {
  const items = ['Salon Lumière', 'Tandarts de Vries', 'Bistro Noord', 'Fysio Zuid', 'Garage Hofman', 'Beauty by Noor'];
  return (
    <div style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: 'var(--surface-2)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 30, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12.5, color: 'var(--ink-3)', fontWeight: 600 }}>Vertrouwd door MKB-ondernemers</span>
        {items.map(i => <span key={i} style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--ink-3)' }}>{i}</span>)}
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { icon: 'phone', n: '01', t: 'Beller belt je nummer', d: 'Asori neemt op met een vaste, transparante begroeting — de beller weet dat het een digitale assistent is.' },
    { icon: 'chat', n: '02', t: 'Natuurlijk Nederlands gesprek', d: 'Luistert, stelt de juiste vragen en begrijpt de branche. Geen keuzemenu, geen toetsen indrukken.' },
    { icon: 'calendar-check', n: '03', t: 'Afspraak in je agenda', d: 'Checkt beschikbaarheid, boekt in Google Agenda en stuurt een sms-bevestiging. Of schakelt netjes door.' },
  ];
  return (
    <section style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
      <Reveal><SectionHead kicker="Hoe het werkt" title="Van rinkel tot agenda in één gesprek" /></Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginTop: 40 }}>
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 90}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Glyph name={s.icon} size={44} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-3)', fontWeight: 600 }}>{s.n}</span>
            </div>
            <h3 style={{ margin: '18px 0 8px', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, color: 'var(--ink)', letterSpacing: '-.01em' }}>{s.t}</h3>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--ink-2)' }}>{s.d}</p>
          </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function GuaranteeBlock() {
  return (
    <section style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'color-mix(in srgb, var(--paper) 70%, transparent)', fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            <Icon name="shieldCheck" size={16} /> De harde regel
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 38, lineHeight: 1.1, letterSpacing: '-.02em', margin: '18px 0 0' }}>Asori verzint niets en belooft niets.</h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.6, margin: '18px 0 0', color: 'color-mix(in srgb, var(--paper) 78%, transparent)', maxWidth: 440, textWrap: 'pretty' }}>
            Een afspraak heet pas “geboekt” als de boekingstool écht <code style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--paper)' }}>success: true</code> teruggaf. Geen verzonnen tijden, geen valse beloftes. Dat is ingebakken, bovenaan elke prompt.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            ['shieldCheck', 'Transparant volgens de EU AI Act', 'Vaste begroeting: de beller weet dat het digitaal is.'],
            ['pin', 'Multi-tenant per nummer', 'Elk Twilio-nummer hoort bij precies één klant en branche.'],
            ['bolt', 'Snel waar het telt', 'Off-pipeline werk en event-loop-hygiëne houden het gesprek vloeiend.'],
          ].map(([ic, t, d]) => (
            <div key={t} style={{ display: 'flex', gap: 14, padding: '16px 18px', borderRadius: 'var(--radius)', background: 'color-mix(in srgb, var(--paper) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--paper) 14%, transparent)' }}>
              <Icon name={ic} size={22} style={{ flexShrink: 0, marginTop: 1, color: 'var(--paper)' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{t}</div>
                <div style={{ fontSize: 13.5, color: 'color-mix(in srgb, var(--paper) 72%, transparent)', marginTop: 3, lineHeight: 1.5 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BranchesBlock() {
  return (
    <section style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
      <Reveal><SectionHead kicker="Branches" title="Eén persoonlijkheid, tien vakgebieden" sub="Het gedrag per branche komt uit een template — met eigen voorbeeldgesprekken, doorschakelregels en valkuilen." /></Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginTop: 40 }}>
        {window.TEMPLATES.map((t, i) => (
          <Reveal key={t.id} delay={i * 45}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: 18, textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}><Glyph name={t.icon} size={40} /></div>
            <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--ink)', marginTop: 11 }}>{t.naam}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{t.term}</div>
          </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function PricingBlock({ toGapp }) {
  const tiers = [
    { name: 'Start', price: '€49', per: '/mnd', d: 'Voor één locatie die de telefoon nooit meer wil missen.', feats: ['1 telefoonnummer', 'Tot 150 gesprekken/mnd', 'Google Agenda-koppeling', 'Sms-bevestigingen'], cta: 'Begin gratis' },
    { name: 'Pro', price: '€99', per: '/mnd', d: 'Voor drukke praktijken en zaken met meerdere medewerkers.', feats: ['Tot 600 gesprekken/mnd', 'Meerdere medewerkers & agenda’s', 'A/B-test je prompts', 'Prioriteit doorschakelen'], cta: 'Probeer Pro', hot: true },
    { name: 'Schaal', price: 'Op maat', per: '', d: 'Meerdere locaties of een eigen branche-template.', feats: ['Onbeperkt volume', 'Eigen branche-template', 'Dedicated nummerreeks', 'Begeleide pilot'], cta: 'Neem contact op' },
  ];
  return (
    <section style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px' }}>
        <Reveal><SectionHead kicker="Tarieven" title="Eén gemiste beller verdient het al terug" /></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginTop: 40 }}>
          {tiers.map((t, ti) => (
            <Reveal key={t.name} delay={ti * 100}>
            <div style={{ position: 'relative', background: 'var(--surface)', border: '1px solid ' + (t.hot ? 'var(--primary)' : 'var(--line)'), borderRadius: 'var(--radius-lg)', padding: 26, boxShadow: t.hot ? 'var(--shadow)' : 'var(--shadow-sm)' }}>
              {t.hot && <span style={{ position: 'absolute', top: -11, left: 26, background: 'var(--primary)', color: 'var(--on-primary)', fontSize: 11.5, fontWeight: 700, padding: '4px 11px', borderRadius: 99 }}>Populair</span>}
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{t.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, margin: '12px 0 6px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 38, letterSpacing: '-.02em', color: 'var(--ink)' }}>{t.price}</span>
                <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>{t.per}</span>
              </div>
              <p style={{ margin: '0 0 18px', fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.5, minHeight: 40 }}>{t.d}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
                {t.feats.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--ink)' }}>
                    <Icon name="check" size={16} stroke={2.4} style={{ color: 'var(--primary)', flexShrink: 0 }} />{f}
                  </div>
                ))}
              </div>
              <button onClick={toGapp} className="focusable" style={{ width: '100%', padding: '11px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-ui)',
                border: t.hot ? '1px solid transparent' : '1px solid var(--line)', background: t.hot ? 'var(--primary)' : 'var(--surface)', color: t.hot ? 'var(--on-primary)' : 'var(--ink)' }}>{t.cta}</button>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHead({ kicker, title, sub }) {
  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{kicker}</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 34, lineHeight: 1.12, letterSpacing: '-.02em', color: 'var(--ink)', margin: '12px 0 0' }}>{title}</h2>
      {sub && <p style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--ink-2)', margin: '14px 0 0', textWrap: 'pretty' }}>{sub}</p>}
    </div>
  );
}

function LandingFooter() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'color-mix(in srgb, var(--paper) 70%, transparent)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 32px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ filter: 'invert(1) hue-rotate(180deg)', opacity: .92 }}><Wordmark size={20} /></div>
        <p style={{ margin: 0, fontSize: 13, maxWidth: 380, lineHeight: 1.5 }}>Nederlandse AI-telefoonreceptionist voor het MKB. Gemaakt in Amsterdam.</p>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 22, fontSize: 13 }}>
          {['Privacy', 'Voorwaarden', 'Status', 'Contact'].map(l => <a key={l} href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{l}</a>)}
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Landing });
