// app.jsx — routing, drawers, view toggle, tweaks. Mounts the app.
const { useState: use, useEffect: eff } = React;

/* ----------------------------- Drawer ----------------------------- */
function Drawer({ open, onClose, children, width = 460 }) {
  eff(() => {
    // a modal layered on top (prompt-preview / command palette) gets Escape first
    const h = e => { if (e.key === 'Escape' && !window.__asoriModal) onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 40, pointerEvents: open ? 'auto' : 'none' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(20,22,18,.38)', opacity: open ? 1 : 0, transition: 'opacity .3s' }} />
      <div className="scroll" style={{ position: 'absolute', top: 0, right: 0, height: '100%', width, maxWidth: '94vw', background: 'var(--paper)', borderLeft: '1px solid var(--line)', boxShadow: 'var(--shadow-lg)', overflowY: 'auto',
        transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform .46s var(--ease-out)' }}>
        {children}
      </div>
    </div>
  );
}

function DrawerHead({ title, sub, onClose, badge }) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 2, background: 'color-mix(in srgb, var(--paper) 88%, transparent)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--line)', padding: '18px 22px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 20, color: 'var(--ink)', letterSpacing: '-.01em' }}>{title}</h2>
          {badge}
        </div>
        {sub && <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 3 }}>{sub}</div>}
      </div>
      <button onClick={onClose} className="focusable" style={{ width: 34, height: 34, borderRadius: 9, border: '1px solid var(--line)', background: 'var(--surface)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--ink-2)', flexShrink: 0 }}>
        <Icon name="x" size={17} />
      </button>
    </div>
  );
}

/* ---- Conversation transcript drawer ---- */
function ConvDrawer({ conv, onClose }) {
  const live = conv && conv.outcome === 'in_progress';
  const tpl = conv && window.TEMPLATES.find(t => t.id === conv.type);
  const transcript = conv && conv.outcome === 'appointment_booked' && conv.id === 'v2' ? window.TRANSCRIPT_V2 : null;
  return (
    <Drawer open={!!conv} onClose={onClose} width={480}>
      {conv && (
        <div>
          <DrawerHead title={conv.clientName} sub={tpl ? tpl.naam + ' · ' + conv.start : conv.start} onClose={onClose} badge={<OutcomeBadge outcome={conv.outcome} />} />
          <div style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
              {[['Beller', conv.caller], ['Duur', conv.dur], ['Wanneer', conv.when]].map(([k, v]) => (
                <div key={k} style={{ flex: 1, padding: '10px 12px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--line)' }}>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginTop: 2, fontFamily: k === 'Beller' ? 'var(--font-mono)' : 'inherit' }}>{v}</div>
                </div>
              ))}
            </div>

            {conv.appt && (
              <div style={{ padding: 16, borderRadius: 'var(--radius)', background: 'var(--primary-soft)', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: 'var(--primary)', fontWeight: 700, fontSize: 13 }}>
                  <Icon name="calendar-check" size={16} stroke={2} /> In de agenda gezet
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 14px' }}>
                  {[['Dienst', conv.appt.dienst], ['Wie', conv.appt.wie], ['Datum', conv.appt.datum], ['Tijd', conv.appt.tijd]].map(([k, v]) => (
                    <div key={k}><span style={{ fontSize: 12, color: 'var(--ink-2)' }}>{k}: </span><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{v}</span></div>
                  ))}
                </div>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--primary)' }}>
                  <Icon name="sms" size={14} /> Sms-bevestiging verstuurd
                </div>
              </div>
            )}

            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 14 }}>Transcript</div>
            {live ? (
              <div style={{ height: 420 }}><LiveCall embedded /></div>
            ) : transcript ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {transcript.map((m, i) => <MiniBubble key={i} m={m} />)}
              </div>
            ) : (
              <div style={{ padding: '28px 18px', textAlign: 'center', color: 'var(--ink-3)', fontSize: 13.5, background: 'var(--surface)', border: '1px dashed var(--line)', borderRadius: 'var(--radius)' }}>
                <Icon name="chat" size={24} style={{ opacity: .5 }} />
                <p style={{ margin: '8px 0 0' }}>{conv.summary}</p>
                <p style={{ margin: '6px 0 0', fontSize: 12 }}>Volledig transcript beschikbaar in de gespreksopslag.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
}

