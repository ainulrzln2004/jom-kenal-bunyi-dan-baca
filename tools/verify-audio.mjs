// Semak setiap klip yang diperlukan oleh permainan wujud sebagai MP3 sebenar.  Guna: node tools/verify-audio.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const m = JSON.parse(fs.readFileSync(path.join(root, 'audio-manifest.json'), 'utf8'));
let bad = 0;
for (const c of m.clips) {
  const f = path.join(root, c.file);
  let why = '';
  if (!fs.existsSync(f)) why = 'tiada';
  else {
    const b = fs.readFileSync(f);
    const mp3 = (b[0] === 0x49 && b[1] === 0x44 && b[2] === 0x33) || (b[0] === 0xff && (b[1] & 0xe0) === 0xe0);
    if (b.length < 500) why = 'terlalu kecil';
    else if (!mp3) why = 'bukan MP3';
  }
  if (why) { bad++; console.log(`✖ ${c.file}  (${why})`); }
}
console.log(bad ? `\n${bad} daripada ${m.count} klip bermasalah.` : `Semua ${m.count} klip MP3 ditemui.`);
process.exit(bad ? 1 : 0);
