# Panduan: Jom Kenal Bunyi dan Baca! (versi suara rakaman)

## Apa yang ada dalam folder ini

```
index.html            Permainan (ganti fail lama anda)
record.html           Studio Rakaman Suara (alat untuk merakam dan menamakan fail audio)
SENARAI-REKAMAN.md    Senarai 48 rakaman yang diperlukan dan apa yang perlu disebut
PANDUAN.md            Fail ini
audio/
  huruf/              nama huruf (b.wav, k.wav ...)
  sukukata/           ba.wav, ju.wav ...
  perkataan/          baju.wav, ibu.wav ...
  ayat/               ini-baju-ali.wav ...
  puji/               yeay.wav, tahniah.wav, bagus.wav, hebat.wav, terbaik.wav
  kemenangan/         tahniah-kamu-berjaya.wav dan 3 mesej galakan
  galakan/            klip lembut bila jawapan salah
```

## Penting: tentang suara

Kod permainan tidak dapat menghasilkan suara manusia sebenar. Folder `audio/` ini sengaja kosong (hanya ada nota `LETAK-REKAMAN-DI-SINI.txt`). Anda atau guru perlu merakam suara sendiri. Sehingga rakaman diletakkan, permainan menggunakan **suara komputer pelayar sebagai ganti sementara** (ini bukan rakaman manusia dan kualitinya bergantung pada telefon atau komputer murid). Letakkan fail dengan nama yang betul dan permainan akan menggunakannya secara automatik, tanpa mengubah kod.

Jika mahu permainan senyap bagi klip yang belum dirakam, buka `index.html`, cari `var ALLOW_TTS_FALLBACK=true;` dan tukar kepada `false`.

## Cara merakam (paling mudah)

1. Selepas permainan dimuat naik ke GitHub Pages, buka `https://NAMA-ANDA.github.io/NAMA-REPO/record.html` (mikrofon hanya berfungsi melalui https atau localhost).
2. Tekan **● Rakam**, benarkan mikrofon, sebut perkataan yang tertera, tekan **■ Henti**. Tekan **▶** untuk dengar. Rakam semula jika perlu.
3. Senyap di awal dan akhir dibuang dan kelantangan diseragamkan secara automatik.
4. Tekan **Muat turun semua (ZIP)**. Ekstrak ZIP, anda akan dapat folder `audio` dengan fail `.wav` bernama tepat.
5. Muat naik folder `audio` itu ke repositori (langkah di bawah). Rakaman anda disimpan dalam pelayar, jadi boleh disambung kemudian di komputer yang sama.

Anda juga boleh merakam dengan apa-apa aplikasi lain dan menyimpan fail `.wav` atau `.mp3` dengan nama dalam `SENARAI-REKAMAN.md`. Butang **Fail…** di studio boleh menukar fail audio sedia ada (mp3, m4a, wav) kepada WAV yang sesuai.

Petua rakaman: bilik senyap, jarak sejengkal dari mikrofon, nada ceria dan mesra. Untuk huruf, sebut **nama huruf**, contoh B = "bi", K = "ke", S = "es", M = "em", L = "el", J = "je", T = "ti", P = "pi". Jangan sebut "ba", "ka", "sa" atau "ma".

## Cara ganti fail di GitHub (tanpa perlu memasang apa-apa)

1. Buka repositori permainan anda di github.com.
2. Klik fail `index.html` lama, klik ikon pensil, pilih semua teks dan padam; atau lebih mudah, pada halaman repositori klik **Add file > Upload files**.
3. Seret masuk `index.html`, `record.html`, `PANDUAN.md`, `SENARAI-REKAMAN.md` dan folder `audio` (dengan semua fail di dalamnya). Fail bernama sama akan diganti.
4. Tulis ringkasan seperti "Kemas kini audio", klik **Commit changes**.
5. Tunggu 1 hingga 2 minit, kemudian buka pautan GitHub Pages anda dan tekan **Ctrl+F5** (atau muat semula keras di telefon) supaya versi baharu dimuatkan.

Kemajuan murid yang telah disimpan dalam pelayar tidak hilang kerana kunci simpanan tidak diubah.

## Menyemak rakaman mana yang sudah dikesan

Di menu permainan tekan **🎙️ Semak Audio**. Panel itu menyenaraikan setiap klip, sama ada fail rakaman ditemui atau belum, dan membolehkan anda mendengarnya. Butang "Cuba fail" di situ hanya menguji dalam pelayar anda sendiri dan tidak dilihat murid lain.

## Cara audio berfungsi

- Suara dimainkan melalui satu saluran sahaja, jadi dua rakaman tidak bertindih. Menekan butang berulang kali menghentikan suara terdahulu.
- Apabila suara dimainkan, muzik latar diperlahankan, dan kembali normal selepas suara tamat.
- Audio bermula selepas sentuhan atau klik pertama murid (peraturan pelayar).
- Pujian jawapan betul: dua daripada lima frasa (Yeay, Tahniah, Bagus, Hebat, Terbaik) dipilih rawak tanpa pengulangan berturut-turut. Contoh: "Yeay! Hebat!".
- Fail dicari dalam urutan `.mp3` kemudian `.wav`. Jika anda guna `.m4a`, tukar dahulu kepada `.mp3` atau `.wav`.
- Pada iPhone, suis senyap (silent) di sisi telefon boleh membisukan permainan. Minta murid menghidupkan bunyi telefon.

## Nama huruf yang digunakan (Aktiviti 1)

B = bi, K = ke, S = es, M = em, L = el, J = je, T = ti, P = pi.
Huruf lain tidak digunakan dalam permainan semasa. Jika mahu menambah huruf, edit objek `LETTERS` dalam `index.html` (dan `record.html`) dan semak nama huruf piawai dengan guru atau Dewan Bahasa dan Pustaka.
