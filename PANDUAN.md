# Panduan: Jom Kenal Bunyi dan Baca! (versi suara AI pra-jana)

## Status penting

Pakej ini **belum mengandungi fail MP3**. Folder `audio/` kosong kerana klip dijana menggunakan akaun Microsoft Azure anda (kunci API tidak boleh dikongsi). Selepas anda menjalankan skrip di bawah (kira-kira seminit), 48 fail MP3 akan muncul dan permainan akan menggunakannya secara automatik. Sehingga itu, permainan senyap (tiada suara komputer pelayar digunakan lagi).

## Isi pakej

```
index.html              Permainan (tiada kunci API di dalamnya)
audio-manifest.json     Senarai 48 klip: fail, teks, sebutan
SENARAI-KLIP.md         Senarai semak untuk mendengar setiap klip
audio/                  Tempat fail MP3 (huruf, sukukata, perkataan, ayat, puji, kemenangan, galakan)
tools/generate-voice.mjs   Penjana suara Azure (jalan di komputer anda sahaja)
tools/generate-voice-edge.py   Penjana alternatif tanpa akaun (edge-tts)
tools/verify-audio.mjs     Semak semua MP3 wujud
.github/workflows/generate-voice.yml   Jana MP3 di GitHub (butang Run workflow)
tools/build-manifest.mjs   Bina semula manifest jika anda ubah data dalam index.html
.env.example            Contoh tetapan kunci (salin kepada .env)
```

## Pilihan lebih mudah: tanpa akaun Azure (edge-tts)

Jika tidak mahu mendaftar Azure, gunakan suara Microsoft yang sama melalui pakej percuma edge-tts. Perlukan Python 3.8 atau lebih baharu dan sambungan internet:

```
pip install edge-tts
python tools/generate-voice-edge.py
node tools/verify-audio.mjs
```

Pilihan `--force`, `--only huruf` dan `--voice ms-MY-OsmanNeural` sama seperti skrip Azure. Kekurangan: edge-tts ialah alat tidak rasmi (boleh berhenti berfungsi) dan tiada penanda sebutan IPA. Nama huruf ditulis dalam jadual `LETTER_TEXT` di atas fail skrip; dengar hasilnya dan betulkan jika perlu, kemudian `--only huruf --force`. Selepas itu lakukan Langkah 3 (dengar setiap klip) dan muat naik ke GitHub.

## Langkah 1: Dapatkan kunci Azure Speech (sekali sahaja)

1. Di portal.azure.com, cipta sumber **Speech** (Azure AI Services). Tahap percuma **F0** memberi 500,000 aksara sebulan; projek ini hanya guna lebih kurang 1,000 aksara.
2. Buka sumber itu, bahagian **Keys and Endpoint**, salin **KEY 1** dan nama **Region** (contoh `southeastasia`).

## Langkah 2: Jana MP3

Perlukan Node.js 18 atau lebih baharu. Dalam folder projek:

```
cp .env.example .env        # kemudian isi AZURE_SPEECH_KEY dan AZURE_SPEECH_REGION dalam .env
node tools/generate-voice.mjs
node tools/verify-audio.mjs
```

(Atau tanpa fail: `export AZURE_SPEECH_KEY=...` dan `export AZURE_SPEECH_REGION=southeastasia` pada Mac/Linux; `$env:AZURE_SPEECH_KEY="..."` pada PowerShell.)

Skrip mula-mula mengesahkan bahawa suara `ms-MY-YasminNeural` wujud di wilayah anda; jika tidak, ia menyenaraikan suara ms-MY yang ada dan berhenti. Pilihan:

- `--force` jana semula semua; `--only=huruf` atau `--only=audio/huruf/b.mp3` jana sebahagian sahaja
- `--letters=text` jika Azure menolak penanda sebutan (`<phoneme>`) untuk nama huruf
- `--dry-run` papar SSML tanpa memanggil Azure
- `VOICE=ms-MY-OsmanNeural` untuk suara lelaki

