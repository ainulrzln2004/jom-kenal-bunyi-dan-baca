// Bina audio-manifest.json daripada data dalam index.html (satu sumber kebenaran).
// Guna:  node tools/build-manifest.mjs
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const a = html.indexOf('/* ===== DATA');
const b = html.indexOf('var A1=');
if (a < 0 || b < 0) throw new Error('Bahagian DATA/CLIPS tidak ditemui dalam index.html');
const code = html.slice(a, b) + '\n;({CLIPS,GROUPS,LETTERS});';
const { CLIPS, GROUPS, LETTERS } = vm.runInNewContext(code, {});

// Sebutan IPA nama huruf Bahasa Melayu (B = "bi", bukan "ba").
const IPA = { bi: 'bi', ke: 'ke', es: 'ɛs', em: 'ɛm', el: 'ɛl', je: 'dʒe', ti: 'ti', pi: 'pi' };
// Nama khas ditulis dengan huruf besar supaya disebut sebagai nama.
const PROPER = { ali: 'Ali' };

const clips = [];
for (const g of GROUPS) {
  for (const key of g.keys) {
    const c = CLIPS[key];
    let text = c.say;
    if (g.id === 'perkataan' && PROPER[text]) text = PROPER[text];
    const o = { key, group: g.id, file: c.file + '.mp3', text };
    if (g.id === 'huruf' && IPA[c.say]) o.ipa = IPA[c.say];
    clips.push(o);
  }
}
const manifest = { locale: 'ms-MY', count: clips.length, clips };
fs.writeFileSync(path.join(root, 'audio-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`audio-manifest.json: ${clips.length} klip`);
