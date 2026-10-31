#!/usr/bin/env python3
"""Jana 48 klip MP3 tanpa akaun/kunci menggunakan pakej edge-tts (suara Microsoft ms-MY).

  pip install edge-tts
  python tools/generate-voice-edge.py                # jana yang belum ada
  python tools/generate-voice-edge.py --force        # jana semula semua
  python tools/generate-voice-edge.py --only huruf   # satu kumpulan atau satu fail
  python tools/generate-voice-edge.py --voice ms-MY-OsmanNeural

Nota: edge-tts ialah alat tidak rasmi; ia boleh berhenti berfungsi dan syaratnya tidak sejelas Azure.
Ia tidak menyokong penanda sebutan IPA, jadi nama huruf ditulis semula dalam LETTER_TEXT di bawah.
Ubah ejaan itu jika sebutan tidak betul (cth. B mesti "bi", bukan "ba"), kemudian jalankan --only huruf --force.
"""
import argparse, asyncio, json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Teks yang dihantar untuk nama huruf. Dengar hasilnya dan laraskan jika perlu.
LETTER_TEXT = {"bi": "bi", "ke": "ke", "es": "es", "em": "em", "el": "el", "je": "je", "ti": "ti", "pi": "pi"}

# (kadar, nada, kelantangan). Nada dalam Hz seperti dikehendaki edge-tts.
STYLE = {
    "huruf":      ("-25%", "+8Hz",  "+0%"),
    "sukukata":   ("-25%", "+8Hz",  "+0%"),
    "perkataan":  ("-18%", "+6Hz",  "+0%"),
    "ayat":       ("-12%", "+6Hz",  "+0%"),
    "puji":       ("+6%",  "+30Hz", "+12%"),
    "kemenangan": ("+2%",  "+24Hz", "+10%"),
    "galakan":    ("-5%",  "+12Hz", "+0%"),
}

async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--only", default="")
    ap.add_argument("--voice", default="ms-MY-YasminNeural")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    clips = json.loads((ROOT / "audio-manifest.json").read_text(encoding="utf-8"))["clips"]
    clips = [c for c in clips if not a.only or c["group"] == a.only or c["file"] == a.only]
    if not clips:
        sys.exit("Tiada klip sepadan dengan --only")

    if not a.dry_run:
        try:
            import edge_tts
        except ImportError:
            sys.exit("Sila pasang dahulu: pip install edge-tts")

    made = skipped = failed = 0
    for c in clips:
        out = ROOT / c["file"]
        text = LETTER_TEXT.get(c["text"], c["text"]) if c["group"] == "huruf" else c["text"]
        if c["group"] in ("huruf", "sukukata"):
            text += "."
        rate, pitch, vol = STYLE[c["group"]]
        if a.dry_run:
            print(f'{c["file"]}  "{text}"  rate={rate} pitch={pitch} volume={vol}')
            continue
        if not a.force and out.exists() and out.stat().st_size > 500:
            skipped += 1
            continue
        out.parent.mkdir(parents=True, exist_ok=True)
        ok = False
        for attempt in range(1, 4):
            try:
                await edge_tts.Communicate(text, a.voice, rate=rate, pitch=pitch, volume=vol).save(str(out))
                if out.stat().st_size < 500:
                    raise RuntimeError("audio terlalu kecil")
                print(f'  OK  {c["file"]}  "{text}"')
                made += 1
                ok = True
                break
            except Exception as e:  # noqa
                print(f'  GAGAL {c["file"]} (cubaan {attempt}): {e}', file=sys.stderr)
                await asyncio.sleep(attempt)
        if not ok:
            failed += 1
            if out.exists() and out.stat().st_size < 500:
                out.unlink()
    if not a.dry_run:
        print(f"\nSiap: {made} dijana, {skipped} dilangkau, {failed} gagal.")
        print("Seterusnya: node tools/verify-audio.mjs  kemudian dengar setiap klip (SENARAI-KLIP.md).")
    sys.exit(1 if failed else 0)

asyncio.run(main())
