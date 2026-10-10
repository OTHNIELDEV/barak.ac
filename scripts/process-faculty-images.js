const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processFacultyImages() {
    const destDir = path.join(__dirname, '..', 'public', 'images', 'faculty');
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    const uploadedDir = '/Users/isangsoo/.gemini/antigravity/brain/89abb9e3-4329-4d3c-8873-a258b7ae3a66/.user_uploaded';
    const tempDir = '/Users/isangsoo/.gemini/antigravity/brain/tempmediaStorage';

    // 1. 송민원 교수 (media_1788331708736.jpg)
    const imgSong = path.join(uploadedDir, 'media_1788331708736.jpg');
    if (fs.existsSync(imgSong)) {
        await sharp(imgSong)
            .resize(800, 1000, { fit: 'cover', position: 'top' })
            .jpeg({ quality: 90 })
            .toFile(path.join(destDir, 'song-minwon.jpg'));
        console.log('✓ 송민원 교수 사진 처리 완료');
    }

    // 2. 김영희 교수 (media_1788331708737.jpg)
    const imgKimYH = path.join(uploadedDir, 'media_1788331708737.jpg');
    if (fs.existsSync(imgKimYH)) {
        await sharp(imgKimYH)
            .resize(800, 1000, { fit: 'cover', position: 'top' })
            .jpeg({ quality: 90 })
            .toFile(path.join(destDir, 'kim-younghee.jpg'));
        console.log('✓ 김영희 교수 사진 처리 완료');
    }

    // 3. 전예령 교수 (media_1788331708738.jpg)
    const imgJeon = path.join(uploadedDir, 'media_1788331708738.jpg');
    if (fs.existsSync(imgJeon)) {
        await sharp(imgJeon)
            .resize(800, 1000, { fit: 'cover', position: 'top' })
            .jpeg({ quality: 90 })
            .toFile(path.join(destDir, 'jeon-yeryeong.jpg'));
        console.log('✓ 전예령 교수 사진 처리 완료');
    }

    // 4. 박은정 교수 (media_1788331708740.jpg in user_uploaded)
    const imgPark = path.join(uploadedDir, 'media_1788331708740.jpg');
    if (fs.existsSync(imgPark)) {
        await sharp(imgPark)
            .resize(800, 1000, { fit: 'cover', position: 'center' })
            .jpeg({ quality: 90 })
            .toFile(path.join(destDir, 'park-eunjung.jpg'));
        console.log('✓ 박은정 교수 사진 처리 완료');
    }

    // 5. 김종우 교수 (media_1788331708740.jpg in tempmediaStorage - phone screenshot with status bar)
    const imgKimJW = path.join(tempDir, 'media_1788331708740.jpg');
    if (fs.existsSync(imgKimJW)) {
        const metadata = await sharp(imgKimJW).metadata();
        // Crop out the top status bar (approx top 10%) and bottom nav bar (approx bottom 10%)
        const width = metadata.width || 1080;
        const height = metadata.height || 2400;
        const cropTop = Math.round(height * 0.18); // skip black bar and top padding
        const cropHeight = Math.round(height * 0.65); // portrait area
        
        await sharp(imgKimJW)
            .extract({ left: 0, top: cropTop, width: width, height: cropHeight })
            .resize(800, 1000, { fit: 'cover', position: 'top' })
            .jpeg({ quality: 90 })
            .toFile(path.join(destDir, 'kim-jongwoo.jpg'));
        console.log('✓ 김종우 교수 사진 (상하단 바 크롭 및 고화질화) 처리 완료');
    }
}

processFacultyImages().catch(console.error);
