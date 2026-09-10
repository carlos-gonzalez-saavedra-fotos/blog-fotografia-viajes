import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: 'tsruit2h',
  api_key: '295752764422784',
  api_secret: 'oi4aixR0KzDswWirSVQTBv2TpbA',
  secure: true
});

const MAPPING_FILE = './scripts/cloudinary-mapping.json';

let mapping = {};
if (fs.existsSync(MAPPING_FILE)) {
  try {
    mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
  } catch (e) {
    mapping = {};
  }
}

const urls = JSON.parse(fs.readFileSync('./scripts/urls.json', 'utf-8'));

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function saveMapping() {
  fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));
}

async function uploadOne(postimgUrl) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const filename = postimgUrl.split('/').pop().replace(/(\.webp|\.jpg|\.png)$/i, '');
      const cleanId = filename.replace(/[^a-zA-Z0-9_-]/g, '_');

      const res = await cloudinary.uploader.upload(postimgUrl, {
        folder: 'cgs_portfolio',
        public_id: cleanId,
        overwrite: true,
        resource_type: 'image'
      });

      const optimizedUrl = res.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
      return { ok: true, url: optimizedUrl };
    } catch (err) {
      if (err?.http_code === 420 || err?.message?.includes('rate limit')) {
        return { ok: false, error: err, isRateLimit: true };
      }
      if (attempt < 3) {
        await sleep(1500 * attempt);
      } else {
        return { ok: false, error: err };
      }
    }
  }
}

async function run() {
  console.log('=== FASE FINAL DE MIGRACIÓN CLOUDINARY (SECUENCIAL) ===');
  const pendingUrls = urls.filter(u => !mapping[u]);
  console.log(`Total URLs: ${urls.length} | Ya migradas: ${Object.keys(mapping).length} | Pendientes: ${pendingUrls.length}`);

  let completed = 0;

  for (let i = 0; i < pendingUrls.length; i++) {
    const url = pendingUrls[i];
    const res = await uploadOne(url);

    if (res && res.ok) {
      mapping[url] = res.url;
      completed++;
      saveMapping();
      const currentTotal = Object.keys(mapping).length;
      if (currentTotal % 10 === 0 || currentTotal === urls.length) {
        console.log(`Progreso: [${currentTotal}/${urls.length}] fotos completadas.`);
      }
    } else {
      console.error(`Fallo en url: ${url}`, res?.error?.message || res?.error);
      if (res?.isRateLimit) {
        console.log('Límite de tasa por hora alcanzado.');
        break;
      }
    }

    await sleep(250);
  }

  saveMapping();
  console.log('=== MIGRACIÓN FINALIZADA CON ÉXITO ===');
  console.log(`Total final en Cloudinary: ${Object.keys(mapping).length} de ${urls.length}`);
}

run();
