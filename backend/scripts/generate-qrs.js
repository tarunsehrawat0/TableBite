const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const output = process.env.QR_OUTPUT_DIR || path.join(__dirname, '..', '..', 'frontend', 'qr-codes');
const baseUrl = (process.env.QR_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
fs.mkdirSync(output, { recursive: true });

(async () => {
  await QRCode.toFile(path.join(output, 'restaurant.png'), `${baseUrl}/`, {
    width: 512,
    margin: 2,
    color: { dark: '#18211b', light: '#fffdf8' }
  });
  for (let table = 1; table <= 10; table += 1) {
    await QRCode.toFile(path.join(output, `table-${table}.png`), `${baseUrl}/?table=${table}`, {
      width: 512,
      margin: 2,
      color: { dark: '#18211b', light: '#fffdf8' }
    });
  }
  console.log(JSON.stringify({ event: 'qr_codes_generated', count: 10, baseUrl, output }));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
