# Asori voice server

Kleine Express-proxy die je ElevenLabs API-key server-side houdt en de
live-call demo (`live.jsx`) van echte gesproken audio voorziet. Nodig omdat
de rest van dit project een statische site is (GitHub Pages, zie
`.nojekyll`) — daar kun je geen geheime key in draaien zonder dat iedereen
'm in de broncode ziet.

## Wat het wel en niet doet

- **Wel:** de tekstregels van "Asori" in de gescripte live-demo laten
  uitspreken met een echte ElevenLabs-stem (Text-to-Speech), naast de
  bestaande tekstanimatie.
- **Niet:** een echt bellend/opnemend telefoonsysteem. Dat vereist
  ElevenLabs' Conversational AI agents-platform (STT + LLM + TTS +
  telefonie), dat je in het ElevenLabs-dashboard configureert en dat
  (voor een echt telefoonnummer) een hoger abonnement dan Starter nodig
  heeft. Dit is een losse, grotere stap — zeg het als je die ook wilt
  bouwen.

## Setup

1. `cd server && npm install`
2. `cp .env.example .env` en vul in:
   - `ELEVENLABS_API_KEY` — Dashboard → Profile → API keys.
   - `ELEVEN_VOICE_ID` — kies een stem via de
     [voice library](https://elevenlabs.io/app/voice-library) (voor
     Nederlands: zoek op "multilingual" of "Dutch"), of vraag
     `GET /api/voices` op nadat de server draait.
3. `npm start` — luistert op `http://localhost:8787` (of `PORT` uit `.env`).
4. Zet in `index.html`/`asori.html` (of lokaal via de browser-console):
   ```html
   <script>
     window.ASORI_VOICE_CONFIG = { endpoint: 'http://localhost:8787/api/tts', voiceId: '' };
   </script>
   ```
   Leeg laten (default) verandert niets aan de huidige gesimuleerde demo.

## Starter-plan credits

Elke `/api/tts`-aanroep verbruikt tekens van je maandelijkse ElevenLabs-
tegoed (de bon in dit gesprek was voor het Starter-abonnement). De server
begrenst elke aanroep op 500 tekens om verbruik te beperken; pas `MAX_CHARS`
in `index.js` aan indien nodig. Check je resterende tegoed in het
ElevenLabs-dashboard.

## Deployen

GitHub Pages kan dit niet hosten (statisch). Zet de server los neer op iets
als Render, Railway, Fly.io of een eigen VPS, zet daar dezelfde
env-variabelen, en wijs `ASORI_VOICE_CONFIG.endpoint` naar die URL. Zet
`ALLOWED_ORIGIN` op je Pages-domein zodat alleen jouw site de proxy mag
gebruiken.

## Browser-autoplay

Browsers blokkeren automatisch afspelende audio vóór de eerste
gebruikersinteractie. De eerste regel van de demo kan daardoor stil
blijven totdat je ergens op de pagina hebt geklikt (bv. pauze/hervat) —
dat is normaal gedrag, geen bug. De tekst blijft in alle gevallen gewoon
zichtbaar.
