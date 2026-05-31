// landing.jsx — Asori marketing site (Dutch). Exported to window.
const { useState: useSL2, useEffect: useEL2 } = React;

// Tracks viewport width so the layout can collapse on tablet/mobile. The landing
// is a nested scroll container (body has overflow:hidden), so we can't rely on
// CSS media queries against the document the way a normal page would — and inline
// styles can't hold media queries anyway. One listener, shared via props.
function useVW() {
  const [vw, setVw] = useSL2(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEL2(() => {
    const on = () => setVw(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return vw;
}

// Smooth-scroll to a section inside the landing's own scroll container.
const scrollToId = id => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

function Landing({ toGapp }) {
  const vw = useVW();
  return (
    <div className="scroll" style={{ height: '100vh', overflowY: 'auto', background: 'var(--paper)' }}>
      <LandingNav toGapp={toGapp} vw={vw} />
      <LandingHero toGapp={toGapp} vw={vw} />
      <TrustBar vw={vw} />
      <HowItWorks vw={vw} />
      <GuaranteeBlock vw={vw} />
      <BranchesBlock vw={vw} />
      <PricingBlock toGapp={toGapp} vw={vw} />
      <FaqBlock vw={vw} />
      <FinalCTA toGapp={toGapp} vw={vw} />
      <LandingFooter vw={vw} toGapp={toGapp} />
    </div>
  );
}

const NAV_LINKS = [['Hoe het werkt', 'hoe'], ['Branches', 'branches'], ['Tarieven', 'tarieven'], ['Vragen', 'faq']];

function LandingNav({ toGapp, vw }) {
  const mob = vw < 760;
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 20, backdropFilter: 'blur(12px)', background: 'color-mix(in srgb, var(--paper) 82%, transparent)', borderBottom: '1px solid var(--line)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: mob ? '12px 20px' : '14px 32px', display: 'flex', alignItems: 'center', gap: 20 }}>
        <button onClick={() => scrollToId('top')} className="focusable" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }} aria-label="Naar boven"><Wordmark size={20} /></button>
        {!mob && (
          <nav style={{ display: 'flex', gap: 26, marginLeft: 28 }}>
            {NAV_LINKS.map(([l, id]) => (
              <a key={id} href={'#' + id} onClick={e => { e.preventDefault(); scrollToId(id); }} className="focusable"
                style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink-2)', textDecoration: 'none' }}>{l}</a>
            ))}
          </nav>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {!mob && <button onClick={toGapp} className="focusable" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>Inloggen</button>}
          <Btn primary onClick={toGapp}>Probeer gratis</Btn>
        </div>
      </div>
    </div>
  );
}

function LandingHero({ toGapp, vw }) {
  const stack = vw < 940;
  const mob = vw < 680;
  return (
    <section id="top" style={{ maxWidth: 1120, margin: '0 auto', padding: mob ? '40px 20px 32px' : '64px 32px 40px', display: 'grid', gridTemplateColumns: stack ? '1fr' : '1fr 0.92fr', gap: stack ? 36 : 48, alignItems: 'center' }}>
      <div className="fade-up">
        <Badge soft="var(--primary-soft)" color="var(--primary)" dot>Nederlandse AI · neemt op vanaf de eerste rinkel</Badge>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(34px, 7vw, 52px)', lineHeight: 1.04, letterSpacing: '-.03em', color: 'var(--ink)', margin: '20px 0 0' }}>
          De telefoon gaat.<br />Asori neemt op.
        </h1>
        <p style={{ fontSize: mob ? 16.5 : 18, lineHeight: 1.55, color: 'var(--ink-2)', margin: '20px 0 0', maxWidth: 460, textWrap: 'pretty' }}>
          Een digitale receptionist die in vloeiend Nederlands afspraken inplant in je agenda, korte vragen beantwoordt en netjes doorschakelt wanneer het moet. 24/7, voor het MKB.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
          <Btn primary icon="phone" onClick={toGapp}>Plan een demo-gesprek</Btn>
          <Btn icon="play" onClick={toGapp}>Bekijk de console</Btn>
        </div>
        <div style={{ display: 'flex', gap: mob ? 18 : 26, marginTop: 30, flexWrap: 'wrap' }}>
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

function TrustBar({ vw }) {
  const mob = vw < 680;
  const items = ['Salon Lumière', 'Tandarts de Vries', 'Bistro Noord', 'Fysio Zuid', 'Garage Hofman', 'Beauty by Noor'];
  return (
    <div style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: 'var(--surface-2)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: mob ? '18px 20px' : '20px 32px', display: 'flex', alignItems: 'center', justifyContent: mob ? 'center' : 'flex-start', gap: mob ? 18 : 30, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12.5, color: 'var(--ink-3)', fontWeight: 600 }}>Vertrouwd door MKB-ondernemers</span>
        {items.map(i => <span key={i} style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--ink-3)' }}>{i}</span>)}
      </div>
    </div>
  );
}

function HowItWorks({ vw }) {
  const mob = vw < 760;
  const steps = [
    { icon: 'phone', n: '01', t: 'Beller belt je nummer', d: 'Asori neemt op met een vaste, transparante begroeting — de beller weet dat het een digitale assistent is.' },
    { icon: 'chat', n: '02', t: 'Natuurlijk Nederlands gesprek', d: 'Luistert, stelt de juiste vragen en begrijpt de branche. Geen keuzemenu, geen toetsen indrukken.' },
    { icon: 'calendar-check', n: '03', t: 'Afspraak in je agenda', d: 'Checkt beschikbaarheid, boekt in Google Agenda en stuurt een sms-bevestiging. Of schakelt netjes door.' },
  ];
  return (
    <section id="hoe" style={{ maxWidth: 1120, margin: '0 auto', padding: mob ? '52px 20px' : '72px 32px', scrollMarginTop: 70 }}>
      <Reveal><SectionHead kicker="Hoe het werkt" title="Van rinkel tot agenda in één gesprek" /></Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : 'repeat(3,1fr)', gap: 18, marginTop: 40 }}>
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 90}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow-sm)', height: '100%' }}>
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

function GuaranteeBlock({ vw }) {
  const stack = vw < 860;
  const mob = vw < 680;
  return (
    <section style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: mob ? '52px 20px' : '72px 32px', display: 'grid', gridTemplateColumns: stack ? '1fr' : '1fr 1fr', gap: stack ? 36 : 56, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'color-mix(in srgb, var(--paper) 70%, transparent)', fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            <Icon name="shieldCheck" size={16} /> De harde regel
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(28px, 5vw, 38px)', lineHeight: 1.1, letterSpacing: '-.02em', margin: '18px 0 0' }}>Asori verzint niets en belooft niets.</h2>
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

function BranchesBlock({ vw }) {
  const cols = vw < 560 ? 2 : vw < 900 ? 3 : 5;
  const mob = vw < 680;
  return (
    <section id="branches" style={{ maxWidth: 1120, margin: '0 auto', padding: mob ? '52px 20px' : '72px 32px', scrollMarginTop: 70 }}>
      <Reveal><SectionHead kicker="Branches" title="Eén persoonlijkheid, tien vakgebieden" sub="Het gedrag per branche komt uit een template — met eigen voorbeeldgesprekken, doorschakelregels en valkuilen." /></Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 12, marginTop: 40 }}>
        {window.TEMPLATES.map((t, i) => (
          <Reveal key={t.id} delay={i * 45}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: 18, textAlign: 'center', boxShadow: 'var(--shadow-sm)', height: '100%' }}>
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

function PricingBlock({ toGapp, vw }) {
  const stack = vw < 860;
  const mob = vw < 680;
  const tiers = [
    { name: 'Start', price: '€49', per: '/mnd', d: 'Voor één locatie die de telefoon nooit meer wil missen.', feats: ['1 telefoonnummer', 'Tot 150 gesprekken/mnd', 'Google Agenda-koppeling', 'Sms-bevestigingen'], cta: 'Begin gratis' },
    { name: 'Pro', price: '€99', per: '/mnd', d: 'Voor drukke praktijken en zaken met meerdere medewerkers.', feats: ['Tot 600 gesprekken/mnd', 'Meerdere medewerkers & agenda’s', 'A/B-test je prompts', 'Prioriteit doorschakelen'], cta: 'Probeer Pro', hot: true },
    { name: 'Schaal', price: 'Op maat', per: '', d: 'Meerdere locaties of een eigen branche-template.', feats: ['Onbeperkt volume', 'Eigen branche-template', 'Dedicated nummerreeks', 'Begeleide pilot'], cta: 'Neem contact op' },
  ];
  return (
    <section id="tarieven" style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', scrollMarginTop: 70 }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: mob ? '52px 20px' : '72px 32px' }}>
        <Reveal><SectionHead kicker="Tarieven" title="Eén gemiste beller verdient het al terug" /></Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: stack ? '1fr' : 'repeat(3,1fr)', gap: 18, marginTop: 40, maxWidth: stack ? 460 : 'none', marginLeft: stack ? 'auto' : undefined, marginRight: stack ? 'auto' : undefined }}>
          {tiers.map((t, ti) => (
            <Reveal key={t.name} delay={ti * 100}>
            <div style={{ position: 'relative', background: 'var(--surface)', border: '1px solid ' + (t.hot ? 'var(--primary)' : 'var(--line)'), borderRadius: 'var(--radius-lg)', padding: 26, boxShadow: t.hot ? 'var(--shadow)' : 'var(--shadow-sm)', height: '100%' }}>
              {t.hot && <span style={{ position: 'absolute', top: -11, left: 26, background: 'var(--primary)', color: 'var(--on-primary)', fontSize: 11.5, fontWeight: 700, padding: '4px 11px', borderRadius: 99 }}>Populair</span>}
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{t.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, margin: '12px 0 6px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 38, letterSpacing: '-.02em', color: 'var(--ink)' }}>{t.price}</span>
                <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>{t.per}</span>
              </div>
              <p style={{ margin: '0 0 18px', fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.5, minHeight: mob ? 0 : 40 }}>{t.d}</p>
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

const FAQS = [
  ['Hoort de beller dat het een AI is?', 'Ja. Asori opent élk gesprek met een vaste, transparante begroeting dat het een digitale assistent is — conform de EU AI Act. Geen verwarring, geen trucjes.'],
  ['Wat als Asori iets niet weet of niet kan?', 'Dan schakelt Asori netjes door naar jou of een collega. Asori verzint nooit een antwoord en belooft nooit iets dat niet via een tool bevestigd is.'],
  ['Werkt het met mijn agenda?', 'Asori koppelt aan Google Agenda. Het checkt live de beschikbaarheid vóór het een tijd voorstelt en boekt direct in de juiste agenda.'],
  ['Hoe snel sta ik live?', 'Je kiest een branche-template, koppelt je nummer en agenda, en doet een begeleide pilot van een paar gesprekken. Daarna staat je nummer live.'],
  ['In welke talen werkt Asori?', 'Asori spreekt vloeiend Nederlands. Belt iemand in een andere taal, dan schakelt Asori door naar een medewerker.'],
];

function FaqBlock({ vw }) {
  const mob = vw < 680;
  const [open, setOpen] = useSL2(0);
  return (
    <section id="faq" style={{ maxWidth: 820, margin: '0 auto', padding: mob ? '52px 20px' : '72px 32px', scrollMarginTop: 70 }}>
      <Reveal><SectionHead kicker="Vragen" title="Wat ondernemers vaak vragen" /></Reveal>
      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {FAQS.map(([q, a], i) => {
          const on = open === i;
          return (
            <Reveal key={i} delay={i * 50}>
            <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)', background: 'var(--surface)', overflow: 'hidden' }}>
              <button onClick={() => setOpen(on ? -1 : i)} className="focusable" aria-expanded={on}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ flex: 1, fontSize: 15.5, fontWeight: 600, color: 'var(--ink)' }}>{q}</span>
                <Icon name="chevD" size={18} style={{ color: 'var(--ink-3)', flexShrink: 0, transform: on ? 'rotate(180deg)' : 'none', transition: 'transform .25s var(--ease-out)' }} />
              </button>
              {on && <div className="fade-in" style={{ padding: '0 20px 18px', fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-2)', maxWidth: 660 }}>{a}</div>}
            </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function FinalCTA({ toGapp, vw }) {
  const mob = vw < 680;
  return (
    <section style={{ maxWidth: 1120, margin: '0 auto', padding: mob ? '8px 20px 52px' : '20px 32px 88px' }}>
      <Reveal>
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)', background: 'var(--primary)', color: 'var(--on-primary)', padding: mob ? '40px 26px' : '64px 56px', textAlign: 'center' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(28px, 5vw, 40px)', lineHeight: 1.1, letterSpacing: '-.02em', margin: 0 }}>Geen gemiste beller meer.</h2>
          <p style={{ fontSize: 17, lineHeight: 1.55, margin: '16px auto 28px', maxWidth: 440, color: 'color-mix(in srgb, var(--on-primary) 86%, transparent)' }}>Zet Asori vandaag op je nummer en laat elke beller te woord staan — dag en nacht, in vloeiend Nederlands.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={toGapp} className="focusable" style={{ padding: '13px 24px', borderRadius: 11, border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-ui)', background: 'var(--on-primary)', color: 'var(--primary)' }}>Probeer gratis</button>
            <button onClick={toGapp} className="focusable" style={{ padding: '13px 24px', borderRadius: 11, cursor: 'pointer', fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-ui)', background: 'transparent', color: 'var(--on-primary)', border: '1px solid color-mix(in srgb, var(--on-primary) 45%, transparent)' }}>Bekijk de console</button>
          </div>
        </div>
        <div aria-hidden="true" style={{ position: 'absolute', right: -60, top: -60, width: 240, height: 240, borderRadius: '50%', background: 'color-mix(in srgb, var(--on-primary) 10%, transparent)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', left: -40, bottom: -80, width: 200, height: 200, borderRadius: '50%', background: 'color-mix(in srgb, var(--on-primary) 8%, transparent)' }} />
      </div>
      </Reveal>
    </section>
  );
}

function SectionHead({ kicker, title, sub }) {
  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{kicker}</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(26px, 4.5vw, 34px)', lineHeight: 1.12, letterSpacing: '-.02em', color: 'var(--ink)', margin: '12px 0 0' }}>{title}</h2>
      {sub && <p style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--ink-2)', margin: '14px 0 0', textWrap: 'pretty' }}>{sub}</p>}
    </div>
  );
}

function LandingFooter({ vw, toGapp }) {
  const mob = vw < 680;
  const year = new Date().getFullYear();
  const cols = [
    { h: 'Product', items: [['Hoe het werkt', () => scrollToId('hoe')], ['Branches', () => scrollToId('branches')], ['Tarieven', () => scrollToId('tarieven')], ['Vragen', () => scrollToId('faq')]] },
    { h: 'Bedrijf', items: [['Operator-console', toGapp], ['Status', toGapp], ['Privacy', () => window.asoriToast('Privacybeleid volgt bij livegang', 'shield')], ['Voorwaarden', () => window.asoriToast('Voorwaarden volgen bij livegang', 'shield')]] },
  ];
  const linkStyle = { background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', fontSize: 13, fontFamily: 'var(--font-ui)', textAlign: 'left' };
  return (
    <footer style={{ background: 'var(--ink)', color: 'color-mix(in srgb, var(--paper) 70%, transparent)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: mob ? '40px 20px 28px' : '56px 32px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1.4fr 1fr 1fr', gap: mob ? 28 : 40 }}>
          <div>
            <div style={{ filter: 'invert(1) hue-rotate(180deg)', opacity: .92 }}><Wordmark size={20} /></div>
            <p style={{ margin: '14px 0 0', fontSize: 13, maxWidth: 320, lineHeight: 1.55 }}>Nederlandse AI-telefoonreceptionist voor het MKB. Neemt op, plant in, schakelt door. Gemaakt in Amsterdam.</p>
          </div>
          {cols.map(c => (
            <div key={c.h}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'color-mix(in srgb, var(--paper) 55%, transparent)', marginBottom: 14 }}>{c.h}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {c.items.map(([l, fn]) => <button key={l} onClick={fn} className="focusable" style={linkStyle}>{l}</button>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 36, paddingTop: 22, borderTop: '1px solid color-mix(in srgb, var(--paper) 16%, transparent)', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12.5 }}>© {year} Asori. Alle rechten voorbehouden.</span>
          <a href="mailto:hallo@asori.nl" className="focusable" style={{ marginLeft: mob ? 0 : 'auto', color: 'inherit', textDecoration: 'none', fontSize: 12.5, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <Icon name="message" size={14} /> hallo@asori.nl
          </a>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Landing });
