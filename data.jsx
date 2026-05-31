// data.jsx — mock data for the Asori operator console
// All exported to window at the bottom.

const TEMPLATES = [
  { id: 'kapsalon',        naam: 'Kapsalon',          icon: 'scissors',  tool: 'maak_afspraak',     maturity: 'green',  term: 'afspraak',     desc: 'Bewezen afspraak-patroon. De referentie, live gevalideerd.', clients: 4, calls: 612, conv: 71 },
  { id: 'tandarts',        naam: 'Tandarts',          icon: 'tooth',     tool: 'maak_afspraak',     maturity: 'green',  term: 'afspraak',     desc: 'Klaar voor pilot. Controle- en behandelafspraken.', clients: 2, calls: 188, conv: 64 },
  { id: 'fysiotherapie',   naam: 'Fysiotherapie',     icon: 'activity',  tool: 'maak_afspraak',     maturity: 'green',  term: 'afspraak',     desc: 'Klaar voor pilot. Intake- en vervolgafspraken.', clients: 1, calls: 96, conv: 68 },
  { id: 'schoonheidssalon',naam: 'Schoonheidssalon',  icon: 'sparkle',   tool: 'maak_afspraak',     maturity: 'green',  term: 'afspraak',     desc: 'Klaar voor pilot. Behandelingen per medewerker.', clients: 1, calls: 74, conv: 70 },
  { id: 'restaurant',      naam: 'Restaurant',        icon: 'utensils',  tool: 'maak_reservering',  maturity: 'amber',  term: 'reservering',  desc: 'Gebruikt maak_reservering + aantal_personen. Extra test nodig.', clients: 2, calls: 143, conv: 59 },
  { id: 'garage',          naam: 'Garage',            icon: 'wrench',    tool: 'maak_afspraak',     maturity: 'amber',  term: 'afspraak',     desc: 'Geen diagnose/prijs. Kenteken uitvragen.', clients: 1, calls: 51, conv: 55 },
  { id: 'aannemer',        naam: 'Aannemer',          icon: 'hammer',    tool: 'maak_afspraak',     maturity: 'amber',  term: 'afspraak',     desc: 'Geen prijs/haalbaarheid. Spoed → doorschakelen.', clients: 1, calls: 38, conv: 48 },
  { id: 'makelaar',        naam: 'Makelaar',          icon: 'home',      tool: 'maak_afspraak',     maturity: 'amber',  term: 'bezichtiging', desc: 'Geen waarde/bod. Geen woningdetails verzinnen.', clients: 0, calls: 0, conv: null },
  { id: 'zzp_consultant',  naam: 'ZZP / Consultant',  icon: 'briefcase', tool: 'maak_afspraak',     maturity: 'orange', term: 'belafspraak',  desc: 'Generiek. Vooral belafspraken doorzetten.', clients: 1, calls: 22, conv: 41 },
  { id: 'advocaat',        naam: 'Advocaat',          icon: 'scale',     tool: 'maak_afspraak',     maturity: 'red',    term: 'afspraak',     desc: 'Geen juridisch advies/tarieven. Veel doorschakelen.', clients: 0, calls: 0, conv: null },
];

