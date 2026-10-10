const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateFavicons() {
    const rootDir = path.join(__dirname, '..');
    const svgPath = path.join(rootDir, 'public', 'favicon.svg');
    const svgBuffer = fs.readFileSync(svgPath);

    // 1. Generate 32x32 PNG for favicon
    const png32 = await sharp(svgBuffer)
        .resize(32, 32)
        .png()
        .toBuffer();

    // 2. Generate 48x48 PNG
    const png48 = await sharp(svgBuffer)
        .resize(48, 48)
        .png()
        .toBuffer();

    // 3. Generate 192x192 PNG for Android / PWA
    await sharp(svgBuffer)
        .resize(192, 192)
        .png()
        .toFile(path.join(rootDir, 'public', 'icon-192.png'));

    // 4. Generate 512x512 PNG
    await sharp(svgBuffer)
        .resize(512, 512)
        .png()
        .toFile(path.join(rootDir, 'public', 'icon-512.png'));

    // 5. Generate 180x180 Apple Touch Icon
    await sharp(svgBuffer)
        .resize(180, 180)
        .png()
        .toFile(path.join(rootDir, 'public', 'apple-touch-icon.png'));

    // 6. Generate PNG favicon
    fs.writeFileSync(path.join(rootDir, 'public', 'favicon.png'), png32);
    fs.writeFileSync(path.join(rootDir, 'src', 'app', 'icon.png'), png32);
    fs.writeFileSync(path.join(rootDir, 'public', 'icon.png'), png32);

    // 7. Write to favicon.ico
    fs.writeFileSync(path.join(rootDir, 'src', 'app', 'favicon.ico'), png32);
    fs.writeFileSync(path.join(rootDir, 'public', 'favicon.ico'), png32);

    console.log('✅ All favicons successfully generated from SVG!');
}

generateFavicons().catch(console.error);
