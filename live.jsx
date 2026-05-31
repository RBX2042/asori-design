// live.jsx — the hero: a live call monitor with scripted streaming transcript.
const { useState: useStateL, useEffect: useEffectL, useRef: useRefL } = React;

function fmtClock(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

function LiveCall({ embedded }) {
  const SCRIPT = window.LIVE_SCRIPT;
  const END = SCRIPT[SCRIPT.length - 1].at;
  const [clock, setClock] = useStateL(0);
  const [playing, setPlaying] = useStateL(true);
  const [speed] = useStateL(1);
  const raf = useRefL(null);
  const last = useRefL(null);
  const scrollRef = useRefL(null);

  useEffectL(() => {
    if (!playing) return;
    last.current = performance.now();
    const tick = (now) => {
      const dt = (now - last.current) * speed;
      last.current = now;
      setClock(c => {
        const n = c + dt;
        if (n >= END + 2600) { setPlaying(false); return END + 2600; }
        return n;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, speed]);

  // revealed events
  const events = SCRIPT.filter(e => e.at <= clock && e.type !== 'end');
  const ended = clock >= END;

  // derive who is speaking
  const textEvents = events.filter(e => e.type === 'asori' || e.type === 'caller');
  const lastText = textEvents[textEvents.length - 1];
  const speakDur = lastText ? Math.min(4200, 1200 + lastText.text.length * 42) : 0;
  const speaking = !ended && lastText && clock < lastText.at + speakDur ? lastText.type : null;

  // booking being assembled
  const booked = events.some(e => e.type === 'tool_done' && e.tool === 'maak_afspraak');
  const availChecked = events.some(e => e.type === 'tool' && e.tool === 'check_beschikbaarheid');
  const booking = {
    dienst: events.some(e => e.type === 'caller' && /knip/i.test(e.text)) ? 'Knippen · 30 min' : null,
    medewerker: availChecked ? 'Imran' : null,
    datum: availChecked ? 'do 5 jun' : null,
    tijd: availChecked ? '19:30' : null,
    naam: events.some(e => /Daan Visser/.test(e.text || '')) ? 'Daan Visser' : null,
  };

  useEffectL(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [events.length]);

  const replay = () => { setClock(0); setPlaying(true); };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: embedded ? '1fr' : 'minmax(0,1fr) 318px', gap: 18, height: '100%', minHeight: 0 }}>
      {/* main transcript column */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, gap: 14 }}>
        <CallHeader speaking={speaking} clock={clock} ended={ended} />

        <Card pad={0} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <div ref={scrollRef} className="scroll" style={{ flex: 1, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
            <TranscriptStart />
            {events.map((e, i) => <TranscriptItem key={i} e={e} />)}
            {speaking && <TypingBubble who={speaking} />}
            {ended && <CallEnded booked={booked} />}
          </div>
          <Controls playing={playing} setPlaying={setPlaying} replay={replay} clock={clock} end={END + 2600} ended={ended} />
        </Card>
      </div>

      {/* right rail */}
      {!embedded && (
        <div className="scroll" style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0, overflowY: 'auto', paddingRight: 2 }}>
          <ContextPanel />
          <BookingPanel booking={booking} booked={booked} />
          <PipelinePanel speaking={speaking} clock={clock} />
        </div>
      )}
    </div>
  );
}

function CallHeader({ speaking, clock, ended }) {
  return (
    <Card pad={16} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ position: 'relative' }}>
        <Glyph name="scissors" size={46} />
        {!ended && <span style={{ position: 'absolute', bottom: -3, right: -3, width: 16, height: 16, borderRadius: 99, background: 'var(--live)', border: '2.5px solid var(--surface)', animation: 'asori-pulse 1.4s infinite' }} />}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--ink)' }}>Salon Lumière</span>
          {!ended ? <Badge color="var(--live)" soft="var(--live-soft)" dot live>LIVE</Badge>
                  : <Badge color="var(--primary)" soft="var(--primary-soft)" icon="check">Afgerond</Badge>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, fontSize: 13, color: 'var(--ink-2)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="phone" size={13} /> +31 6 2841 ••90</span>
          <span style={{ fontFamily: 'var(--font-mono)', display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="clock" size={13} />{fmtClock(clock)}</span>
        </div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>{speaking === 'asori' ? 'Asori spreekt' : speaking === 'caller' ? 'Beller spreekt' : 'Luistert'}</div>
        </div>
        <Waveform active={!ended} color={speaking === 'caller' ? 'var(--info)' : 'var(--live)'} height={34} bars={22} idle />
      </div>
    </Card>
  );
}

function TranscriptStart() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: .8 }}>
      <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      <span style={{ fontSize: 11.5, color: 'var(--ink-3)', fontWeight: 600 }}>Gesprek gestart · 14:32</span>
      <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
    </div>
  );
}