const CLIENTS = [
  { id: 'c1', name: 'Salon Lumière',      type: 'kapsalon',         stad: 'Amsterdam', number: '+31 20 894 2210', active: true,  calls7: 38, conv: 74, lastCall: '2 min geleden', live: true,
    diensten: 'Knippen (30 min) · Kleuren (90 min) · Föhnen (20 min) · Highlights (120 min)',
    medewerkers: 'Sanne · Imran · Fleur', open: 'di–za 09:00–18:00, do tot 21:00', eigenaar: '+31 6 1188 4420', google: true },
  { id: 'c2', name: 'Tandartspraktijk de Vries', type: 'tandarts', stad: 'Utrecht',   number: '+31 30 112 8830', active: true,  calls7: 21, conv: 66, lastCall: '14 min geleden', live: false,
    diensten: 'Controle (20 min) · Vulling (40 min) · Gebitsreiniging (45 min)',
    medewerkers: 'Dr. de Vries · Dr. Okonkwo · Mondhygiënist Bram', open: 'ma–vr 08:00–17:00', eigenaar: '+31 6 2204 7781', google: true },
  { id: 'c3', name: 'Bistro Noord',       type: 'restaurant',      stad: 'Rotterdam', number: '+31 10 477 1190', active: true,  calls7: 33, conv: 61, lastCall: '38 min geleden', live: false,
    diensten: 'Lunch · Diner · Privé zaal (max 18)', medewerkers: '—', open: 'wo–zo 12:00–22:30', eigenaar: '+31 6 5519 0042', google: true },
  { id: 'c4', name: 'Fysio Centrum Zuid', type: 'fysiotherapie',   stad: 'Eindhoven', number: '+31 40 330 5521', active: true,  calls7: 18, conv: 69, lastCall: '1 uur geleden', live: false,
    diensten: 'Intake (45 min) · Behandeling (30 min) · Dry needling (30 min)', medewerkers: 'Joost · Priya · Marit', open: 'ma–vr 07:30–19:00', eigenaar: '+31 6 7781 2230', google: true },
  { id: 'c5', name: 'Garage Hofman',      type: 'garage',          stad: 'Zwolle',    number: '+31 38 220 4417', active: true,  calls7: 12, conv: 54, lastCall: '3 uur geleden', live: false,
    diensten: 'APK (60 min) · Onderhoudsbeurt (120 min) · Bandenwissel (45 min)', medewerkers: '—', open: 'ma–vr 08:00–17:30, za 09:00–13:00', eigenaar: '+31 6 3390 8814', google: false },
  { id: 'c6', name: 'Beauty by Noor',     type: 'schoonheidssalon',stad: 'Den Haag',  number: '+31 70 558 9043', active: true,  calls7: 16, conv: 70, lastCall: '4 uur geleden', live: false,
    diensten: 'Gezichtsbehandeling (60 min) · Manicure (45 min) · Wenkbrauwen (20 min)', medewerkers: 'Noor · Yasmin', open: 'di–za 10:00–18:00', eigenaar: '+31 6 4417 9921', google: true },
  { id: 'c7', name: 'Bouwbedrijf Akkerman', type: 'aannemer',     stad: 'Groningen', number: '+31 50 711 3360', active: false, calls7: 0,  conv: 48, lastCall: '2 dagen geleden', live: false,
    diensten: 'Verbouwing · Dakkapel · Badkamer renovatie', medewerkers: '—', open: 'ma–vr 07:00–16:00', eigenaar: '+31 6 2230 5567', google: false },
  { id: 'c8', name: 'Advies Bureau Tan',  type: 'zzp_consultant',  stad: 'Amsterdam', number: '+31 20 996 1102', active: true,  calls7: 7,  conv: 41, lastCall: 'gisteren', live: false,
    diensten: 'Strategie-sessie (60 min) · Vrijblijvend kennismakingsgesprek (30 min)', medewerkers: 'Wei-Lin Tan', open: 'ma–do 09:00–17:00', eigenaar: '+31 6 1102 4480', google: true },
];

const OUTCOMES = {
  appointment_booked: { label: 'Afspraak geboekt',  color: 'var(--primary)', soft: 'var(--primary-soft)', icon: 'calendar-check' },
  transferred:        { label: 'Doorgeschakeld',    color: 'var(--amber)',   soft: 'var(--amber-soft)',   icon: 'phone-forward' },
  hangup:             { label: 'Opgehangen',        color: 'var(--ink-3)',   soft: 'var(--line-2)',       icon: 'phone-off' },
  answered:           { label: 'Vraag beantwoord',  color: 'var(--info)',    soft: 'var(--info-soft)',    icon: 'message' },
  error:              { label: 'Fout',              color: 'var(--live)',    soft: 'var(--live-soft)',    icon: 'alert' },
  in_progress:        { label: 'Live',              color: 'var(--live)',    soft: 'var(--live-soft)',    icon: 'wave' },
};

