const https = require('https');
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const logUrl = 'https://storage.googleapis.com/eas-workflows-production/logs/31433eef-4cdb-422f-9953-841a6935356b/6df278b1-b57f-4ca9-9dc4-3fa52d2ef994/2026-08-24T00%3A02%3A57Z-2d217911-5620-40c2-9467-2228f15c2ff9.txt?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=www-production%40exponentjs.iam.gserviceaccount.com%2F20260824%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20260824T000630Z&X-Goog-Expires=900&X-Goog-SignedHeaders=host&X-Goog-Signature=162468d73bb5c04b690d359559bd4888b433fa6cf824fe48ecc41251779fe8b25d349cc5667ce99c15875415f8df0585a12df9f2df3a42192b55bead278a2aab62731144cc862bec43ba82b58020f2a08b6a24fd76de6d2c5ab22b3f8f8b1ee78d1053cfff0a36fbed88b4ff824fa50493c51f1917f29e1de875bff301d627754d576bb958a77dfb3f36ea3824cc5b234a813973673403bd5b17cb26d19844404a7103a9f770422bd47897c60f7bc3cf3575206e89d044c6a9a01270f323a2195021c9aba9d1711f435716f83886dee1119d437dbbbe5cc11b997176744f08bb5b97efe7f4f100c5e4d1547edbc404f78da3d319d8f5704451e2aac08a00a026';

const outPath = path.join('C:\\Users\\lenovo\\AppData\\Local\\Temp\\kilo', 'eas_build_log2.txt');

https.get(logUrl, { headers: { 'Accept-Encoding': 'identity' } }, (res) => {
  const chunks = [];
  res.on('data', (chunk) => chunks.push(chunk));
  res.on('end', () => {
    const buffer = Buffer.concat(chunks);
    console.log('Downloaded size:', buffer.length);
    
    // Try to decompress
    let text;
    try {
      const decompressed = zlib.gunzipSync(buffer);
      text = decompressed.toString('utf-8');
      console.log('Decompressed as gzip');
    } catch (e) {
      try {
        const decompressed = zlib.inflateRawSync(buffer);
        text = decompressed.toString('utf-8');
        console.log('Decompressed as raw deflate');
      } catch (e2) {
        text = buffer.toString('utf-8');
        console.log('Not compressed');
      }
    }
    
    fs.writeFileSync(outPath, text);
    console.log('Saved to:', outPath);
    console.log('--- LAST 8000 CHARS ---');
    console.log(text.substring(Math.max(0, text.length - 8000)));
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