function MiniBubble({ m }) {
  if (m.who === 'tool') {
    const ok = /success|vrij/.test(m.result);
    return (
      <div style={{ alignSelf: 'center', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px', borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--line)', width: '92%' }}>
        <Icon name="check" size={14} stroke={2.4} style={{ color: 'var(--primary)' }} />
        <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink)', fontWeight: 600 }}>{m.name}</code>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.args}</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: 'var(--primary)' }}>{m.result}</span>
      </div>
    );
  }
  const asori = m.who === 'asori';
  return (
    <div style={{ display: 'flex', gap: 9, flexDirection: asori ? 'row' : 'row-reverse' }}>
      {asori ? <AsoriMark size={26} /> : <Avatar name="Beller" size={26} />}
      <div style={{ maxWidth: '78%', padding: '9px 13px', borderRadius: asori ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
        background: asori ? 'var(--primary-soft)' : 'var(--surface-2)', border: '1px solid ' + (asori ? 'transparent' : 'var(--line)'),
        fontSize: 13.5, lineHeight: 1.5, color: 'var(--ink)' }}>{m.t}</div>
    </div>
  );
}

/* ---- Client detail drawer ---- */
function ClientDrawer({ client, onClose, onPreview }) {
  const tpl = client && window.TEMPLATES.find(t => t.id === client.type);
  const rows = client ? [
    ['Diensten', client.diensten], ['Medewerkers', client.medewerkers], ['Openingstijden', client.open],
    ['Doorschakelnummer', client.eigenaar], ['Asori-nummer', client.number],
  ] : [];
  return (
    <Drawer open={!!client} onClose={onClose} width={500}>
      {client && (
        <div>
          <DrawerHead title={client.name} sub={(tpl ? tpl.naam : client.type) + ' · ' + client.stad} onClose={onClose}
            badge={client.active ? <Badge color="var(--primary)" soft="var(--primary-soft)" dot live={client.live}>{client.live ? 'Live' : 'Actief'}</Badge> : <Badge soft="var(--line-2)" color="var(--ink-3)">Inactief</Badge>} />
          <div style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {[['Gesprekken (7d)', client.calls7], ['Conversie', client.conv + '%'], ['Agenda', client.google ? 'Gekoppeld' : 'Open']].map(([k, v], i) => (
                <div key={k} style={{ flex: 1, padding: '12px 14px', borderRadius: 'var(--radius)', background: 'var(--surface)', border: '1px solid var(--line)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, color: i === 2 && !client.google ? 'var(--amber)' : 'var(--ink)' }}><AnimNumber value={v} /></div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{k}</div>
                </div>
              ))}
            </div>

            <SectionLabel>Klantgegevens <span style={{ fontWeight: 400, color: 'var(--ink-3)', textTransform: 'none', letterSpacing: 0 }}>· Laag 3</span></SectionLabel>
            <div style={{ borderRadius: 'var(--radius)', background: 'var(--surface)', border: '1px solid var(--line)', overflow: 'hidden', marginBottom: 22 }}>
              {rows.map(([k, v], i) => (
                <div key={k} style={{ display: 'flex', gap: 14, padding: '11px 15px', borderBottom: i < rows.length - 1 ? '1px solid var(--line-2)' : 'none' }}>
                  <span style={{ fontSize: 12.5, color: 'var(--ink-3)', width: 130, flexShrink: 0 }}>{k}</span>
                  <span style={{ fontSize: 13, color: 'var(--ink)', fontFamily: k.includes('nummer') ? 'var(--font-mono)' : 'inherit' }}>{v}</span>
                </div>
              ))}
            </div>

            <SectionLabel>3-laags system-prompt</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              <PromptLayer n="Laag 1" color="var(--info)" title="Persoonlijkheid" desc="Wie Asori is — anti-hallucinatie bovenaan. Branche-onafhankelijk." />
              <PromptLayer n="Laag 2" color="var(--amber)" title={'Branche: ' + (tpl ? tpl.naam : '')} desc="Voorbeeldgesprekken, doorschakelregels, valkuilen." />
              <PromptLayer n="Laag 3" color="var(--primary)" title="Klant-data" desc="Diensten, tijden, medewerkers van deze klant." />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Btn primary icon="external" onClick={() => onPreview && onPreview(client)}>Bekijk prompt-preview</Btn>
              <Btn icon="settings" onClick={() => window.asoriToast('Klant bewerken komt in de live build', 'settings')}>Bewerken</Btn>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}

function PromptLayer({ n, color, title, desc }) {
  return (
    <div style={{ display: 'flex', gap: 13, padding: '12px 15px', borderRadius: 'var(--radius)', background: 'var(--surface)', border: '1px solid var(--line)' }}>
      <div style={{ width: 4, borderRadius: 4, background: color, flexShrink: 0 }} />
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color, background: 'color-mix(in srgb, ' + color + ' 14%, transparent)', padding: '2px 7px', borderRadius: 5 }}>{n}</span>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{title}</span>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginTop: 4, lineHeight: 1.45 }}>{desc}</div>
      </div>
    </div>
  );
}

/* ---- Template detail drawer ---- */
function TemplateDrawer({ tpl, onClose, onPreview }) {
  const m = tpl && window.MATURITY[tpl.maturity];
  const tools = tpl ? ['check_beschikbaarheid', tpl.tool, 'doorschakelen'] : [];
  return (
    <Drawer open={!!tpl} onClose={onClose} width={480}>
      {tpl && (
        <div>
          <DrawerHead title={tpl.naam} sub={<code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{tpl.id}.py</code>} onClose={onClose}
            badge={<Badge color={m.c} soft={'color-mix(in srgb, ' + m.c + ' 14%, transparent)'} dot>{m.label}</Badge>} />
          <div style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <Glyph name={tpl.icon} size={52} />
              <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5 }}>{tpl.desc}</p>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
              {[['Klanten', tpl.clients], ['Gesprekken', tpl.calls], ['Conversie', tpl.conv != null ? tpl.conv + '%' : '—']].map(([k, v]) => (
                <div key={k} style={{ flex: 1, padding: '12px 14px', borderRadius: 'var(--radius)', background: 'var(--surface)', border: '1px solid var(--line)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, color: 'var(--ink)' }}><AnimNumber value={v} /></div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{k}</div>
                </div>
              ))}
            </div>

            <SectionLabel>Tools in dit gesprek</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
              {tools.map((t, i) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 14px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--line)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--surface-2)', color: 'var(--primary)', display: 'grid', placeItems: 'center' }}>
                    <Icon name={i === 0 ? 'clock' : i === 1 ? 'calendar-check' : 'phone-forward'} size={15} stroke={2} />
                  </div>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{t}</code>
                  {i === 1 && <Badge soft="var(--primary-soft)" color="var(--primary)">boeking</Badge>}
                </div>
              ))}
            </div>

            <SectionLabel>Terminologie</SectionLabel>
            <p style={{ fontSize: 13.5, color: 'var(--ink-2)', margin: '0 0 22px', lineHeight: 1.5 }}>
              Deze branche spreekt over een <strong style={{ color: 'var(--ink)' }}>{tpl.term}</strong>. Velden mappen op de generieke klantvelden met eigen labels — geen kolom-explosie in de database.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <Btn primary icon="external" onClick={() => onPreview && onPreview(tpl)}>Preview prompt</Btn>
              <Btn icon="layers" onClick={() => window.asoriToast('A/B-varianten staan op de roadmap', 'layers')}>A/B-varianten</Btn>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 12 }}>{children}</div>;
}