const CONVERSATIONS = [
  { id: 'v1', client: 'c1', clientName: 'Salon Lumière', type: 'kapsalon', caller: '+31 6 2841 ••90', start: '14:32', dur: '1:48', outcome: 'in_progress', when: 'Nu', summary: 'Knippen + föhnen, donderdag avond' },
  { id: 'v2', client: 'c1', clientName: 'Salon Lumière', type: 'kapsalon', caller: '+31 6 5519 ••12', start: '14:08', dur: '2:12', outcome: 'appointment_booked', when: '24 min', summary: 'Kleuren bij Fleur, vrijdag 10:00', appt: { dienst: 'Kleuren', wie: 'Fleur', datum: 'vr 6 jun', tijd: '10:00', duur: '90 min' } },
  { id: 'v3', client: 'c2', clientName: 'Tandarts de Vries', type: 'tandarts', caller: '+31 6 1102 ••34', start: '13:51', dur: '1:33', outcome: 'appointment_booked', when: '41 min', summary: 'Halfjaarlijkse controle, dinsdag', appt: { dienst: 'Controle', wie: 'Dr. de Vries', datum: 'di 10 jun', tijd: '09:20', duur: '20 min' } },
  { id: 'v4', client: 'c3', clientName: 'Bistro Noord', type: 'restaurant', caller: '+31 6 7781 ••08', start: '13:40', dur: '2:50', outcome: 'transferred', when: '52 min', summary: 'Grote groep (14p) → eigenaar' },
  { id: 'v5', client: 'c3', clientName: 'Bistro Noord', type: 'restaurant', caller: '+31 6 3390 ••77', start: '13:22', dur: '1:09', outcome: 'appointment_booked', when: '1 uur', summary: 'Tafel voor 2, zaterdag 19:30', appt: { dienst: 'Reservering · 2 personen', wie: '—', datum: 'za 7 jun', tijd: '19:30', duur: '—' } },
  { id: 'v6', client: 'c4', clientName: 'Fysio Centrum Zuid', type: 'fysiotherapie', caller: '+31 6 4480 ••51', start: '12:58', dur: '0:46', outcome: 'answered', when: '1 uur', summary: 'Vraag over openingstijden' },
  { id: 'v7', client: 'c5', clientName: 'Garage Hofman', type: 'garage', caller: '+31 6 2204 ••19', start: '12:30', dur: '1:55', outcome: 'appointment_booked', when: '2 uur', summary: 'APK keuring, woensdag', appt: { dienst: 'APK', wie: '—', datum: 'wo 11 jun', tijd: '08:30', duur: '60 min' } },
  { id: 'v8', client: 'c1', clientName: 'Salon Lumière', type: 'kapsalon', caller: '+31 6 8841 ••63', start: '11:47', dur: '0:38', outcome: 'hangup', when: '3 uur', summary: 'Opgehangen tijdens begroeting' },
  { id: 'v9', client: 'c2', clientName: 'Tandarts de Vries', type: 'tandarts', caller: '+31 6 5567 ••20', start: '11:12', dur: '3:21', outcome: 'transferred', when: '3 uur', summary: 'Pijnklacht / spoed → praktijk' },
  { id: 'v10', client: 'c6', clientName: 'Beauty by Noor', type: 'schoonheidssalon', caller: '+31 6 9921 ••44', start: '10:30', dur: '1:40', outcome: 'appointment_booked', when: '4 uur', summary: 'Gezichtsbehandeling bij Noor', appt: { dienst: 'Gezichtsbehandeling', wie: 'Noor', datum: 'do 12 jun', tijd: '14:00', duur: '60 min' } },
];

