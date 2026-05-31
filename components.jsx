// components.jsx — shared UI primitives. Exported to window at bottom.
const { useState, useEffect, useRef } = React;

/* ----------------------------- Motion utils ----------------------------- */
function useMounted(delay = 0) {
  const [on, setOn] = useState(false);
  useEffect(() => { const id = setTimeout(() => setOn(true), delay); return () => clearTimeout(id); }, []);
  return on;
}

// Animates the numeric part of a value (e.g. 142, "0.7s", "63%") counting up.
function AnimNumber({ value, dur = 1100 }) {
  const str = String(value);
  const numStr = (str.match(/\d+([.,]\d+)?/) || [])[0];
  const animatable = numStr && !str.includes(':');
  const sep = numStr && numStr.includes(',') ? ',' : '.';
  const target = animatable ? parseFloat(numStr.replace(',', '.')) : 0;
  const fracM = animatable && numStr.match(/[.,](\d+)/);
  const decimals = fracM ? fracM[1].length : 0;
  const [v, setV] = useState(animatable ? 0 : null);
  useEffect(() => {
    if (!animatable) return;
    let raf, start;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setV(target * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  if (!animatable) return <React.Fragment>{str}</React.Fragment>;
  const shown = v.toFixed(decimals).replace('.', sep);
  return <React.Fragment>{str.replace(numStr, shown)}</React.Fragment>;
}

function useInView() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.14 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return [ref, seen];
}

function Reveal({ children, delay = 0, y = 20, style }) {
  const [ref, seen] = useInView();
  return (
    <div ref={ref} style={{ opacity: seen ? 1 : 0, transform: seen ? 'none' : `translateY(${y}px)`,
      transition: `opacity .65s var(--ease-out) ${delay}ms, transform .7s var(--ease-out) ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

/* ----------------------------- Icons ----------------------------- */
const ICONS = {
  grid:    'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  users:   'M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M20 19v-1.4a3.5 3.5 0 0 0-2.6-3.4M15 4.2a3.5 3.5 0 0 1 0 6.6',
  chat:    'M20 14a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z',
  layers:  'M12 3 3 8l9 5 9-5zM3 13l9 5 9-5M3 18l9 5 9-5',
  wave:    'M3 12h2l2-6 3 14 3-18 3 14 2-4h3',
  calendar:'M7 3v3M17 3v3M4 8h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1',
  settings:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19.4 13a7.7 7.7 0 0 0 0-2l1.7-1.3-1.7-3-2 .8a7.6 7.6 0 0 0-1.7-1l-.3-2.1h-3.4l-.3 2.1a7.6 7.6 0 0 0-1.7 1l-2-.8-1.7 3L7 11a7.7 7.7 0 0 0 0 2l-1.7 1.3 1.7 3 2-.8a7.6 7.6 0 0 0 1.7 1l.3 2.1h3.4l.3-2.1a7.6 7.6 0 0 0 1.7-1l2 .8 1.7-3z',
  phone:   'M5 4h3l1.5 4.5L7.5 10a12 12 0 0 0 5 5l1.5-2 4.5 1.5V18a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2',
  'phone-forward':'M14 4h6m0 0v6m0-6-7 7M3 5h3l1.5 4.5L5.5 11a12 12 0 0 0 5 5l1.5-2 4.5 1.5V18a2 2 0 0 1-2 2A15 15 0 0 1 1 7a2 2 0 0 1 2-2',
  'phone-off':'M11 5h2l1.5 4.5-1.6 1.2M3 3l18 18M9.5 9.5A12 12 0 0 0 14 14M5 5A15 15 0 0 0 16 19a2 2 0 0 0 2-1.5',
  'calendar-check':'M7 3v3M17 3v3M4 8h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1M9 14l2 2 4-4',
  message: 'M20 14a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z',
  alert:   'M12 9v4m0 4h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0',
  check:   'M5 12l5 5L20 7',
  arrowUp: 'M12 19V5M5 12l7-7 7 7',
  arrowDn: 'M12 5v14M5 12l7 7 7-7',
  bolt:    'M13 2 4 14h6l-1 8 9-12h-6z',
  shield:  'M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z',
  shieldCheck:'M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6zM9 12l2 2 4-4',
  search:  'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14M20 20l-3.5-3.5',
  plus:    'M12 5v14M5 12h14',
  clock:   'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 7v5l3 2',
  dot:     'M12 12h.01',
  chevR:   'M9 6l6 6-6 6',
  chevD:   'M6 9l6 6 6-6',
  external:'M14 4h6v6M20 4l-9 9M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5',
  x:       'M6 6l12 12M18 6 6 18',
  sliders: 'M4 8h10M18 8h2M4 16h2M10 16h10M14 6v4M8 14v4',
  play:    'M7 4l13 8-13 8z',
  pause:   'M8 5h3v14H8zM13 5h3v14h-3z',
  restart: 'M4 4v6h6M20 20v-6h-6M5 10a8 8 0 0 1 14-2M19 14a8 8 0 0 1-14 2',
  pin:     'M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5',
  sms:     'M21 11.5a8.4 8.4 0 0 1-9 8.4L3 21l1.1-3.6A8.4 8.4 0 1 1 21 11.5',
  // branche glyphs
  scissors:'M6 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4M6 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4M8 8l12 8M8 16 20 8',
  tooth:   'M12 5c-2-2-5-2-6 .5-1 2.4 0 5 .5 8 .4 2.4 1 3.5 2 3.5 1.2 0 1-2.5 1.5-2.5s.3 2.5 1.5 2.5c1 0 1.6-1.1 2-3.5.5-3 1.5-5.6.5-8C17 3 14 3 12 5',
  activity:'M3 12h4l3 8 4-16 3 8h4',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z',
  utensils:'M5 3v7a2 2 0 0 0 2 2M8 3v18M8 3v7M16 3c-1.5 0-2 2-2 5s.5 4 2 4M16 12v9',
  wrench:  'M14 7a4 4 0 0 1 5 5l-2-1-2 2 1 2a4 4 0 0 1-5-5L4 17a2 2 0 1 0 3 3l5-6',
  hammer:  'M14 6l4 4M16 8l4.5-1.5L19 4l-1.5 1.5M13 7l-9 9a2 2 0 0 0 3 3l9-9',
  home:    'M4 11l8-7 8 7M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9',
  briefcase:'M4 8h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2',
  scale:   'M12 4v16M7 20h10M6 4h12M6 4 3 11h6zM18 4l-3 7h6zM3 11a3 3 0 0 0 6 0M15 11a3 3 0 0 0 6 0',
};

function Icon({ name, size = 18, stroke = 1.7, fill = 'none', style, className }) {
  const d = ICONS[name] || ICONS.dot;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style} className={className} aria-hidden="true">
      {d.split('M').filter(Boolean).map((seg, i) => <path key={i} d={'M' + seg} />)}
    </svg>
  );
}

/* ----------------------------- Wordmark ----------------------------- */
function Wordmark({ size = 22, mono }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <AsoriMark size={size * 1.25} />
      {!mono && <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: size, letterSpacing: '-.02em', color: 'var(--ink)' }}>asori</span>}
    </div>
  );
}
function AsoriMark({ size = 28 }) {
  // concentric "voice" arcs — a listening dot radiating
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="9" fill="var(--primary)" />
      <circle cx="16" cy="16" r="3" fill="var(--on-primary)" />
      <path d="M22 11a8 8 0 0 1 0 10" stroke="var(--on-primary)" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
      <path d="M10 21a8 8 0 0 1 0-10" stroke="var(--on-primary)" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

/* ----------------------------- Status dot ----------------------------- */
function StatusDot({ color = 'var(--primary)', live, size = 8 }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: size, height: size }}>
      <span style={{ width: size, height: size, borderRadius: 99, background: color,
        boxShadow: live ? `0 0 0 0 ${color}, 0 0 8px 1px color-mix(in srgb, ${color} 60%, transparent)` : 'none',
        animation: live ? 'asori-pulse 1.4s ease-in-out infinite' : 'none' }} />
      {live && <span style={{ position: 'absolute', inset: -3, borderRadius: 99, border: `1.5px solid ${color}`, opacity: .4, animation: 'asori-pulse 1.4s ease-in-out infinite' }} />}
    </span>
  );
}

/* ----------------------------- Badge ----------------------------- */
function Badge({ children, color = 'var(--ink-2)', soft = 'var(--line-2)', icon, dot, live }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 9px 3px 8px',
      borderRadius: 99, background: soft, color, fontSize: 12, fontWeight: 600, lineHeight: 1.4, whiteSpace: 'nowrap' }}>
      {dot && <StatusDot color={color} live={live} size={7} />}
      {icon && <Icon name={icon} size={13} stroke={2} />}
      {children}
    </span>
  );
}

function OutcomeBadge({ outcome }) {
  const o = window.OUTCOMES[outcome];
  if (!o) return null;
  return <Badge color={o.color} soft={o.soft} icon={o.icon} dot={outcome === 'in_progress'} live={outcome === 'in_progress'}>{o.label}</Badge>;
}

const MATURITY = {
  green:  { c: 'var(--primary)', label: 'Klaar voor pilot' },
  amber:  { c: 'var(--amber)',   label: 'Extra test nodig' },
  orange: { c: '#C9772E',        label: 'Beperkt' },
  red:    { c: 'var(--live)',    label: 'Risicogevoelig' },
};

/* ----------------------------- Glyph tile ----------------------------- */
function Glyph({ name, size = 38, tone = 'var(--primary)', soft = 'var(--primary-soft)' }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size * .32, background: soft, color: tone,
      display: 'grid', placeItems: 'center', flexShrink: 0 }}>
      <Icon name={name} size={size * .5} stroke={1.8} />
    </div>
  );
}

/* ----------------------------- Card ----------------------------- */
function Card({ children, style, pad = 18, className = '', onClick, hover }) {
  const [h, setH] = useState(false);
  return (
    <div className={className} onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius)',
        padding: pad, boxShadow: hover && h ? 'var(--shadow)' : 'var(--shadow-sm)',
        transition: 'box-shadow .28s var(--ease-out), border-color .2s, transform .28s var(--ease-out)', cursor: onClick ? 'pointer' : 'default',
        transform: hover && h ? 'translateY(-3px)' : 'none',
        borderColor: hover && h ? 'color-mix(in srgb, var(--primary) 30%, var(--line))' : 'var(--line)', ...style }}>
      {children}
    </div>
  );
}

/* ----------------------------- Sparkline ----------------------------- */
function Sparkline({ data, w = 120, h = 36, stroke = 'var(--primary)', fill = true }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => [ (i / (data.length - 1)) * w, h - ((v - min) / (max - min || 1)) * (h - 4) - 2 ]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ` L${w} ${h} L0 ${h} Z`;
  const gid = 'sg' + Math.round(w + h + data[0]);
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={stroke} stopOpacity=".18" /><stop offset="100%" stopColor={stroke} stopOpacity="0" />
      </linearGradient></defs>
      {fill && <path d={area} fill={`url(#${gid})`} className="fade-in" style={{ animationDelay: '.2s' }} />}
      <path d={line} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        pathLength="1" style={{ strokeDasharray: 1, animation: 'asori-draw 1.2s var(--ease-out) both' }} />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.6" fill={stroke} className="pop-in" style={{ animationDelay: '1s' }} />
    </svg>
  );
}

/* ----------------------------- Waveform (live) ----------------------------- */
function Waveform({ active, bars = 28, color = 'var(--live)', height = 30, idle = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, height }}>
      {Array.from({ length: bars }).map((_, i) => {
        const seed = (Math.sin(i * 1.7) + 1) / 2;
        return (
          <span key={i} style={{ width: 3, height: '100%', borderRadius: 3, background: color,
            transformOrigin: 'center',
            opacity: active ? 0.55 + seed * 0.45 : 0.25,
            animation: active ? `asori-bar ${0.5 + seed * 0.7}s ease-in-out ${i * 0.045}s infinite` : 'none',
            transform: active ? 'none' : `scaleY(${idle ? 0.18 + seed * 0.12 : 0.2})` }} />
        );
      })}
    </div>
  );
}

/* ----------------------------- Avatar ----------------------------- */
function Avatar({ name, size = 32 }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const hue = (name.charCodeAt(0) * 13 + name.length * 7) % 360;
  return (
    <div style={{ width: size, height: size, borderRadius: 99, flexShrink: 0,
      background: `oklch(0.92 0.04 ${hue})`, color: `oklch(0.42 0.09 ${hue})`,
      display: 'grid', placeItems: 'center', fontSize: size * .38, fontWeight: 700, fontFamily: 'var(--font-ui)' }}>
      {initials}
    </div>
  );
}

/* ----------------------------- Sidebar ----------------------------- */
const NAV = [
  { id: 'overzicht', label: 'Overzicht', icon: 'grid' },
  { id: 'live', label: 'Live gesprek', icon: 'wave', live: true },
  { id: 'agenda', label: 'Agenda', icon: 'calendar' },
  { id: 'gesprekken', label: 'Gesprekken', icon: 'chat' },
  { id: 'klanten', label: 'Klanten', icon: 'users' },
  { id: 'templates', label: 'Templates', icon: 'layers' },
];

function Sidebar({ route, setRoute, liveCount }) {
  const navRef = useRef(null);
  const [ind, setInd] = useState({ top: 0, h: 0, show: false });
  useEffect(() => {
    const el = navRef.current && navRef.current.querySelector(`[data-nav="${route}"]`);
    if (el) setInd({ top: el.offsetTop, h: el.offsetHeight, show: true });
  }, [route]);
  return (
    <aside style={{ width: 232, flexShrink: 0, borderRight: '1px solid var(--line)', background: 'var(--surface-2)',
      display: 'flex', flexDirection: 'column', padding: '18px 14px' }}>
      <div style={{ padding: '4px 8px 18px' }}><Wordmark size={20} /></div>

      <nav ref={navRef} style={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: ind.top, height: ind.h, borderRadius: 10,
          background: 'var(--surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--line)',
          opacity: ind.show ? 1 : 0, transition: 'top .42s var(--ease-spring), height .3s var(--ease-out), opacity .3s', pointerEvents: 'none' }} />
        {NAV.map(n => {
          const on = route === n.id;
          return (
            <button key={n.id} data-nav={n.id} className="focusable" onClick={() => setRoute(n.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 11px', borderRadius: 10,
                border: 'none', cursor: 'pointer', textAlign: 'left', position: 'relative', zIndex: 1, background: 'transparent',
                color: on ? 'var(--ink)' : 'var(--ink-2)', fontSize: 14, fontWeight: on ? 600 : 500,
                transition: 'color .25s' }}
              onMouseEnter={e => { if (!on) e.currentTarget.style.color = 'var(--ink)'; }}
              onMouseLeave={e => { if (!on) e.currentTarget.style.color = 'var(--ink-2)'; }}>
              <Icon name={n.icon} size={18} stroke={on ? 2 : 1.7} style={{ color: on ? 'var(--primary)' : 'var(--ink-3)', transition: 'color .25s', transform: on ? 'scale(1.05)' : 'none' }} />
              {n.label}
              {n.live && liveCount > 0 && (
                <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <StatusDot color="var(--live)" live size={7} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--live)' }}>{liveCount}</span>
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ padding: '12px 12px', borderRadius: 12, background: 'var(--primary-soft)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Icon name="shieldCheck" size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink)' }}>Verzint niets</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.45, marginTop: 2 }}>Een afspraak telt pas als de tool <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5 }}>success:true</span> gaf.</div>
          </div>
        </div>
        <button onClick={() => window.asoriToast && window.asoriToast('Accountinstellingen — binnenkort', 'settings')} className="focusable" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-2)', fontSize: 13.5, fontWeight: 500 }}>
          <Avatar name="Rakesh B" size={26} /> Rakesh B.
          <Icon name="settings" size={15} style={{ marginLeft: 'auto', color: 'var(--ink-3)' }} />
        </button>
      </div>
    </aside>
  );
}

