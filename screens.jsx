// screens.jsx — Overview, Gesprekken, Klanten, Templates + drawers
const { useState: useS, useEffect: useE } = React;

/* =============================== OVERVIEW =============================== */
function Overview({ goLive, openConv }) {
  const M = window.METRICS;
  const mounted = useMounted(120);
  const stats = [
    { label: 'Gesprekken vandaag', value: M.callsToday, trend: M.callsTrend, spark: M.series, icon: 'phone' },
    { label: 'Afspraken geboekt', value: M.booked, trend: M.bookedTrend, sub: M.bookRate + '% conversie', icon: 'calendar-check' },
    { label: 'Doorgeschakeld', value: M.transferred, sub: 'klacht / spoed / scope', icon: 'phone-forward' },
    { label: 'Gem. responstijd', value: M.avgTtft, sub: 'ttft · ' + M.avgDur + ' gesprek', icon: 'bolt' },
  ];
  return (
    <div className="scroll" style={{ flex: 1, padding: '22px 28px 40px', minHeight: 0 }}>
      {/* live banner */}
      <div onClick={goLive} className="fade-up" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderRadius: 'var(--radius)', background: 'var(--surface)', border: '1px solid var(--live)', boxShadow: 'var(--shadow-sm)', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--live-soft)', opacity: .35 }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
          <StatusDot color="var(--live)" live size={11} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--ink)' }}>1 gesprek nu live</div>
            <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>Salon Lumière · knipafspraak in de maak</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
            <Waveform active color="var(--live)" height={26} bars={16} idle />
            <Btn icon="wave" primary sm>Meeluisteren</Btn>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 14 }}>
        {stats.map((s, i) => (
          <Card key={i} className="fade-up" style={{ animationDelay: i * 40 + 'ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <Glyph name={s.icon} size={34} />
              {s.trend != null && (
                <Badge color={s.trend >= 0 ? 'var(--primary)' : 'var(--live)'} soft={s.trend >= 0 ? 'var(--primary-soft)' : 'var(--live-soft)'} icon={s.trend >= 0 ? 'arrowUp' : 'arrowDn'}>{Math.abs(s.trend)}%</Badge>
              )}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 32, letterSpacing: '-.02em', color: 'var(--ink)', lineHeight: 1 }}><AnimNumber value={s.value} /></div>
            <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 6 }}>{s.label}</div>
            {s.sub && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 3 }}>{s.sub}</div>}
            {s.spark && <div style={{ marginTop: 12 }}><Sparkline data={s.spark} w={200} h={34} /></div>}
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14, marginBottom: 14 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>Gespreksvolume vandaag</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginTop: 2 }}>Per uur · piek rond 09:00 en 13:00</div>
            </div>
            <Badge soft="var(--line-2)">Live</Badge>
          </div>
          <HourBars data={M.hours} />
        </Card>

        <Card>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)', marginBottom: 16 }}>Uitkomst van gesprekken</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {M.byOutcome.map(o => {
              const meta = window.OUTCOMES[o.k];
              return (
                <div key={o.k}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--ink)' }}><span style={{ width: 9, height: 9, borderRadius: 3, background: meta.color }} />{meta.label}</span>
                    <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{o.v}%</span>
                  </div>
                  <div style={{ height: 7, borderRadius: 99, background: 'var(--line-2)', overflow: 'hidden' }}>
                    <div style={{ width: (mounted ? o.v : 0) + '%', height: '100%', background: meta.color, borderRadius: 99, transition: 'width 1s var(--ease-out)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14 }}>
        <Card pad={0}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px 12px' }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>Recente gesprekken</div>
            <Btn sm ghost icon="chat" onClick={() => openConv()}>Alles</Btn>
          </div>
          <div>
            {window.CONVERSATIONS.slice(0, 5).map(c => <ConvRow key={c.id} c={c} onClick={() => openConv(c)} compact />)}
          </div>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)', marginBottom: 14 }}>Systeemstatus</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {window.SYSTEM.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <StatusDot color={s.status === 'ok' ? 'var(--primary)' : s.status === 'warn' ? 'var(--amber)' : 'var(--live)'} live={s.status !== 'ok'} size={8} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{s.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{s.detail}</div>
                </div>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', textAlign: 'right' }}>{s.meta}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function HourBars({ data }) {
  const max = Math.max(...data.map(d => d.v));
  const slice = data.slice(6, 21);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 130 }}>
      {slice.map((d, i) => {
        const now = d.h === 13;
        return (
          <div key={d.h} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
            <div title={d.v + ' gesprekken'} style={{ width: '100%', maxWidth: 22, height: Math.max(3, (d.v / max) * 100) + '%', borderRadius: 5,
              background: now ? 'var(--live)' : 'var(--primary)', opacity: now ? 1 : .82,
              transformOrigin: 'bottom', animation: `asori-grow .65s var(--ease-out) ${i * 0.035}s both`,
              boxShadow: now ? '0 0 0 0 var(--live)' : 'none' }} />
            <span style={{ fontSize: 10, color: now ? 'var(--live)' : 'var(--ink-3)', fontFamily: 'var(--font-mono)', fontWeight: now ? 700 : 400 }}>{d.h}</span>
          </div>
        );
      })}
    </div>
  );
}

