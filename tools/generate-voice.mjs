// Jana semua klip suara MP3 dengan Microsoft Azure AI Speech (ms-MY). Dijalankan sekali oleh pembangun,
// BUKAN oleh murid. Kunci API dibaca daripada pemboleh ubah persekitaran atau fail .env (diabaikan oleh git).
//
//   export AZURE_SPEECH_KEY=...   AZURE_SPEECH_REGION=southeastasia
//   node tools/generate-voice.mjs                 # jana klip yang belum ada
//   node tools/generate-voice.mjs --force         # jana semula semua
//   node tools/generate-voice.mjs --only=huruf    # satu kumpulan, atau --only=audio/huruf/b.mp3
//   node tools/generate-voice.mjs --letters=text  # jika Azure menolak <phoneme>, guna ejaan biasa
//   node tools/generate-voice.mjs --dry-run       # papar SSML tanpa memanggil Azure
//   VOICE=ms-MY-OsmanNeural node tools/generate-voice.mjs   # suara lain (lalai: ms-MY-YasminNeural)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (n) => args.includes('--' + n);
const opt = (n) => (args.find((a) => a.startsWith('--' + n + '=')) || '').split('=').slice(1).join('=');

// .env ringkas (tanpa pakej tambahan)
const envFile = path.join(root, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}
const KEY = process.env.AZURE_SPEECH_KEY;
const REGION = process.env.AZURE_SPEECH_REGION;
const VOICE = process.env.VOICE || 'ms-MY-YasminNeural';
const FORMAT = 'audio-24khz-96kbitrate-mono-mp3';
const dry = flag('dry-run');

// Gaya suara setiap kumpulan. Yasmin tidak mempunyai gaya "cheerful" terbina dalam, jadi keceriaan
// dicapai dengan kadar, nada dan kelantangan (prosody).
const STYLE = {
  huruf:      { rate: '-25%', pitch: '+6%',  volume: '+0%'  }, // jelas, perlahan
  sukukata:   { rate: '-25%', pitch: '+6%',  volume: '+0%'  },
  perkataan:  { rate: '-18%', pitch: '+5%',  volume: '+0%'  },
  ayat:       { rate: '-12%', pitch: '+5%',  volume: '+0%'  },
  puji:       { rate: '+6%',  pitch: '+20%', volume: '+12%' }, // bertenaga
  kemenangan: { rate: '+2%',  pitch: '+16%', volume: '+10%' }, // paling meriah
  galakan:    { rate: '-5%',  pitch: '+8%',  volume: '+0%'  }, // lembut dan mesra
};
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function ssml(c) {
  const st = STYLE[c.group];
  let inner = esc(c.text);
  if (c.ipa && opt('letters') !== 'text') {
    inner = `<phoneme alphabet="ipa" ph="${c.ipa}">${esc(c.text)}</phoneme>`;
  }
  // Suku kata dan huruf tunggal: tambah noktah supaya intonasi mendatar, bukan menaik.
  if (c.group === 'sukukata' || c.group === 'huruf') inner += '.';
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ms-MY">` +
    `<voice name="${VOICE}"><prosody rate="${st.rate}" pitch="${st.pitch}" volume="${st.volume}">${inner}</prosody></voice></speak>`;
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'audio-manifest.json'), 'utf8'));
const only = opt('only');
let list = manifest.clips.filter((c) => !only || c.group === only || c.file === only);
if (!list.length) { console.error('Tiada klip sepadan dengan --only=' + only); process.exit(1); }

if (dry) {
  for (const c of list) console.log(c.file + '\n  ' + ssml(c));
  process.exit(0);
}
if (!KEY || !REGION) {
  console.error('Sila tetapkan AZURE_SPEECH_KEY dan AZURE_SPEECH_REGION (lihat PANDUAN.md). Jangan taip kunci dalam fail HTML.');
  process.exit(1);
}
const base = `https://${REGION}.tts.speech.microsoft.com/cognitiveservices`;

// Semak suara wujud di wilayah ini sebelum menjana apa-apa.
const vr = await fetch(base + '/voices/list', { headers: { 'Ocp-Apim-Subscription-Key': KEY } });
if (!vr.ok) { console.error(`Gagal menyemak senarai suara (${vr.status}). Semak kunci dan wilayah.`); process.exit(1); }
const voices = await vr.json();
const v = voices.find((x) => x.ShortName === VOICE);
if (!v) {
  console.error(`Suara ${VOICE} tiada di wilayah ${REGION}. Suara ms-MY tersedia: ` +
    voices.filter((x) => x.Locale === 'ms-MY').map((x) => x.ShortName).join(', '));
  process.exit(1);
}
console.log(`Suara disahkan: ${v.ShortName} (${v.Locale}, ${v.Gender})`);

let made = 0, skipped = 0, failed = 0;
for (const c of list) {
  const out = path.join(root, c.file);
  if (!flag('force') && fs.existsSync(out) && fs.statSync(out).size > 500) { skipped++; continue; }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  let ok = false;
  for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
    const r = await fetch(base + '/v1', {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': FORMAT,
        'User-Agent': 'jom-kenal-bunyi-voice-gen',
      },
      body: ssml(c),
    });
    if (r.ok) {
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 500) { console.error(`  ${c.file}: audio terlalu kecil (${buf.length} bait)`); break; }
      fs.writeFileSync(out, buf);
      made++; ok = true;
      console.log(`  ✔ ${c.file}  "${c.text}"  (${buf.length} bait)`);
    } else {
      const msg = (await r.text()).slice(0, 200);
      console.error(`  ✖ ${c.file}: HTTP ${r.status} ${msg}${attempt < 3 ? ' (cuba lagi)' : ''}`);
      if (r.status === 400 && c.ipa) { console.error('    Petua: cuba --letters=text'); }
      if (r.status === 401 || r.status === 403) process.exit(1);
      await new Promise((res) => setTimeout(res, 800 * attempt));
    }
  }
  if (!ok) failed++;
}
console.log(`\nSiap: ${made} dijana, ${skipped} dilangkau (sudah ada), ${failed} gagal.`);
console.log('Seterusnya: node tools/verify-audio.mjs   kemudian dengar setiap klip (lihat PANDUAN.md).');
process.exit(failed ? 1 : 0);
