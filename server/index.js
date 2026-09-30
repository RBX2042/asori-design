import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const {
  ELEVENLABS_API_KEY,
  ELEVEN_VOICE_ID,
  ALLOWED_ORIGIN = '*',
  PORT = 8787,
} = process.env;

if (!ELEVENLABS_API_KEY) {
  console.error('ELEVENLABS_API_KEY ontbreekt. Kopieer .env.example naar .env en vul je key in.');
  process.exit(1);
}

const MAX_CHARS = 500; // begrenst verbruik van je maandelijkse ElevenLabs-credits per aanroep

const app = express();
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

app.post('/api/tts', async (req, res) => {
  const { text, voiceId } = req.body || {};

  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text is verplicht' });
  }
  if (text.length > MAX_CHARS) {
    return res.status(400).json({ error: `text mag maximaal ${MAX_CHARS} tekens zijn` });
  }

  const voice = voiceId || ELEVEN_VOICE_ID;
  if (!voice) {
    return res.status(400).json({ error: 'geen voiceId meegestuurd en ELEVEN_VOICE_ID niet ingesteld' });
  }

  try {
    const upstream = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '');
      return res.status(upstream.status).json({ error: 'ElevenLabs TTS-aanvraag mislukt', detail });
    }

    res.set('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(await upstream.arrayBuffer()));
  } catch (err) {
    console.error('TTS-fout:', err);
    res.status(502).json({ error: 'Kon ElevenLabs niet bereiken' });
  }
});

// Handig om beschikbare stemmen (incl. je eigen gekloonde stemmen) op te zoeken.
app.get('/api/voices', async (_req, res) => {
  try {
    const upstream = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': ELEVENLABS_API_KEY },
    });
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    console.error('Voices-fout:', err);
    res.status(502).json({ error: 'Kon ElevenLabs niet bereiken' });
  }
});

app.listen(PORT, () => {
  console.log(`Asori voice server luistert op http://localhost:${PORT}`);
});