/* =============================== CONVERSATIONS =============================== */
const CONV_FILTERS = [
  { k: 'all', label: 'Alle' },
  { k: 'appointment_booked', label: 'Geboekt' },
  { k: 'transferred', label: 'Doorgeschakeld' },
  { k: 'answered', label: 'Beantwoord' },
  { k: 'hangup', label: 'Opgehangen' },
];

function Conversations({ openConv, initial }) {
  const [filter, setFilter] = useS('all');
  const [q, setQ] = useS('');
  const list = window.CONVERSATIONS.filter(c =>
    (filter === 'all' || c.outcome === filter) &&
    (q === '' || (c.clientName + c.summary + c.caller).toLowerCase().includes(q.toLowerCase())));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 28px', borderBottom: '1px solid var(--line)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {CONV_FILTERS.map(f => (
            <button key={f.k} onClick={() => setFilter(f.k)} className="focusable"
              style={{ padding: '7px 13px', borderRadius: 9, border: '1px solid ' + (filter === f.k ? 'transparent' : 'var(--line)'), cursor: 'pointer',
                background: filter === f.k ? 'var(--ink)' : 'var(--surface)', color: filter === f.k ? 'var(--paper)' : 'var(--ink-2)', fontSize: 13, fontWeight: 600 }}>{f.label}</button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 9, border: '1px solid var(--line)', background: 'var(--surface)', width: 230 }}>
          <Icon name="search" size={15} style={{ color: 'var(--ink-3)' }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Zoek gesprek of klant…" style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--ink)', width: '100%' }} />
        </div>
      </div>
      <div className="scroll" style={{ flex: 1, minHeight: 0, padding: '6px 0' }}>
        {list.map(c => <ConvRow key={c.id} c={c} onClick={() => openConv(c)} />)}
        {list.length === 0 && <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-3)', fontSize: 14 }}>Geen gesprekken gevonden.</div>}
      </div>
    </div>
  );
}

function ConvRow({ c, onClick, compact }) {
  const live = c.outcome === 'in_progress';
  const tpl = window.TEMPLATES.find(t => t.id === c.type);
  return (
    <button onClick={onClick} className="focusable"
      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: compact ? '11px 18px' : '13px 28px', border: 'none', borderBottom: '1px solid var(--line-2)', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <Glyph name={tpl ? tpl.icon : 'phone'} size={compact ? 32 : 38} />
      <div style={{ minWidth: 0, flex: compact ? '0 0 150px' : '0 0 200px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.clientName}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>{c.caller}</div>
      </div>
      {!compact && <div style={{ flex: 1, minWidth: 0, fontSize: 13.5, color: 'var(--ink-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{live ? <span style={{ color: 'var(--live)', fontWeight: 600 }}>● </span> : ''}{c.summary}</div>}
      <div style={{ marginLeft: compact ? 'auto' : 0 }}><OutcomeBadge outcome={c.outcome} /></div>
      <div style={{ width: compact ? 52 : 70, textAlign: 'right', fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>{compact ? c.when : c.dur}</div>
      {!compact && <Icon name="chevR" size={16} style={{ color: 'var(--ink-3)' }} />}
    </button>
  );
}

/* =============================== CLIENTS =============================== */
function Clients({ openClient }) {
  const [q, setQ] = useS('');
  const list = window.CLIENTS.filter(c => q === '' || (c.name + c.stad).toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 28px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 9, border: '1px solid var(--line)', background: 'var(--surface)', width: 260 }}>
          <Icon name="search" size={15} style={{ color: 'var(--ink-3)' }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Zoek klant of stad…" style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--ink)', width: '100%' }} />
        </div>
        <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{list.length} klanten</span>
        <div style={{ marginLeft: 'auto' }}><Btn primary icon="plus" onClick={() => window.asoriToast('Klant aanmaken opent de onboarding-flow', 'plus')}>Nieuwe klant</Btn></div>
      </div>
      <div className="scroll" style={{ flex: 1, minHeight: 0, padding: '20px 28px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {list.map((c, i) => {
            const tpl = window.TEMPLATES.find(t => t.id === c.type);
            return (
              <Card key={c.id} hover onClick={() => openClient(c)} className="fade-up" style={{ animationDelay: i * 30 + 'ms' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13 }}>
                  <Glyph name={tpl ? tpl.icon : 'phone'} size={44} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 15.5, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                      {c.live && <StatusDot color="var(--live)" live size={8} />}
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 1 }}>{tpl ? tpl.naam : c.type} · {c.stad}</div>
                  </div>
                  {!c.active && <Badge soft="var(--line-2)" color="var(--ink-3)">Inactief</Badge>}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-2)', marginTop: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="phone" size={13} style={{ color: 'var(--ink-3)' }} />{c.number}
                </div>
                <div style={{ display: 'flex', gap: 18, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line-2)' }}>
                  <Stat label="7 dagen" value={c.calls7 + ' calls'} />
                  <Stat label="Conversie" value={c.conv + '%'} accent />
                  <Stat label="Agenda" value={c.google ? 'Gekoppeld' : 'Open'} warn={!c.google} />
                  <div style={{ marginLeft: 'auto', alignSelf: 'flex-end', fontSize: 11.5, color: 'var(--ink-3)' }}>{c.lastCall}</div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent, warn }) {
  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, color: warn ? 'var(--amber)' : accent ? 'var(--primary)' : 'var(--ink)' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>{label}</div>
    </div>
  );
}

/* =============================== TEMPLATES =============================== */
function Templates({ openTemplate }) {
  return (
    <div className="scroll" style={{ flex: 1, minHeight: 0, padding: '22px 28px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        {Object.entries(window.MATURITY).map(([k, m]) => (
          <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--ink-2)' }}>
            <span style={{ width: 9, height: 9, borderRadius: 99, background: m.c }} />{m.label}
          </span>
        ))}
        <div style={{ marginLeft: 'auto' }}><Btn icon="plus" onClick={() => window.asoriToast('Nieuw template — gebruik /nieuwe-template in de repo', 'plus')}>Nieuw template</Btn></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {window.TEMPLATES.map((t, i) => {
          const m = window.MATURITY[t.maturity];
          return (
            <Card key={t.id} hover onClick={() => openTemplate(t)} className="fade-up" style={{ animationDelay: i * 25 + 'ms' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Glyph name={t.icon} size={42} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15.5, color: 'var(--ink)' }}>{t.naam}</div>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-3)' }}>{t.id}</code>
                </div>
                <span title={m.label} style={{ width: 11, height: 11, borderRadius: 99, background: m.c, flexShrink: 0 }} />
              </div>
              <p style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5, minHeight: 38 }}>{t.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Badge soft="var(--surface-2)" color="var(--ink-2)" icon="bolt"><code style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{t.tool}</code></Badge>
                <Badge soft="var(--line-2)" color="var(--ink-3)">{t.clients} klanten</Badge>
                {t.conv != null && <Badge soft="var(--primary-soft)" color="var(--primary)">{t.conv}% conv.</Badge>}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* =============================== AGENDA =============================== */
const AG_START = 8, AG_END = 21, AG_HOUR = 58; // first/last hour shown, px per hour
const AG_NOW = 14 + 32 / 60;                   // 14:32 — aligns with the live call

// deterministic hue per branche id (same spirit as Avatar) so each vak reads distinct
function agHue(type) {
  let s = 0; for (let i = 0; i < type.length; i++) s += type.charCodeAt(i) * (i + 3);
  return (s * 7) % 360;
}
function agFmt(h) { const hh = Math.floor(h + 1e-6), mm = Math.round((h - hh) * 60); return hh + ':' + String(mm).padStart(2, '0'); }

// greedy lane assignment + overlap-cluster width, so overlapping appointments sit side by side
function agLayout(items) {
  const evs = items.map(e => ({ ...e })).sort((a, b) => a.start - b.start || b.dur - a.dur);
  const ends = [];
  evs.forEach(e => {
    let c = 0; while (c < ends.length && ends[c] > e.start + 1e-6) c++;
    e._col = c; ends[c] = e.start + e.dur / 60;
  });
  let i = 0;
  while (i < evs.length) {
    let j = i, maxEnd = evs[i].start + evs[i].dur / 60, ncol = evs[i]._col + 1;
    while (j + 1 < evs.length && evs[j + 1].start < maxEnd - 1e-6) {
      j++; maxEnd = Math.max(maxEnd, evs[j].start + evs[j].dur / 60); ncol = Math.max(ncol, evs[j]._col + 1);
    }
    for (let k = i; k <= j; k++) evs[k]._cols = ncol;
    i = j + 1;
  }
  return evs;
}

const AG_GUT = 56;

function Agenda({ openClient }) {
  const days = window.WEEK_DAYS, today = window.TODAY_IDX, appts = window.APPOINTMENTS;
  const scrollRef = React.useRef(null);
  const hours = []; for (let h = AG_START; h <= AG_END; h++) hours.push(h);
  const totalH = (AG_END - AG_START) * AG_HOUR;
  const todayCount = appts.filter(a => a.day === today).length;
  const scrollToNow = () => {
    const el = scrollRef.current; if (!el) return;
    el.scrollTo({ top: Math.max(0, (AG_NOW - AG_START) * AG_HOUR - 150), behavior: 'smooth' });
  };
  useE(() => { const el = scrollRef.current; if (el) el.scrollTop = Math.max(0, (AG_NOW - AG_START) * AG_HOUR - 150); }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 28px', borderBottom: '1px solid var(--line)', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--ink)' }}>26 – 31 mei</span>
        <Badge soft="var(--line-2)" color="var(--ink-3)">2026</Badge>
        <button onClick={scrollToNow} className="focusable"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 9, border: '1px solid var(--line)', background: 'var(--surface)', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>
          <StatusDot color="var(--live)" live size={7} /> Nu · {agFmt(AG_NOW)}
        </button>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--ink-3)' }}>
          <strong style={{ color: 'var(--ink)' }}>{appts.length}</strong> afspraken deze week · <strong style={{ color: 'var(--ink)' }}>{todayCount}</strong> vandaag
        </span>
      </div>

      <div ref={scrollRef} className="scroll" style={{ flex: 1, minHeight: 0 }}>
        <div style={{ padding: '0 28px 40px' }}>
          {/* sticky weekday header */}
          <div style={{ position: 'sticky', top: 0, zIndex: 3, display: 'flex',
            background: 'color-mix(in srgb, var(--paper) 88%, transparent)', backdropFilter: 'blur(8px)',
            padding: '14px 0 10px', marginBottom: 2 }}>
            <div style={{ width: AG_GUT, flexShrink: 0 }} />
            {days.map((d, di) => {
              const on = di === today;
              return (
                <div key={di} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: on ? 'var(--primary)' : 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{d.lbl}</div>
                  <div style={{ display: 'inline-grid', placeItems: 'center', width: 30, height: 30, marginTop: 3, borderRadius: 99,
                    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16,
                    background: on ? 'var(--primary)' : 'transparent', color: on ? 'var(--on-primary)' : 'var(--ink)' }}>{d.date}</div>
                </div>
              );
            })}
          </div>

          {/* grid canvas */}
          <div style={{ position: 'relative', height: totalH }}>
            {hours.map(h => {
              const top = (h - AG_START) * AG_HOUR;
              return (
                <React.Fragment key={h}>
                  <div style={{ position: 'absolute', left: 0, width: AG_GUT - 10, top: top - 7, textAlign: 'right',
                    fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>{h}:00</div>
                  <div style={{ position: 'absolute', left: AG_GUT, right: 0, top, borderTop: '1px solid var(--line-2)' }} />
                </React.Fragment>
              );
            })}
            <div style={{ position: 'absolute', left: AG_GUT, right: 0, top: 0, bottom: 0, display: 'flex' }}>
              {days.map((d, di) => {
                const on = di === today;
                const dayAppts = agLayout(appts.filter(a => a.day === di));
                return (
                  <div key={di} style={{ flex: 1, position: 'relative', borderLeft: '1px solid var(--line-2)',
                    background: on ? 'color-mix(in srgb, var(--primary) 4%, transparent)' : 'transparent' }}>
                    {dayAppts.map((a, ai) => <ApptBlock key={ai} a={a} openClient={openClient} />)}
                    {on && <NowLine />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NowLine() {
  const top = (AG_NOW - AG_START) * AG_HOUR;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, zIndex: 4, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: -4, top: -4, width: 8, height: 8, borderRadius: 99, background: 'var(--live)', boxShadow: '0 0 0 3px color-mix(in srgb, var(--live) 22%, transparent)' }} />
      <div style={{ height: 2, background: 'var(--live)', borderRadius: 2 }} />
    </div>
  );
}

function ApptBlock({ a, openClient }) {
  const [h, setH] = useS(false);
  const hue = agHue(a.type);
  const tone = `oklch(0.58 0.14 ${hue})`;
  const top = (a.start - AG_START) * AG_HOUR;
  const height = Math.max(20, (a.dur / 60) * AG_HOUR - 4);
  const cols = a._cols || 1;
  const mid = height >= 34, tall = height >= 54;
  const client = window.CLIENTS.find(c => c.name === a.client) || window.CLIENTS.find(c => c.type === a.type);
  return (
    <button className="focusable" onClick={() => client && openClient(client)}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      title={`${agFmt(a.start)}–${agFmt(a.start + a.dur / 60)} · ${a.dienst} · ${a.client}`}
      style={{ position: 'absolute', top, height,
        left: `calc(${(a._col || 0) / cols * 100}% + 2px)`, width: `calc(${100 / cols}% - 5px)`,
        textAlign: 'left', cursor: 'pointer', overflow: 'hidden',
        padding: tall ? '6px 9px' : mid ? '4px 9px' : '2px 8px',
        borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)',
        borderLeft: `3px solid ${tone}`,
        background: h ? `color-mix(in srgb, ${tone} 16%, var(--surface))` : `color-mix(in srgb, ${tone} 8%, var(--surface))`,
        boxShadow: h ? 'var(--shadow)' : 'var(--shadow-sm)', transform: h ? 'translateY(-1px)' : 'none',
        transition: 'background .18s, box-shadow .2s var(--ease-out), transform .2s var(--ease-out)', zIndex: h ? 5 : 1,
        animation: `asori-fade .4s var(--ease-out) both` }}>
      {a.live && <span style={{ position: 'absolute', top: 6, right: 6 }}><StatusDot color="var(--live)" live size={7} /></span>}
      {mid && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-3)', lineHeight: 1.2 }}>{agFmt(a.start)}</div>}
      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.dienst}</div>
      {mid && <div style={{ fontSize: 11, color: 'var(--ink-2)', lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.client}{tall && a.who !== '—' ? ' · ' + a.who : ''}</div>}
    </button>
  );
}

Object.assign(window, { Overview, Conversations, ConvRow, Clients, Templates, Stat, Agenda });
