const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

/**
 * Generate Rich Menu image programmatically
 * Size: 2500 x 1686 pixels (3x2 grid for 6 buttons)
 */
const generateRichMenuImage = () => {
    const width = 2500;
    const height = 1686;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background - Gradient effect
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Define 3x2 grid
    const cols = 3;
    const rows = 2;
    const cellWidth = width / cols;  // ~833
    const cellHeight = height / rows; // 843

    // Colors
    const primaryColor = '#06C755'; // LINE Green
    const textColor = '#2C2C2C';
    const borderColor = '#E0E0E0';

    // Draw grid borders
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 4;

    // Vertical lines
    for (let i = 1; i < cols; i++) {
        ctx.beginPath();
        ctx.moveTo(cellWidth * i, 0);
        ctx.lineTo(cellWidth * i, height);
        ctx.stroke();
    }

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(0, cellHeight);
    ctx.lineTo(width, cellHeight);
    ctx.stroke();

    // Function to draw a button
    const drawButton = (col, row, emoji, text, bgColor = '#F8F8F8') => {
        const x = col * cellWidth;
        const y = row * cellHeight;

        // Background
        ctx.fillStyle = bgColor;
        ctx.fillRect(x + 10, y + 10, cellWidth - 20, cellHeight - 20);

        // Border
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 4;
        ctx.strokeRect(x + 10, y + 10, cellWidth - 20, cellHeight - 20);

        // Emoji
        ctx.font = 'bold 140px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = textColor;
        ctx.fillText(emoji, x + cellWidth / 2, y + cellHeight / 2 - 80);

        // Text
        ctx.font = 'bold 60px Arial';
        ctx.fillStyle = textColor;
        ctx.fillText(text, x + cellWidth / 2, y + cellHeight / 2 + 100);
    };

    // Draw 6 buttons (3x2 grid)
    // Top row
    drawButton(0, 0, '🎙️', 'โทรหาฮันนา', '#E8F5E9');      // Call Hanna
    drawButton(1, 0, '❤️', 'เช็คสุขภาพ', '#FCE4EC');      // Check Health
    drawButton(2, 0, '📊', 'บันทึกค่า', '#E3F2FD');       // Log Vitals

    // Bottom row
    drawButton(0, 1, '💊', 'บันทึกกินยา', '#FFF3E0');     // Log Meds
    drawButton(1, 1, '👤', 'โปรไฟล์ของฉัน', '#E8EAF6');   // Profile
    drawButton(2, 1, 'ℹ️', 'ช่วยเหลือ', '#F3E5F5');      // Help

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
