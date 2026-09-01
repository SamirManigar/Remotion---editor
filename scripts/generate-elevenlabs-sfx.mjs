import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {basename, resolve} from 'node:path';

const [, , manifestArg = 'scripts/act3-sfx-manifest.json', outputArg = 'out/generated/act3-sfx'] = process.argv;
const apiKey = process.env.ELEVENLABS_API_KEY;

if (!apiKey) {
  throw new Error('ELEVENLABS_API_KEY is not configured.');
}

const manifestPath = resolve(manifestArg);
const outputDir = resolve(outputArg);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

if (!Array.isArray(manifest) || manifest.length === 0) {
  throw new Error('The SFX manifest must contain at least one sound.');
}

await mkdir(outputDir, {recursive: true});

for (const item of manifest) {
  const {name, prompt, durationSeconds, promptInfluence = 0.3} = item;

  if (!/^[a-z0-9-]+$/.test(name ?? '')) {
    throw new Error(`Invalid sound name: ${String(name)}`);
  }
  if (typeof prompt !== 'string' || prompt.length === 0 || prompt.length > 450) {
    throw new Error(`Prompt for ${name} must contain 1-450 characters.`);
  }
  if (durationSeconds < 0.5 || durationSeconds > 30) {
    throw new Error(`Duration for ${name} must be between 0.5 and 30 seconds.`);
  }
  if (promptInfluence < 0 || promptInfluence > 1) {
    throw new Error(`Prompt influence for ${name} must be between 0 and 1.`);
  }

  console.log(`Generating ${name} (${durationSeconds}s)...`);

  const response = await fetch(
    'https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: prompt,
        duration_seconds: durationSeconds,
        prompt_influence: promptInfluence,
        model_id: 'eleven_text_to_sound_v2',
      }),
    },
  );

  if (!response.ok) {
    const errorBody = (await response.text()).slice(0, 1000);
    throw new Error(`ElevenLabs rejected ${name} (${response.status}): ${errorBody}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().startsWith('audio/')) {
    throw new Error(`Unexpected response type for ${name}: ${contentType || 'missing'}`);
  }

  const outputPath = resolve(outputDir, `${name}.mp3`);
  await writeFile(outputPath, Buffer.from(await response.arrayBuffer()));
  console.log(`Saved ${basename(outputPath)}`);
}
