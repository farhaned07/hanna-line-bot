const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

/**
 * Generate Rich Menu image programmatically
 * Size: 2500 x 1686 pixels (3x2 grid for 6 buttons)
 */
const generateRichMenuImage = () => {
    // Use the static design asset provided by the design team (Optimized JPEG < 1MB)
    const sourcePath = path.join(__dirname, '../../assets/richmenu-optimized.jpg');
    const outputPath = path.join(__dirname, '../../assets/richmenu.jpg'); // Change output to jpg

    // Create assets directory if it doesn't exist
    const assetsDir = path.join(__dirname, '../../assets');
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
    }

    if (fs.existsSync(sourcePath)) {
        // Copy the design file to the output path expected by the uploader
        fs.copyFileSync(sourcePath, outputPath);
        console.log(`✅ Rich Menu image used from static asset: ${outputPath}`);
    } else {
        console.warn('⚠️ Static rich menu asset not found, generating fallback...');
        // Fallback to canvas generation if static file missing
        const canvas = createCanvas(2500, 1686);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#E8F5E9'; // Hanna Green Light
        ctx.fillRect(0, 0, 2500, 1686);

        // Draw simple grid
        ctx.strokeStyle = '#06C755';
        ctx.lineWidth = 10;
        ctx.beginPath();
        // Verticals
        ctx.moveTo(833, 0); ctx.lineTo(833, 1686);
        ctx.moveTo(1666, 0); ctx.lineTo(1666, 1686);
        // Horizontal
        ctx.moveTo(0, 843); ctx.lineTo(2500, 843);
        ctx.stroke();

        ctx.font = '100px Arial';
        ctx.fillStyle = '#06C755';
        ctx.textAlign = 'center';
        ctx.fillText('Hanna Pilot (Fallback)', 1250, 843);

        const buffer = canvas.toBuffer('image/jpeg');
        fs.writeFileSync(outputPath, buffer);
    }

    return outputPath;
};

module.exports = { generateRichMenuImage };