/* ----------------------------- TopBar ----------------------------- */
function TopBar({ title, subtitle, children }) {
  return (
    <header style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 28px 16px', borderBottom: '1px solid var(--line)' }}>
      <div style={{ minWidth: 0 }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 23, letterSpacing: '-.02em', color: 'var(--ink)' }}>{title}</h1>
        {subtitle && <p style={{ margin: '3px 0 0', fontSize: 13.5, color: 'var(--ink-2)' }}>{subtitle}</p>}
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>{children}</div>
    </header>
  );
}

function Btn({ children, primary, icon, onClick, sm, ghost }) {
  const [h, setH] = useState(false);
  const [down, setDown] = useState(false);
  const base = { display: 'inline-flex', alignItems: 'center', gap: 7, padding: sm ? '6px 11px' : '8px 14px',
    borderRadius: 10, fontSize: sm ? 13 : 13.5, fontWeight: 600, cursor: 'pointer',
    transition: 'transform .14s var(--ease-spring), background .15s, box-shadow .15s, color .15s',
    transform: down ? 'scale(.95)' : h ? 'scale(1.02)' : 'scale(1)',
    fontFamily: 'var(--font-ui)', whiteSpace: 'nowrap' };
  const style = primary
    ? { ...base, background: h ? 'var(--primary-h)' : 'var(--primary)', color: 'var(--on-primary)', border: '1px solid transparent', boxShadow: h ? 'var(--shadow)' : 'var(--shadow-sm)' }
    : ghost
    ? { ...base, background: h ? 'var(--line-2)' : 'transparent', color: 'var(--ink-2)', border: '1px solid transparent' }
    : { ...base, background: h ? 'var(--surface-2)' : 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-sm)' };
  return (
    <button className="focusable" onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => { setH(false); setDown(false); }}
      onMouseDown={() => setDown(true)} onMouseUp={() => setDown(false)} style={style}>
      {icon && <Icon name={icon} size={sm ? 15 : 16} stroke={2} />}{children}
    </button>
  );
}

Object.assign(window, { Icon, ICONS, Wordmark, AsoriMark, StatusDot, Badge, OutcomeBadge, MATURITY, Glyph, Card, Sparkline, Waveform, Avatar, Sidebar, TopBar, Btn, NAV, AnimNumber, useMounted, useInView, Reveal });
