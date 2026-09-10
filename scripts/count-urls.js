import fs from 'fs';
import path from 'path';

const dir = './src/data';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));
const urls = new Set();
const fileUrlMap = {};

files.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf-8');
  const matches = content.match(/https:\/\/i\.postimg\.cc\/[^\s"'`]+/g);
  if (matches) {
    matches.forEach(u => {
      urls.add(u);
      if (!fileUrlMap[u]) fileUrlMap[u] = [];
      fileUrlMap[u].push(file);
    });
  }
});

console.log('Total unique Postimages URLs:', urls.size);
fs.writeFileSync('./scripts/urls.json', JSON.stringify(Array.from(urls), null, 2));