## Pilihan tanpa memasang apa-apa: jana di GitHub

1. Muat naik seluruh projek (termasuk folder `.github`) ke repositori GitHub anda.
2. Di repositori: **Settings > Secrets and variables > Actions > New repository secret**. Cipta dua rahsia: `AZURE_SPEECH_KEY` (KEY 1 Azure) dan `AZURE_SPEECH_REGION` (contoh `southeastasia`).
3. Di tab **Actions**, pilih **Jana suara MP3**, tekan **Run workflow**. Tunggu kira-kira seminit; 48 fail MP3 akan di-commit ke `audio/` secara automatik.
4. Pastikan GitHub Pages dihidupkan (Settings > Pages) daripada cabang yang sama; tapak dikemas kini sendiri. Kemudian lakukan **Langkah 3** (dengar setiap klip).

Kunci hanya wujud dalam Secrets GitHub, tidak dalam kod atau repositori. Jika huruf tersasar, jalankan semula dengan pilihan `letters = text` dan `force` dihidupkan.

## Langkah 3: DENGAR setiap klip (wajib)

Saya tidak dapat mendengar hasil Azure bagi pihak anda. Buka `SENARAI-KLIP.md` dan dengar semua 48 klip, terutamanya:

- **Nama huruf**: B = "bi", K = "ke", S = "es", M = "em", L = "el", J = "je", T = "ti", P = "pi". Jika ada yang tersasar, jalankan `--only=huruf --force --letters=text`, atau ubah sebutan IPA dalam `tools/build-manifest.mjs`, kemudian `node tools/build-manifest.mjs`.
- **Suku kata** (Aktiviti 2) disebut mengikut bunyi sebenar: "ba", "ju", "bu"...
- **Loghat**: pastikan kedengaran Melayu Malaysia, bukan Indonesia.
- Untuk laraskan nada/kadar, ubah jadual `STYLE` di atas fail `generate-voice.mjs`, kemudian jana semula kumpulan itu.

Gaya suara: huruf, suku kata, perkataan dan ayat dibaca perlahan dan jelas; pujian ("Yeay! Tahniah! Bagus! Hebat! Terbaik!") dan skrin kemenangan lebih pantas, tinggi dan kuat; galakan jawapan salah lembut. Yasmin tidak mempunyai gaya "cheerful" terbina dalam, jadi keceriaan dicapai melalui kadar, nada dan kelantangan.

## Langkah 4: Muat naik ke GitHub Pages

Muat naik semua fail termasuk folder `audio/` yang kini berisi MP3. Laluan dalam kod ialah relatif (`audio/huruf/b.mp3`) jadi berfungsi di `https://NAMA.github.io/REPO/`. **Jangan commit `.env`** (sudah dalam `.gitignore`). Selepas deploy, tekan Ctrl+F5, kemudian buka **🎙️ Semak Audio** dalam permainan: semua baris patut bertanda ✔.

## Cara audio berfungsi dalam permainan

- Hanya fail MP3 pra-jana dimainkan. Tiada panggilan API atau kunci semasa murid bermain, dan `speechSynthesis` pelayar tidak digunakan.
- Satu saluran suara: menekan butang berulang kali atau bertukar soalan menghentikan klip terdahulu, jadi tiada klip bertindih.
- Muzik latar diperlahankan semasa suara dimainkan dan pulih selepas tamat.
- Klip yang fail MP3nya tiada akan senyap dan permainan terus berjalan.
- Audio bermula selepas sentuhan pertama murid (peraturan pelayar). Pada iPhone, hidupkan bunyi (suis senyap).

## Mengubah kandungan

Jika anda tambah perkataan atau ayat dalam `index.html`: jalankan `node tools/build-manifest.mjs` kemudian `node tools/generate-voice.mjs` (hanya klip baharu dijana).
