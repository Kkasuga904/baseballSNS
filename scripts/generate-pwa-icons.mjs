import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceImage = join(__dirname, '../public/pwa-icon.png');
const publicDir = join(__dirname, '../public');

const sizes = [
  { size: 120, name: 'icon-120x120.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 167, name: 'icon-167x167.png' },
  { size: 180, name: 'icon-180x180.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' }
];

async function generateIcons() {
  for (const { size, name } of sizes) {
    try {
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(join(publicDir, name));
      
      console.log(`✅ Generated ${name}`);
    } catch (error) {
      console.error(`❌ Error generating ${name}:`, error);
    }
  }
  
  // Apple Touch Icon用
  try {
    await sharp(sourceImage)
      .resize(180, 180, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(join(publicDir, 'apple-touch-icon.png'));
    
    console.log('✅ Generated apple-touch-icon.png');
  } catch (error) {
    console.error('❌ Error generating apple-touch-icon.png:', error);
  }
  
  console.log('🎉 All PWA icons generated successfully!');
}

generateIcons();