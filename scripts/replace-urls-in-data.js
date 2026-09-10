import fs from 'fs';
import path from 'path';

const MAPPING_FILE = './scripts/cloudinary-mapping.json';

if (!fs.existsSync(MAPPING_FILE)) {
  console.error('Mapping file not found');
  process.exit(1);
}

const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));

function replaceInDir(dir) {
  let totalReplacements = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      totalReplacements += replaceInDir(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let fileReplacements = 0;

      for (const [postimgUrl, cloudinaryUrl] of Object.entries(mapping)) {
        if (content.includes(postimgUrl)) {
          content = content.replaceAll(postimgUrl, cloudinaryUrl);
          fileReplacements++;
          totalReplacements++;
        }
      }

      if (fileReplacements > 0) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated ${fullPath}: ${fileReplacements} URLs replaced`);
      }
    }
  }

  return totalReplacements;
}

const total = replaceInDir('./src');
console.log(`\n🎉 TOTAL URLs replaced across entire src directory: ${total}`);
