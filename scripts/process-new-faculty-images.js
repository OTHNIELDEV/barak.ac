const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processNewFacultyImages() {
    const destDir = path.join(__dirname, '..', 'public', 'images', 'faculty');
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    const uploadedDir = '/Users/isangsoo/.gemini/antigravity/brain/89abb9e3-4329-4d3c-8873-a258b7ae3a66/.user_uploaded';

    // 1. 송민원 교수 (media_1788332282612.jpg)
    const imgSong = path.join(uploadedDir, 'media_1788332282612.jpg');
    if (fs.existsSync(imgSong)) {
        await sharp(imgSong)
            .resize(800, 1000, { fit: 'cover', position: 'top' })
            .jpeg({ quality: 95 })
            .toFile(path.join(destDir, 'song-minwon.jpg'));
        console.log('✓ 송민원 교수 사진 처리 완료 (song-minwon.jpg)');
    }

    // 2. 전예령 교수 (media_1788332282613.jpg)
    const imgJeon = path.join(uploadedDir, 'media_1788332282613.jpg');
    if (fs.existsSync(imgJeon)) {
        await sharp(imgJeon)
            .resize(800, 1000, { fit: 'cover', position: 'top' })
            .jpeg({ quality: 95 })
            .toFile(path.join(destDir, 'jeon-yeryeong.jpg'));
        console.log('✓ 전예령 교수 사진 처리 완료 (jeon-yeryeong.jpg)');
    }

    // 3. 김영희 교수 (media_1788332282637.jpg)
    const imgKimYH = path.join(uploadedDir, 'media_1788332282637.jpg');
    if (fs.existsSync(imgKimYH)) {
        await sharp(imgKimYH)
            .resize(800, 1000, { fit: 'cover', position: 'top' })
            .jpeg({ quality: 95 })
            .toFile(path.join(destDir, 'kim-younghee.jpg'));
        console.log('✓ 김영희 교수 사진 처리 완료 (kim-younghee.jpg)');
    }

    // 4. 박은정 교수 (media_1788332282640.jpg)
    const imgPark = path.join(uploadedDir, 'media_1788332282640.jpg');
    if (fs.existsSync(imgPark)) {
        await sharp(imgPark)
            .resize(800, 1000, { fit: 'cover', position: 'center' })
            .jpeg({ quality: 95 })
            .toFile(path.join(destDir, 'park-eunjung.jpg'));
        console.log('✓ 박은정 교수 사진 처리 완료 (park-eunjung.jpg)');
    }
}

processNewFacultyImages().catch(console.error);