// Full transcript for the v2 booked call (used in transcript drawer)
const TRANSCRIPT_V2 = [
  { who: 'asori', t: 'U spreekt met de digitale assistent van Salon Lumière. Hoe kan ik u helpen?' },
  { who: 'caller', t: 'Hoi, ik wil graag mijn haar laten kleuren bij Fleur.' },
  { who: 'asori', t: 'Wat leuk! Kleuren duurt ongeveer anderhalf uur. Heeft u een voorkeursdag?' },
  { who: 'caller', t: 'Vrijdag zou fijn zijn, in de ochtend.' },
  { who: 'tool', name: 'check_beschikbaarheid', args: 'vrijdag 6 jun · 10:00 · 90 min', result: 'vrij' },
  { who: 'asori', t: 'Vrijdag 6 juni om 10:00 uur is Fleur beschikbaar. Zal ik dat voor u inplannen?' },
  { who: 'caller', t: 'Ja graag, op naam van Eva Boender.' },
  { who: 'tool', name: 'maak_afspraak', args: 'Eva Boender · kleuren · Fleur · vr 10:00 · 90 min', result: 'success' },
  { who: 'asori', t: 'Gelukt — ik heb het in de agenda gezet. Vrijdag 6 juni om 10:00 bij Fleur. U krijgt zo een sms-bevestiging. Fijne dag!' },
];

// ---- Scripted LIVE call (the hero). Timeline in ms-relative beats. ----
const LIVE_SCRIPT = [
  { at: 600,  type: 'asori',  text: 'U spreekt met de digitale assistent van Salon Lumière. Hoe kan ik u helpen?' },
  { at: 5200, type: 'caller', text: 'Goedemiddag, ik zou graag een knipafspraak willen maken.' },
  { at: 9000, type: 'asori',  text: 'Natuurlijk! Knippen duurt ongeveer 30 minuten. Had u een voorkeur voor een dag of medewerker?' },
  { at: 14200,type: 'caller', text: 'Donderdagavond zou ideaal zijn, na mijn werk. Maakt niet uit wie.' },
  { at: 18600,type: 'tool',   tool: 'check_beschikbaarheid', args: 'donderdag 5 jun · 19:30 · 30 min', state: 'running' },
  { at: 20200,type: 'tool_done', tool: 'check_beschikbaarheid', result: 'vrij — Imran om 19:30' },
  { at: 21200,type: 'asori',  text: 'Donderdag 5 juni om 19:30 kan Imran u knippen. Zal ik dat vastleggen?' },
  { at: 26000,type: 'caller', text: 'Ja, perfect. Op naam van Daan Visser.' },
  { at: 29200,type: 'tool',   tool: 'maak_afspraak', args: 'Daan Visser · knippen · Imran · do 19:30 · 30 min', state: 'running' },
  { at: 31400,type: 'tool_done', tool: 'maak_afspraak', result: 'success: true' },
  { at: 32600,type: 'asori',  text: 'Gelukt — ik heb het in de agenda gezet: donderdag 5 juni, 19:30 bij Imran. U ontvangt zo een sms-bevestiging. Tot donderdag!' },
  { at: 38000,type: 'end' },
];

const METRICS = {
  callsToday: 142,
  callsTrend: +12,
  booked: 89,
  bookedTrend: +8,
  bookRate: 63,
  bookRateTrend: +3,
  transferred: 21,
  avgDur: '1:52',
  avgTtft: '0.7s',
  liveNow: 1,
  // 14-day sparkline-ish series
  series: [62,71,58,80,74,69,88,95,77,84,101,92,118,142],
  byOutcome: [
    { k: 'appointment_booked', v: 63 },
    { k: 'answered', v: 16 },
    { k: 'transferred', v: 15 },
    { k: 'hangup', v: 6 },
  ],
  // hourly call volume for today
  hours: [0,0,1,4,9,14,18,15,12,16,11,7,9,12,8,4,2,1,0,0,0,0,0,0].map((v,i)=>({h:i,v})),
};