/* ----------------------------- Toasts ----------------------------- */
const asoriToast = (msg, icon) => window.dispatchEvent(new CustomEvent('asori-toast', { detail: { msg, icon } }));
window.asoriToast = asoriToast;

function Toasts() {
  const [items, setItems] = use([]);
  eff(() => {
    const h = e => {
      const id = Math.random().toString(36).slice(2);
      setItems(s => [...s, { id, msg: e.detail.msg, icon: e.detail.icon }]);
      setTimeout(() => setItems(s => s.filter(x => x.id !== id)), 2600);
    };
    window.addEventListener('asori-toast', h);
    return () => window.removeEventListener('asori-toast', h);
  }, []);
  return (
    <div style={{ position: 'fixed', left: 0, right: 0, bottom: 26, zIndex: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
      {items.map(it => (
        <div key={it.id} className="pop-in" style={{ pointerEvents: 'auto', display: 'inline-flex', alignItems: 'center', gap: 9, padding: '10px 16px', borderRadius: 99, background: 'var(--ink)', color: 'var(--paper)', boxShadow: 'var(--shadow-lg)', fontSize: 13.5, fontWeight: 600 }}>
          {it.icon && <Icon name={it.icon} size={16} stroke={2} style={{ color: 'var(--paper)' }} />}{it.msg}
        </div>
      ))}
    </div>
  );
}

/* ----------------------------- Center modal ----------------------------- */
function CenterModal({ onClose, children, max = 760, label }) {
  eff(() => {
    window.__asoriModal = (window.__asoriModal || 0) + 1;
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => { window.removeEventListener('keydown', h); window.__asoriModal = Math.max(0, (window.__asoriModal || 1) - 1); };
  }, [onClose]);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div onClick={onClose} className="fade-in" style={{ position: 'absolute', inset: 0, background: 'rgba(20,22,18,.44)', backdropFilter: 'blur(3px)' }} />
      <div role="dialog" aria-label={label} className="pop-in" style={{ position: 'relative', marginTop: '7vh', width: max, maxWidth: '94vw', maxHeight: '86vh', display: 'flex', flexDirection: 'column', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

/* ----------------------------- Prompt preview ----------------------------- */
// Assembles the *actual* 3-layer system prompt the model receives, from the
// same builders the backend uses (data.jsx). The anti-hallucination <critical>
// block is highlighted because it is the product's core promise.
function PromptCritical({ body }) {
  const m = body.match(/^([\s\S]*?)(<critical>[\s\S]*?<\/critical>)([\s\S]*)$/);
  if (!m) return <span>{body}</span>;
  return (
    <React.Fragment>
      {m[1]}
      <span style={{ display: 'block', margin: '0 0 10px', padding: '11px 13px', background: 'var(--live-soft)', borderRadius: 8, borderLeft: '3px solid var(--live)', color: 'var(--ink)' }}>{m[2]}</span>
      {m[3]}
    </React.Fragment>
  );
}

function PromptPreview({ ctx, onClose }) {
  const { client, tpl } = ctx;
  const [mode, setMode] = use('layers');
  const est = s => Math.max(1, Math.round((s || '').length / 4));
  const L1 = window.ASORI_PERSONALITY.replace('{bedrijfsnaam}', client ? client.name : '{bedrijfsnaam}');
  const L2 = tpl ? window.buildLayer2(tpl) : '';
  const L3 = client ? window.buildLayer3(client) : null;
  const layers = [
    { n: 'Laag 1', title: 'Persoonlijkheid', color: 'var(--info)', body: L1, note: 'branche-onafhankelijk', crit: true },
    { n: 'Laag 2', title: tpl ? 'Branche · ' + tpl.naam : 'Branche', color: 'var(--amber)', body: L2, note: 'uit template' },
    { n: 'Laag 3', title: 'Klant-data', color: 'var(--primary)', body: L3, note: client ? client.name : 'per klant ingevuld' },
  ].filter(l => l.body != null);
  const totalTokens = layers.reduce((s, l) => s + est(l.body), 0);
  const fullText = layers.map(l => `# ── ${l.n} · ${l.title} ──\n${l.body}`).join('\n\n');
  const copy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(fullText).then(() => asoriToast('Prompt gekopieerd', 'check'), () => asoriToast('Kopiëren mislukt', 'alert'));
    else asoriToast('Klembord niet beschikbaar', 'alert');
  };
  const monoBody = { fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.6, color: 'var(--ink)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 };
  return (
    <CenterModal onClose={onClose} max={820} label="Prompt-preview">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '18px 22px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, color: 'var(--ink)', letterSpacing: '-.01em' }}>System-prompt</h2>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 3 }}>
            {client ? client.name : 'Template'}{tpl ? ' · ' + tpl.naam : ''} · <span style={{ fontFamily: 'var(--font-mono)' }}>~{totalTokens} tokens</span>
          </div>
        </div>
        <div style={{ display: 'flex', padding: 2, borderRadius: 9, background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
          {[['layers', 'Per laag'], ['full', 'Samengesteld']].map(([k, lbl]) => (
            <button key={k} onClick={() => setMode(k)} className="focusable"
              style={{ padding: '6px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600,
                background: mode === k ? 'var(--surface)' : 'transparent', color: mode === k ? 'var(--ink)' : 'var(--ink-3)',
                boxShadow: mode === k ? 'var(--shadow-sm)' : 'none' }}>{lbl}</button>
          ))}
        </div>
        <Btn sm icon="check" onClick={copy}>Kopieer</Btn>
        <button onClick={onClose} className="focusable" style={{ width: 34, height: 34, borderRadius: 9, border: '1px solid var(--line)', background: 'var(--surface)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--ink-2)', flexShrink: 0 }}>
          <Icon name="x" size={17} />
        </button>
      </div>

      <div className="scroll" style={{ padding: '18px 22px', overflowY: 'auto' }}>
        {mode === 'layers' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {layers.map(l => (
              <div key={l.n} style={{ borderRadius: 'var(--radius)', border: '1px solid var(--line)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 13px', borderBottom: '1px solid var(--line)', background: 'var(--surface-2)' }}>
                  <span style={{ width: 3, height: 16, borderRadius: 3, background: l.color }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: l.color, background: 'color-mix(in srgb, ' + l.color + ' 14%, transparent)', padding: '2px 7px', borderRadius: 5 }}>{l.n}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{l.title}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>· {l.note}</span>
                  <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>~{est(l.body)} tk</span>
                </div>
                <pre style={{ ...monoBody, padding: '13px 15px', background: 'var(--surface)' }}>{l.crit ? <PromptCritical body={l.body} /> : l.body}</pre>
              </div>
            ))}
            {!L3 && (
              <div style={{ display: 'flex', gap: 9, alignItems: 'center', padding: '11px 14px', borderRadius: 'var(--radius)', background: 'var(--surface-2)', border: '1px dashed var(--line)', fontSize: 12.5, color: 'var(--ink-2)' }}>
                <Icon name="users" size={15} style={{ color: 'var(--ink-3)' }} /> Laag 3 (klant-data) wordt per klant ingevuld — open een klant om de volledige prompt te zien.
              </div>
            )}
          </div>
        ) : (
          <pre style={{ ...monoBody, padding: '16px 18px', background: 'var(--surface-2)', borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
            {fullText.split('\n').map((ln, i) => ln.startsWith('# ──')
              ? <div key={i} style={{ color: 'var(--primary)', fontWeight: 700, margin: i ? '16px 0 4px' : '0 0 4px' }}>{ln}</div>
              : <div key={i}>{ln || ' '}</div>)}
          </pre>
        )}
      </div>
    </CenterModal>
  );
}

/* ----------------------------- Command palette ----------------------------- */
function CommandPalette({ onClose, setRoute, setView, setTheme, openClient, openTemplate }) {
  const [q, setQ] = use('');
  const [idx, setIdx] = use(0);
  const inputRef = React.useRef(null);
  const activeRef = React.useRef(null);
  eff(() => { if (inputRef.current) inputRef.current.focus(); }, []);

  const run = fn => () => { fn(); onClose(); };
  const items = [
    ...window.NAV.map(n => ({ group: 'Navigatie', label: n.label, icon: n.icon, run: run(() => setRoute(n.id)) })),
    { group: 'Weergave', label: 'Landingspagina', hint: 'marketing', icon: 'external', run: run(() => setView('landing')) },
    { group: 'Weergave', label: 'Operator-console', hint: 'app', icon: 'grid', run: run(() => setView('app')) },
    ...[['pine', 'Pine'], ['ink', 'Ink'], ['clay', 'Clay']].map(([k, l]) => ({ group: 'Weergave', label: 'Thema · ' + l, icon: 'sliders', run: run(() => setTheme(k)) })),
    ...window.CLIENTS.map(c => ({ group: 'Klanten', label: c.name, hint: c.stad, icon: (window.TEMPLATES.find(t => t.id === c.type) || {}).icon || 'users', run: run(() => openClient(c)) })),
    ...window.TEMPLATES.map(t => ({ group: 'Templates', label: t.naam, hint: t.id, icon: t.icon, run: run(() => openTemplate(t)) })),
  ];
  const ql = q.trim().toLowerCase();
  const flat = ql ? items.filter(it => (it.label + ' ' + (it.hint || '') + ' ' + it.group).toLowerCase().includes(ql)) : items;
  const active = Math.min(idx, Math.max(0, flat.length - 1));
  eff(() => { setIdx(0); }, [q]);
  eff(() => { if (activeRef.current) activeRef.current.scrollIntoView({ block: 'nearest' }); }, [active]);

  const onKey = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(flat.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(i => Math.max(0, i - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); const it = flat[active]; if (it) it.run(); }
  };

  let lastGroup = null;
  return (
    <CenterModal onClose={onClose} max={560} label="Commando's">
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
        <Icon name="search" size={18} style={{ color: 'var(--ink-3)' }} />
        <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} onKeyDown={onKey}
          placeholder="Spring naar een scherm, klant of template…"
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: 'var(--ink)', fontFamily: 'var(--font-ui)' }} />
        <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: 11, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 6, padding: '2px 7px', color: 'var(--ink-3)' }}>esc</kbd>
      </div>
      <div className="scroll" style={{ overflowY: 'auto', maxHeight: '52vh', padding: '6px 8px 10px' }}>
        {flat.length === 0 && <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--ink-3)', fontSize: 13.5 }}>Niets gevonden voor “{q}”.</div>}
        {flat.map((it, i) => {
          const head = it.group !== lastGroup ? (lastGroup = it.group) : null;
          const on = i === active;
          return (
            <React.Fragment key={i}>
              {head && <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.06em', padding: '10px 12px 4px' }}>{head}</div>}
              <button ref={on ? activeRef : null} onClick={it.run} onMouseEnter={() => setIdx(i)} className="focusable"
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 9, border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: on ? 'var(--primary-soft)' : 'transparent', color: 'var(--ink)' }}>
                <Icon name={it.icon} size={16} style={{ color: on ? 'var(--primary)' : 'var(--ink-3)', flexShrink: 0 }} />
                <span style={{ fontSize: 13.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.label}</span>
                {it.hint && <span style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: it.group === 'Templates' ? 'var(--font-mono)' : 'inherit' }}>{it.hint}</span>}
                {on && <Icon name="chevR" size={15} style={{ marginLeft: 'auto', color: 'var(--primary)' }} />}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </CenterModal>
  );
}

/* ----------------------------- Tweaks ----------------------------- */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "pine",
  "accent": "#1F5C46",
  "density": "regular",
  "radius": 13,
  "fontScale": 1
}/*EDITMODE-END*/;

const THEME_ACCENT = { pine: '#1F5C46', ink: '#4F8DF7', clay: '#BB5A3C' };

function useThemeApply(t) {
  eff(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', t.theme);
    root.style.setProperty('--radius', t.radius + 'px');
    root.style.setProperty('--radius-sm', (t.radius - 4) + 'px');
    root.style.setProperty('--radius-lg', (t.radius + 7) + 'px');
    // accent override
    if (t.accent) {
      root.style.setProperty('--primary', t.accent);
      root.style.setProperty('--primary-h', `color-mix(in srgb, ${t.accent} 84%, black)`);
      root.style.setProperty('--primary-soft', `color-mix(in srgb, ${t.accent} 13%, var(--surface))`);
    }
    document.body.style.fontSize = (15 * t.fontScale) + 'px';
  }, [t.theme, t.accent, t.radius, t.fontScale]);
}

/* ----------------------------- App ----------------------------- */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = use(() => localStorage.getItem('asori_view') || 'app');
  const [route, setRoute] = use(() => localStorage.getItem('asori_route') || 'overzicht');
  const [conv, setConv] = use(null);
  const [client, setClient] = use(null);
  const [tpl, setTpl] = use(null);
  const [prompt, setPrompt] = use(null);
  const [cmd, setCmd] = use(false);

  useThemeApply(t);
  eff(() => localStorage.setItem('asori_view', view), [view]);
  eff(() => localStorage.setItem('asori_route', route), [route]);

  // ⌘K / Ctrl-K toggles the command palette from anywhere
  eff(() => {
    const h = e => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); setCmd(c => !c); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // open the prompt-preview for a client (resolves its branche template)
  const openClientPrompt = (c) => setPrompt({ client: c, tpl: window.TEMPLATES.find(t => t.id === c.type) || null });
  // open the prompt-preview for a template (picks a representative active client)
  const openTplPrompt = (tp) => setPrompt({ tpl: tp, client: window.CLIENTS.find(c => c.type === tp.id) || null });

  // keep accent in sync when theme preset changes
  const setTheme = (th) => { setTweak({ theme: th, accent: THEME_ACCENT[th] }); };

  const titles = {
    overzicht: ['Overzicht', 'Vandaag · alle klanten'],
    live: ['Live gesprek', 'Realtime meeluisteren met een lopend gesprek'],
    agenda: ['Agenda', 'Alle geboekte afspraken · deze week'],
    gesprekken: ['Gesprekken', 'Recente calls van al je klanten'],
    klanten: ['Klanten', 'Beheer nummers, agenda’s en branche-instellingen'],
    templates: ['Templates', '10 branches · de bron van Asori’s gedrag per vak'],
  };

  if (view === 'landing') {
    return (<>
      <Landing toGapp={() => setView('app')} />
      <Toasts />
      {cmd && <CommandPalette onClose={() => setCmd(false)} setRoute={setRoute} setView={setView} setTheme={setTheme}
        openClient={(c) => { setView('app'); setRoute('klanten'); setClient(c); }}
        openTemplate={(tp) => { setView('app'); setRoute('templates'); setTpl(tp); }} />}
      <TweaksUI t={t} setTweak={setTweak} setTheme={setTheme} view={view} setView={setView} />
    </>);
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar route={route} setRoute={setRoute} liveCount={1} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--paper)' }}>
        <TopBar title={titles[route][0]} subtitle={titles[route][1]}>
          <button onClick={() => setCmd(true)} className="focusable" title="Snel zoeken" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 10px 8px 12px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--surface)', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'var(--ink-3)' }}>
            <Icon name="search" size={15} /> Snel zoeken
            <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, lineHeight: 1, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 5, padding: '3px 6px', color: 'var(--ink-3)' }}>⌘K</kbd>
          </button>
          <button onClick={() => setView('landing')} className="focusable" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 13px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--surface)', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>
            <Icon name="external" size={15} /> Landingspagina
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 13px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--line)' }}>
            <Avatar name="Rakesh B" size={24} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>asori-voice · ams</span>
            <StatusDot color="var(--primary)" size={7} />
          </div>
        </TopBar>

        <div key={route} className="page-anim" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {route === 'overzicht' && <Overview goLive={() => setRoute('live')} openConv={(c) => c ? setConv(c) : setRoute('gesprekken')} />}
          {route === 'live' && <div style={{ flex: 1, minHeight: 0, padding: '20px 28px 24px' }}><LiveCall /></div>}
          {route === 'agenda' && <Agenda openClient={setClient} />}
          {route === 'gesprekken' && <Conversations openConv={setConv} />}
          {route === 'klanten' && <Clients openClient={setClient} />}
          {route === 'templates' && <Templates openTemplate={setTpl} />}
        </div>
      </main>

      <ConvDrawer conv={conv} onClose={() => setConv(null)} />
      <ClientDrawer client={client} onClose={() => setClient(null)} onPreview={openClientPrompt} />
      <TemplateDrawer tpl={tpl} onClose={() => setTpl(null)} onPreview={openTplPrompt} />
      {prompt && <PromptPreview ctx={prompt} onClose={() => setPrompt(null)} />}
      {cmd && <CommandPalette onClose={() => setCmd(false)} setRoute={setRoute} setView={setView} setTheme={setTheme} openClient={setClient} openTemplate={setTpl} />}
      <Toasts />
      <TweaksUI t={t} setTweak={setTweak} setTheme={setTheme} view={view} setView={setView} />
    </div>
  );
}

function TweaksUI({ t, setTweak, setTheme, view, setView }) {
  return (
    <TweaksPanel>
      <TweakSection label="Visuele richting" />
      <TweakRadio label="Thema" value={t.theme} options={['pine', 'ink', 'clay']} onChange={setTheme} />
      <TweakColor label="Accent" value={t.accent} options={['#1F5C46', '#4F8DF7', '#BB5A3C', '#6A4FB0', '#1A1C18']} onChange={(v) => setTweak('accent', v)} />
      <TweakSection label="Vorm & dichtheid" />
      <TweakSlider label="Hoekradius" value={t.radius} min={2} max={22} unit="px" onChange={(v) => setTweak('radius', v)} />
      <TweakSlider label="Tekstgrootte" value={t.fontScale} min={0.9} max={1.15} step={0.05} onChange={(v) => setTweak('fontScale', v)} />
      <TweakSection label="Weergave" />
      <TweakRadio label="Scherm" value={view} options={['app', 'landing']} onChange={setView} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
