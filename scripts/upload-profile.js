import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: 'tsruit2h',
  api_key: '295752764422784',
  api_secret: 'oi4aixR0KzDswWirSVQTBv2TpbA',
  secure: true
});

async function uploadProfile() {
  const url = 'https://i.postimg.cc/GhB8RZvM/Carlos-Gonzalez-Saavedra.webp';
  
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      console.log(`Attempt ${attempt} uploading profile image...`);
      const res = await cloudinary.uploader.upload(url, {
        folder: 'cgs_portfolio',
        public_id: 'Carlos_Gonzalez_Saavedra',
        overwrite: true,
        resource_type: 'image'
      });
      const optimizedUrl = res.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
      console.log('SUCCESS! Uploaded profile photo:', optimizedUrl);

      const mapping = JSON.parse(fs.readFileSync('./scripts/cloudinary-mapping.json', 'utf-8'));
      mapping[url] = optimizedUrl;
      fs.writeFileSync('./scripts/cloudinary-mapping.json', JSON.stringify(mapping, null, 2));

      // Update in Home.tsx
      let homeContent = fs.readFileSync('./src/pages/Home.tsx', 'utf-8');
      homeContent = homeContent.replace(url, optimizedUrl);
      fs.writeFileSync('./src/pages/Home.tsx', homeContent, 'utf-8');
      console.log('Updated Home.tsx with new profile photo URL');
      return;
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err.message || err);
      console.log('Waiting 10 seconds before next attempt...');
      await new Promise(r => setTimeout(r, 10000));
    }
  }
}

uploadProfile();