const SYSTEM = [
  { name: 'Backend (Fly.io · ams)', detail: 'asori-voice · 1 machine', status: 'ok', meta: 'cold-start klaar · 99.9%' },
  { name: 'Voice-pipeline (Pipecat)', detail: 'Smart Turn v3 warm', status: 'ok', meta: 'ttft 0.7s gem.' },
  { name: 'Claude Haiku 4.5', detail: 'Anthropic', status: 'ok', meta: '231ms p50' },
  { name: 'Deepgram Nova-3 (nl)', detail: 'STT', status: 'ok', meta: 'verbonden' },
  { name: 'ElevenLabs TTS', detail: 'Cartesia fallback', status: 'warn', meta: 'verhoogde latency' },
  { name: 'Google Calendar', detail: '7 klanten gekoppeld', status: 'ok', meta: '1 koppeling open' },
];

Object.assign(window, { TEMPLATES, CLIENTS, CONVERSATIONS, OUTCOMES, TRANSCRIPT_V2, LIVE_SCRIPT, METRICS, SYSTEM });

/* ---- Branche field labels (Laag-3 form maps generic fields to per-branche labels) ---- */
const VELD_LABELS = {
  kapsalon:        { diensten: 'Behandelingen & duur', medewerkers: 'Stylisten', bijzonderheden: 'Bijzonderheden' },
  tandarts:        { diensten: 'Behandelingen & duur', medewerkers: 'Behandelaars', bijzonderheden: 'Spoed-instructies' },
  fysiotherapie:   { diensten: 'Behandelingen & duur', medewerkers: 'Therapeuten', bijzonderheden: 'Verwijzing nodig?' },
  schoonheidssalon:{ diensten: 'Behandelingen & duur', medewerkers: 'Specialisten', bijzonderheden: 'Bijzonderheden' },
  restaurant:      { diensten: 'Tafels, zalen & shifts', medewerkers: 'Niet van toepassing', bijzonderheden: 'Allergie- & groepsbeleid' },
  garage:          { diensten: 'Diensten & duur', medewerkers: 'Niet van toepassing', bijzonderheden: 'Altijd kenteken uitvragen' },
  aannemer:        { diensten: 'Werkzaamheden', medewerkers: 'Niet van toepassing', bijzonderheden: 'Spoed → doorschakelen' },
  makelaar:        { diensten: 'Type bezichtigingen', medewerkers: 'Makelaars', bijzonderheden: 'Geen waarde/bod noemen' },
  zzp_consultant:  { diensten: 'Type gesprekken & duur', medewerkers: 'Naam consultant', bijzonderheden: 'Bijzonderheden' },
  advocaat:        { diensten: 'Soort afspraken', medewerkers: 'Advocaten', bijzonderheden: 'Geen juridisch advies geven' },
};

/* ---- Prompt building blocks (for the live 3-layer preview) ---- */
const ASORI_PERSONALITY = `<critical>
Je VERZINT NIETS en BELOOFT NIETS dat niet echt is gebeurd.
Een afspraak is pas "geboekt" als een boekings-tool deze beurt success:true teruggaf.
Gebruik "geboekt", "ingepland" of "staat in de agenda" NOOIT zonder die bevestiging.
Groet NIET opnieuw — de openingszin is al door het systeem afgespeeld.
Spreekt de beller geen Nederlands? Schakel direct door naar de eigenaar.
</critical>

Je bent de digitale telefoonassistent van {bedrijfsnaam}. Je bent warm, kort en duidelijk.
Je spreekt natuurlijke spreektaal en stelt één vraag tegelijk.
Roep altijd check_beschikbaarheid aan vóórdat je een tijd voorstelt.
Bevestig datum, tijd en naam hardop voordat je vastlegt.`;