function TranscriptItem({ e }) {
  if (e.type === 'tool' || e.type === 'tool_done') return <ToolCall e={e} />;
  const asori = e.type === 'asori';
  return (
    <div className="fade-up" style={{ display: 'flex', gap: 10, flexDirection: asori ? 'row' : 'row-reverse' }}>
      {asori
        ? <div style={{ marginTop: 2 }}><AsoriMark size={28} /></div>
        : <Avatar name="Beller" size={28} />}
      <div style={{ maxWidth: '74%' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', marginBottom: 3, textAlign: asori ? 'left' : 'right' }}>{asori ? 'Asori' : 'Beller'}</div>
        <div style={{ padding: '10px 14px', borderRadius: asori ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
          background: asori ? 'var(--primary-soft)' : 'var(--surface-2)',
          border: '1px solid ' + (asori ? 'transparent' : 'var(--line)'),
          color: 'var(--ink)', fontSize: 14.5, lineHeight: 1.5 }}>{e.text}</div>
      </div>
    </div>
  );
}

function TypingBubble({ who }) {
  const asori = who === 'asori';
  return (
    <div style={{ display: 'flex', gap: 10, flexDirection: asori ? 'row' : 'row-reverse', opacity: .9 }}>
      {asori ? <div style={{ marginTop: 2 }}><AsoriMark size={28} /></div> : <Avatar name="Beller" size={28} />}
      <div style={{ padding: '12px 16px', borderRadius: 14, background: asori ? 'var(--primary-soft)' : 'var(--surface-2)', border: '1px solid ' + (asori ? 'transparent' : 'var(--line)'), display: 'flex', gap: 4, alignItems: 'center' }}>
        {[0, 1, 2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--ink-3)', animation: `asori-blink 1s ${i * 0.18}s infinite` }} />)}
      </div>
    </div>
  );
}

function ToolCall({ e }) {
  const running = e.type === 'tool';
  const success = e.result && /success|vrij/.test(e.result);
  return (
    <div className="fade-up" style={{ alignSelf: 'center', width: '86%', maxWidth: 480 }}>
      <div style={{ borderRadius: 12, border: '1px solid var(--line)', background: 'var(--surface-2)', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: running ? 'var(--info-soft)' : 'var(--primary-soft)', color: running ? 'var(--info)' : 'var(--primary)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          {running
            ? <Icon name="settings" size={16} style={{ animation: 'asori-spin 2s linear infinite' }} />
            : <Icon name="check" size={16} stroke={2.4} />}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>{e.tool}()</code>
            <span style={{ fontSize: 11, fontWeight: 600, color: running ? 'var(--info)' : 'var(--primary)' }}>{running ? 'tool aanroep…' : e.result}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-2)', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.args}</div>
        </div>
      </div>
    </div>
  );
}

function CallEnded({ booked }) {
  return (
    <div className="fade-up" style={{ alignSelf: 'center', marginTop: 4, textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '9px 16px', borderRadius: 99, background: booked ? 'var(--primary-soft)' : 'var(--line-2)', color: booked ? 'var(--primary)' : 'var(--ink-2)', fontSize: 13, fontWeight: 600 }}>
        <Icon name={booked ? 'calendar-check' : 'phone-off'} size={16} stroke={2} />
        {booked ? 'Afspraak geboekt · sms-bevestiging verstuurd' : 'Gesprek beëindigd'}
      </div>
    </div>
  );
}

function Controls({ playing, setPlaying, replay, clock, end, ended }) {
  const pct = Math.min(100, (clock / end) * 100);
  return (
    <div style={{ borderTop: '1px solid var(--line)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <button className="focusable" onClick={() => (ended ? replay() : setPlaying(p => !p))}
        style={{ width: 38, height: 38, borderRadius: 99, border: 'none', cursor: 'pointer', background: 'var(--primary)', color: 'var(--on-primary)', display: 'grid', placeItems: 'center', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
        <Icon name={ended ? 'restart' : playing ? 'pause' : 'play'} size={17} fill={ended ? 'none' : 'currentColor'} stroke={ended ? 2 : 0} />
      </button>
      <div style={{ flex: 1, height: 5, borderRadius: 99, background: 'var(--line-2)', overflow: 'hidden' }}>
        <div style={{ width: pct + '%', height: '100%', background: 'var(--live)', borderRadius: 99, transition: 'width .1s linear' }} />
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)' }}>{fmtClock(clock)}</span>
      <button className="focusable" onClick={replay} title="Opnieuw afspelen" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--ink-3)', display: 'grid', placeItems: 'center', padding: 4 }}>
        <Icon name="restart" size={16} />
      </button>
    </div>
  );
}

/* ---- right rail panels ---- */
function RailHead({ children, icon }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12, fontSize: 11.5, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
    {icon && <Icon name={icon} size={14} />}{children}</div>;
}

function ContextPanel() {
  const rows = [['Branche', 'Kapsalon'], ['Template', 'kapsalon · v4'], ['Taal', 'Nederlands (nl)'], ['Intentie', 'Afspraak maken']];
  return (
    <Card pad={16}>
      <RailHead icon="grid">Gesprekscontext</RailHead>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {rows.map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--ink-2)' }}>{k}</span>
            <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function BookingPanel({ booking, booked }) {
  const fields = [
    { k: 'Dienst', v: booking.dienst, icon: 'scissors' },
    { k: 'Medewerker', v: booking.medewerker, icon: 'users' },
    { k: 'Datum', v: booking.datum, icon: 'calendar' },
    { k: 'Tijd', v: booking.tijd, icon: 'clock' },
    { k: 'Op naam van', v: booking.naam, icon: 'pin' },
  ];
  return (
    <Card pad={16} style={{ borderColor: booked ? 'var(--primary)' : 'var(--line)' }}>
      <RailHead icon="calendar-check">Live boeking</RailHead>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {fields.map(f => (
          <div key={f.k} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 9px', borderRadius: 8,
            background: f.v ? 'var(--surface-2)' : 'transparent', border: '1px dashed ' + (f.v ? 'transparent' : 'var(--line)'),
            transition: 'all .3s' }}>
            <Icon name={f.icon} size={14} style={{ color: f.v ? 'var(--primary)' : 'var(--ink-3)' }} />
            <span style={{ fontSize: 12.5, color: 'var(--ink-3)', width: 78, flexShrink: 0 }}>{f.k}</span>
            <span className={f.v ? 'fade-in' : ''} style={{ fontSize: 13, fontWeight: 600, color: f.v ? 'var(--ink)' : 'var(--ink-3)' }}>{f.v || '—'}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 9 }}>
        <Icon name={booked ? 'shieldCheck' : 'shield'} size={16} style={{ color: booked ? 'var(--primary)' : 'var(--ink-3)' }} />
        <span style={{ fontSize: 12.5, color: booked ? 'var(--primary)' : 'var(--ink-2)', fontWeight: 600 }}>
          {booked ? 'Geboekt — tool gaf success:true' : 'Nog niet geboekt'}
        </span>
      </div>
    </Card>
  );
}

function PipelinePanel({ speaking, clock }) {
  const stages = [
    { k: 'Deepgram STT', on: speaking === 'caller', ms: '120ms' },
    { k: 'Smart Turn v3', on: speaking === 'caller', ms: '40ms' },
    { k: 'Claude Haiku 4.5', on: !speaking && clock > 600, ms: '231ms' },
    { k: 'ElevenLabs TTS', on: speaking === 'asori', ms: '0.7s ttft' },
  ];
  return (
    <Card pad={16}>
      <RailHead icon="bolt">Pipeline · live</RailHead>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {stages.map(s => (
          <div key={s.k} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <StatusDot color={s.on ? 'var(--primary)' : 'var(--ink-3)'} live={s.on} size={7} />
            <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: s.on ? 600 : 500 }}>{s.k}</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-3)' }}>{s.ms}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

Object.assign(window, { LiveCall });
