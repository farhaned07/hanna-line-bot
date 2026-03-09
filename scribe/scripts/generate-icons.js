#!/usr/bin/env node

/**
 * Generate PWA icons from SVG
 * Run: node scripts/generate-icons.js
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const iconsDir = join(publicDir, 'icons');
const screenshotsDir = join(publicDir, 'screenshots');

// Ensure directories exist
if (!existsSync(iconsDir)) {
    mkdirSync(iconsDir, { recursive: true });
    console.log('✅ Created icons directory');
}

if (!existsSync(screenshotsDir)) {
    mkdirSync(screenshotsDir, { recursive: true });
    console.log('✅ Created screenshots directory');
}

// Read SVG
const svgPath = join(iconsDir, 'icon-192.svg');
const svgContent = readFileSync(svgPath, 'utf-8');

// Icon sizes to generate
const sizes = [
    { size: 192, name: 'icon-192.png', maskable: false },
    { size: 512, name: 'icon-512.png', maskable: false },
    { size: 192, name: 'icon-192-maskable.png', maskable: true },
    { size: 512, name: 'icon-512-maskable.png', maskable: true },
];

console.log('🎨 Generating PWA icons from SVG...\n');

sizes.forEach(({ size, name, maskable }) => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // For maskable icons, add padding
    const drawSize = maskable ? size * 0.72 : size;
    const offset = (size - drawSize) / 2;
    
    // Create gradient (matching SVG)
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#6366F1');
    gradient.addColorStop(1, '#8B5CF6');
    
    // Background
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, maskable ? size * 0.2 : size * 0.2);
    ctx.fill();
    
    // Phone outline (simplified)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    const phoneX = size * 0.305;
    const phoneY = size * 0.156;
    const phoneW = size * 0.39;
    const phoneH = size * 0.688;
    const phoneR = size * 0.047;
    ctx.beginPath();
    ctx.roundRect(phoneX, phoneY, phoneW, phoneH, phoneR);
    ctx.fill();
    
    // Screen
    ctx.fillStyle = '#FFFFFF';
    const screenX = size * 0.336;
    const screenY = size * 0.215;
    const screenW = size * 0.328;
    const screenH = size * 0.566;
    const screenR = size * 0.016;
    ctx.beginPath();
    ctx.roundRect(screenX, screenY, screenW, screenH, screenR);
    ctx.fill();
    
    // Mic icon circle
    ctx.fillStyle = '#6366F1';
    const micCircleX = size / 2;
    const micCircleY = size * 0.45;
    const micCircleR = size * 0.098;
    ctx.beginPath();
    ctx.arc(micCircleX, micCircleY, micCircleR, 0, Math.PI * 2);
    ctx.fill();
    
    // Mic icon (white)
    ctx.fillStyle = '#FFFFFF';
    const micX = size * 0.477;
    const micY = size * 0.402;
    const micW = size * 0.047;
    const micH = size * 0.07;
    const micR = micW / 2;
    ctx.beginPath();
    ctx.roundRect(micX, micY, micW, micH, micR);
    ctx.fill();
    
    // Mic stand
    const standX = size * 0.488;
    const standY = size * 0.48;
    const standW = size * 0.023;
    const standH = size * 0.039;
    const standR = micR / 2;
    ctx.beginPath();
    ctx.roundRect(standX, standY, standW, standH, standR);
    ctx.fill();
    
    // Sound waves
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = Math.max(2, size * 0.008);
    ctx.lineCap = 'round';
    
    // Left waves
    ctx.beginPath();
    ctx.moveTo(size * 0.39, micCircleY);
    ctx.quadraticCurveTo(size * 0.37, micCircleY, size * 0.37, micCircleY);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(size * 0.42, micCircleY - size * 0.03);
    ctx.quadraticCurveTo(size * 0.39, micCircleY - size * 0.03, size * 0.39, micCircleY);
    ctx.stroke();
    
    // Right waves
    ctx.beginPath();
    ctx.moveTo(size * 0.61, micCircleY);
    ctx.quadraticCurveTo(size * 0.63, micCircleY, size * 0.63, micCircleY);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(size * 0.58, micCircleY - size * 0.03);
    ctx.quadraticCurveTo(size * 0.61, micCircleY - size * 0.03, size * 0.61, micCircleY);
    ctx.stroke();
    
    // Text lines (representing notes)
    ctx.fillStyle = '#E5E7EB';
    const line1X = size * 0.371;
    const line1Y = size * 0.547;
    const line1W = size * 0.258;
    const line1H = size * 0.016;
    ctx.beginPath();
    ctx.roundRect(line1X, line1Y, line1W, line1H, line1H / 2);
    ctx.fill();
    
    ctx.fillStyle = '#F3F4F6';
    const line2Y = line1Y + size * 0.027;
    const line2W = size * 0.195;
    ctx.beginPath();
    ctx.roundRect(line1X, line2Y, line2W, line1H, line1H / 2);
    ctx.fill();
    
    const line3Y = line2Y + size * 0.027;
    const line3W = size * 0.234;
    ctx.beginPath();
    ctx.roundRect(line1X, line3Y, line3W, line1H, line1H / 2);
    ctx.fill();
    
    // Home indicator
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    const homeX = size * 0.461;
    const homeY = size * 0.801;
    const homeW = size * 0.078;
    const homeH = size * 0.008;
    ctx.beginPath();
    ctx.roundRect(homeX, homeY, homeW, homeH, homeH / 2);
    ctx.fill();
    
    // Write PNG
    const outputPath = join(iconsDir, name);
    const buffer = canvas.toBuffer('image/png');
    writeFileSync(outputPath, buffer);
    
    console.log(`✅ Generated: ${name} (${size}x${size})${maskable ? ' [maskable]' : ''}`);
});

console.log('\n✅ All icons generated successfully!');
console.log('\n📁 Files created:');
console.log('   - public/icons/icon-192.png');
console.log('   - public/icons/icon-512.png');
console.log('   - public/icons/icon-192-maskable.png');
console.log('   - public/icons/icon-512-maskable.png');
console.log('   - public/screenshots/ (folder created)');
console.log('\n🔧 Next: Add actual screenshots to public/screenshots/');