const BRANCHE_L2 = {
  kapsalon: { context: 'Je neemt op voor een kapsalon en plant knip-, kleur- en föhnafspraken in.',
    voorbeeld: '"Ik wil graag geknipt worden" → vraag dag/stylist → check beschikbaarheid → bevestig → maak_afspraak.',
    doorschakel: ['Klacht over een eerdere behandeling', 'Vraag naar specifieke productadviezen buiten je kennis'],
    valkuilen: ['Beloof geen stylist die niet vrij is', 'Verzin geen prijzen'] },
  tandarts: { context: 'Je neemt op voor een tandartspraktijk: controles, vullingen en reinigingen.',
    voorbeeld: '"Ik heb kiespijn" → spoed? → doorschakelen. Anders controle inplannen.',
    doorschakel: ['Acute pijn of spoed', 'Vragen over medicatie of diagnose'],
    valkuilen: ['Geef nooit medisch advies', 'Bevestig de behandelaar pas na check'] },
  restaurant: { context: 'Je neemt reserveringen aan. Vraag ALTIJD het aantal personen uit.',
    voorbeeld: '"Tafel voor 4, zaterdag" → check shift → maak_reservering met aantal_personen.',
    doorschakel: ['Groepen groter dan de zaal-capaciteit', 'Speciale evenementen / catering'],
    valkuilen: ['Vergeet aantal_personen niet', 'Beloof geen specifieke tafel'] },
  garage: { context: 'Je plant APK, onderhoud en bandenwissels in. Vraag altijd het kenteken uit.',
    voorbeeld: '"APK nodig" → kenteken → check beschikbaarheid → maak_afspraak.',
    doorschakel: ['Diagnose- of prijsvragen', 'Sleephulp / pech onderweg'],
    valkuilen: ['Stel geen diagnose', 'Noem geen prijzen'] },
  advocaat: { context: 'Je plant uitsluitend kennismakings- en adviesafspraken in. Veel doorschakelen.',
    voorbeeld: '"Ik heb een juridische vraag" → geen advies → kennismaking inplannen of doorschakelen.',
    doorschakel: ['Elke inhoudelijke juridische vraag', 'Vragen over tarieven of slagingskans'],
    valkuilen: ['Geef NOOIT juridisch advies', 'Noem geen tarieven'] },
};
function buildLayer2(tpl) {
  const b = BRANCHE_L2[tpl.id] || {
    context: `Je neemt op voor ${tpl.naam.toLowerCase()} en regelt een ${tpl.term} via ${tpl.tool}.`,
    voorbeeld: `Vraag de behoefte uit → check beschikbaarheid → bevestig → ${tpl.tool}.`,
    doorschakel: ['Klachten of spoed', 'Vragen buiten je scope'],
    valkuilen: ['Verzin geen details', 'Beloof niets dat niet bevestigd is'],
  };
  return `# Branche: ${tpl.naam}\n${b.context}\n\n# Voorbeeldgesprek\n${b.voorbeeld}\n\n# Doorschakelen wanneer\n${b.doorschakel.map(x => '- ' + x).join('\n')}\n\n# Valkuilen\n${b.valkuilen.map(x => '- ' + x).join('\n')}`;
}
function buildLayer3(c) {
  return `Bedrijf: ${c.name} (${c.stad})\nDiensten: ${c.diensten || '—'}\nOpeningstijden: ${c.open || '—'}\nMedewerkers: ${c.medewerkers || '—'}\nDoorschakelnummer: ${c.eigenaar || '—'}\nAsori-nummer: ${c.number}`;
}

