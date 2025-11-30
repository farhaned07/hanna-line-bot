const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

/**
 * Generate Rich Menu image programmatically
 * Size: 2500 x 1686 pixels (2x2 grid)
 */
const generateRichMenuImage = () => {
    const width = 2500;
    const height = 1686;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Define grid
    const cellWidth = width / 2;
    const cellHeight = height / 2;

    // Colors
    const primaryColor = '#06C755'; // LINE Green
    const textColor = '#2C2C2C';
    const borderColor = '#E0E0E0';

    // Draw grid borders
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 4;

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(cellWidth, 0);
    ctx.lineTo(cellWidth, height);
    ctx.stroke();

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(0, cellHeight);
    ctx.lineTo(width, cellHeight);
    ctx.stroke();

    // Function to draw a button
    const drawButton = (x, y, emoji, text, bgColor = '#F8F8F8') => {
        // Background
        ctx.fillStyle = bgColor;
        ctx.fillRect(x + 20, y + 20, cellWidth - 40, cellHeight - 40);

        // Border
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 6;
        ctx.strokeRect(x + 20, y + 20, cellWidth - 40, cellHeight - 40);

        // Emoji
        ctx.font = 'bold 180px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = textColor;
        ctx.fillText(emoji, x + cellWidth / 2, y + cellHeight / 2 - 100);

        // Text
        ctx.font = 'bold 80px Arial';
        ctx.fillStyle = textColor;
        ctx.fillText(text, x + cellWidth / 2, y + cellHeight / 2 + 120);
    };

    // Draw buttons
    drawButton(0, 0, '🩺', 'เช็คสุขภาพ', '#E8F5E9');
    drawButton(cellWidth, 0, '💊', 'บันทึกกินยา', '#FFF3E0');
    drawButton(0, cellHeight, '👤', 'โปรไฟล์ของฉัน', '#E3F2FD');
    drawButton(cellWidth, cellHeight, 'ℹ️', 'ช่วยเหลือ', '#F3E5F5');

    // Save to file
    const outputPath = path.join(__dirname, '../../assets/richmenu.png');

    // Create assets directory if it doesn't exist
    const assetsDir = path.join(__dirname, '../../assets');
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
    }

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);

    console.log(`✅ Rich Menu image generated: ${outputPath}`);
    return outputPath;
};

module.exports = { generateRichMenuImage };
