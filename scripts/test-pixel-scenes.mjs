import fs from 'fs';
import path from 'path';
import { SCENE_IMAGE_MAP, SCENE_THEMES } from '../src/components/SceneViewport.jsx';

console.log('--- Verifying Scene Assets and Mappings ---');

const sceneKeys = Object.keys(SCENE_IMAGE_MAP);
console.log(`Total mapped scene keys: ${sceneKeys.length}`);

let missingCount = 0;
const checkedPaths = new Set();

for (const key of sceneKeys) {
  const relPath = SCENE_IMAGE_MAP[key];
  if (!checkedPaths.has(relPath)) {
    checkedPaths.add(relPath);
    const fullPath = path.join(process.cwd(), 'public', relPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Missing asset for scene [${key}]: ${relPath}`);
      missingCount++;
    } else {
      const stats = fs.statSync(fullPath);
      console.log(`✅ [${key}] -> ${relPath} (${Math.round(stats.size / 1024)} KB)`);
    }
  }
}

if (missingCount === 0) {
  console.log('\n🎉 ALL SCENE ASSETS EXIST AND ARE READY IN PUBLIC FOLDER!');
} else {
  console.error(`\n❌ Found ${missingCount} missing assets.`);
  process.exit(1);
}