/* ---- Agenda: appointments for the current week (ma 26 – za 31 mei) ---- */
const WEEK_DAYS = [
  { lbl: 'ma', date: 26 }, { lbl: 'di', date: 27 }, { lbl: 'wo', date: 28 },
  { lbl: 'do', date: 29 }, { lbl: 'vr', date: 30 }, { lbl: 'za', date: 31 },
];
const TODAY_IDX = 5; // za
const APPOINTMENTS = [
  { day: 0, start: 9.5,  dur: 30, client: 'Salon Lumière', type: 'kapsalon', dienst: 'Knippen', who: 'Sanne' },
  { day: 0, start: 11,   dur: 90, client: 'Salon Lumière', type: 'kapsalon', dienst: 'Kleuren', who: 'Fleur' },
  { day: 0, start: 14,   dur: 20, client: 'Tandarts de Vries', type: 'tandarts', dienst: 'Controle', who: 'Dr. de Vries' },
  { day: 1, start: 8.5,  dur: 45, client: 'Fysio Centrum Zuid', type: 'fysiotherapie', dienst: 'Intake', who: 'Joost' },
  { day: 1, start: 10,   dur: 60, client: 'Garage Hofman', type: 'garage', dienst: 'APK', who: '—' },
  { day: 1, start: 13.5, dur: 60, client: 'Beauty by Noor', type: 'schoonheidssalon', dienst: 'Gezicht', who: 'Noor' },
  { day: 1, start: 19,   dur: 120,client: 'Bistro Noord', type: 'restaurant', dienst: 'Diner · 4p', who: '—' },
  { day: 2, start: 9,    dur: 30, client: 'Salon Lumière', type: 'kapsalon', dienst: 'Knippen', who: 'Imran' },
  { day: 2, start: 10.5, dur: 40, client: 'Tandarts de Vries', type: 'tandarts', dienst: 'Vulling', who: 'Dr. Okonkwo' },
  { day: 2, start: 15,   dur: 45, client: 'Beauty by Noor', type: 'schoonheidssalon', dienst: 'Manicure', who: 'Yasmin' },
  { day: 3, start: 8.5,  dur: 30, client: 'Fysio Centrum Zuid', type: 'fysiotherapie', dienst: 'Behandeling', who: 'Priya' },
  { day: 3, start: 11,   dur: 90, client: 'Salon Lumière', type: 'kapsalon', dienst: 'Highlights', who: 'Fleur' },
  { day: 3, start: 19,   dur: 90, client: 'Bistro Noord', type: 'restaurant', dienst: 'Diner · 2p', who: '—' },
  { day: 3, start: 19.5, dur: 30, client: 'Salon Lumière', type: 'kapsalon', dienst: 'Knippen', who: 'Imran', live: true },
  { day: 4, start: 9,    dur: 20, client: 'Tandarts de Vries', type: 'tandarts', dienst: 'Controle', who: 'Dr. de Vries' },
  { day: 4, start: 10,   dur: 30, client: 'Salon Lumière', type: 'kapsalon', dienst: 'Föhnen', who: 'Sanne' },
  { day: 4, start: 14,   dur: 60, client: 'Garage Hofman', type: 'garage', dienst: 'Onderhoud', who: '—' },
  { day: 5, start: 9.5,  dur: 30, client: 'Salon Lumière', type: 'kapsalon', dienst: 'Knippen', who: 'Imran' },
  { day: 5, start: 10.5, dur: 45, client: 'Beauty by Noor', type: 'schoonheidssalon', dienst: 'Wenkbrauwen', who: 'Noor' },
  { day: 5, start: 12.5, dur: 90, client: 'Bistro Noord', type: 'restaurant', dienst: 'Lunch · 6p', who: '—' },
  { day: 5, start: 14.5, dur: 30, client: 'Salon Lumière', type: 'kapsalon', dienst: 'Kleuren', who: 'Fleur' },
];

Object.assign(window, { VELD_LABELS, ASORI_PERSONALITY, BRANCHE_L2, buildLayer2, buildLayer3, WEEK_DAYS, TODAY_IDX, APPOINTMENTS });
