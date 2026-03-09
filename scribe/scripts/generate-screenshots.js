#!/usr/bin/env node

/**
 * Generate placeholder screenshots for PWA manifest
 * Run: node scripts/generate-screenshots.js
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';

const __dirname = dirname(fileURLToPath(import.meta.url));
const screenshotsDir = join(__dirname, '..', 'public', 'screenshots');

if (!existsSync(screenshotsDir)) {
    mkdirSync(screenshotsDir, { recursive: true });
}

console.log('📸 Generating placeholder screenshots...\n');

// Home screen screenshot (1280x720)
function generateHomeScreenshot() {
    const canvas = createCanvas(1280, 720);
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, 1280, 720);
    
    // Header
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 1280, 140);
    
    // Logo
    ctx.fillStyle = '#6366F1';
    ctx.beginPath();
    ctx.roundRect(48, 48, 40, 40, 8);
    ctx.fill();
    
    // Title
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 32px Inter, system-ui, sans-serif';
    ctx.fillText('Hanna Scribe', 100, 76);
    
    // Subtitle
    ctx.fillStyle = '#6B7280';
    ctx.font = '16px Inter, system-ui, sans-serif';
    ctx.fillText('Clinical Documentation', 100, 100);
    
    // Stats card
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(48, 164, 280, 120, 16);
    ctx.fill();
    
    // Stats icon
    ctx.fillStyle = '#6366F1';
    ctx.beginPath();
    ctx.roundRect(68, 184, 48, 48, 12);
    ctx.fill();
    
    // Stats text
    ctx.fillStyle = '#94A3B8';
    ctx.font = '14px Inter, system-ui, sans-serif';
    ctx.fillText('Notes', 68, 256);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px Inter, system-ui, sans-serif';
    ctx.fillText('7 / 10', 68, 296);
    
    // Search bar
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(48, 316, 580, 56, 12);
    ctx.fill();
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Search icon (circle)
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(76, 344, 12, 0, Math.PI * 2);
    ctx.stroke();
    
    // Search text
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '16px Inter, system-ui, sans-serif';
    ctx.fillText('Search patients...', 100, 350);
    
    // Today section
    ctx.fillStyle = '#6B7280';
    ctx.font = 'bold 12px Inter, system-ui, sans-serif';
    ctx.fillText('TODAY', 48, 420);
    
    // Session cards
    for (let i = 0; i < 3; i++) {
        const y = 452 + (i * 96);
        
        // Card background
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(48, y, 580, 80, 16);
        ctx.fill();
        ctx.strokeStyle = '#F3F4F6';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Avatar
        ctx.fillStyle = '#6366F1';
        ctx.beginPath();
        ctx.arc(88, y + 40, 24, 0, Math.PI * 2);
        ctx.fill();
        
        // Patient name
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 16px Inter, system-ui, sans-serif';
        ctx.fillText(`Patient ${i + 1}`, 128, y + 36);
        
        // HN
        ctx.fillStyle = '#6B7280';
        ctx.font = '14px Inter, system-ui, sans-serif';
        ctx.fillText(`HN: ${10000 + i * 1234}`, 128, y + 58);
        
        // Status badge
        ctx.fillStyle = i === 0 ? '#FEF3C7' : '#D1FAE5';
        ctx.beginPath();
        ctx.roundRect(520, y + 24, 88, 32, 8);
        ctx.fill();
        
        ctx.fillStyle = i === 0 ? '#D97706' : '#059669';
        ctx.font = 'bold 12px Inter, system-ui, sans-serif';
        ctx.fillText(i === 0 ? 'Draft' : 'Finalized', 532, y + 46);
    }
    
    // FAB (Floating Action Button)
    ctx.fillStyle = '#6366F1';
    ctx.beginPath();
    ctx.roundRect(1164, 580, 72, 72, 16);
    ctx.fill();
    ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 4;
    
    // Plus icon
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(1200, 604);
    ctx.lineTo(1200, 628);
    ctx.moveTo(1188, 616);
    ctx.lineTo(1212, 616);
    ctx.stroke();
    
    // Tab bar
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 656, 1280, 64);
    ctx.strokeStyle = '#F3F4F6';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 656);
    ctx.lineTo(1280, 656);
    ctx.stroke();
    
    // Tab icons
    const tabs = [
        { x: 213, label: 'Home', active: true },
        { x: 640, label: 'Handover', active: false },
        { x: 1067, label: 'Settings', active: false }
    ];
    
    tabs.forEach(tab => {
        // Icon circle
        ctx.fillStyle = tab.active ? '#6366F1' : '#E5E7EB';
        ctx.beginPath();
        ctx.arc(tab.x, 680, 16, 0, Math.PI * 2);
        ctx.fill();
        
        // Label
        ctx.fillStyle = tab.active ? '#6366F1' : '#9CA3AF';
        ctx.font = 'bold 12px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(tab.label, tab.x, 708);
    });
    
    ctx.textAlign = 'left';
    
    const outputPath = join(screenshotsDir, 'home.png');
    writeFileSync(outputPath, canvas.toBuffer('image/png'));
    console.log('✅ Generated: home.png (1280x720)');
}

// Recording screen screenshot (750x1334)
function generateRecordScreenshot() {
    const canvas = createCanvas(750, 1334);
    const ctx = canvas.getContext('2d');
    
    // Dark gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, 1334);
    gradient.addColorStop(0, '#0F0F1A');
    gradient.addColorStop(0.3, '#131328');
    gradient.addColorStop(1, '#161630');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 750, 1334);
    
    // Top bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(24, 60, 52, 52, 26);
    ctx.fill();
    
    // X icon
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(50, 80);
    ctx.lineTo(70, 100);
    ctx.moveTo(70, 80);
    ctx.lineTo(50, 100);
    ctx.stroke();
    
    // Recording indicator
    ctx.fillStyle = '#FF3B30';
    ctx.beginPath();
    ctx.arc(654, 86, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Timer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'bold 20px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('02:34', 375, 94);
    
    // Patient info
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Inter, system-ui, sans-serif';
    ctx.fillText('John Doe', 375, 200);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '16px Inter, system-ui, sans-serif';
    ctx.fillText('HN: 12345', 375, 230);
    
    // Main orb
    const orbGradient = ctx.createRadialGradient(295, 567, 0, 375, 667, 140);
    orbGradient.addColorStop(0, '#A5B4FC');
    orbGradient.addColorStop(0.45, '#6366F1');
    orbGradient.addColorStop(0.7, '#4F46E5');
    orbGradient.addColorStop(1, '#4338CA');
    
    ctx.fillStyle = orbGradient;
    ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';
    ctx.shadowBlur = 80;
    ctx.shadowOffsetY = 0;
    ctx.beginPath();
    ctx.arc(375, 667, 70, 0, Math.PI * 2);
    ctx.fill();
    
    // Orb rings
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(375, 667, 110, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
    ctx.beginPath();
    ctx.arc(375, 667, 140, 0, Math.PI * 2);
    ctx.stroke();
    
    // Status text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '16px Inter, system-ui, sans-serif';
    ctx.fillText('🎤 Recording...', 375, 820);
    
    // Large timer
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 72px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('02:34', 375, 920);
    
    // Duration hint
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 16px Inter, system-ui, sans-serif';
    ctx.fillText('Perfect length', 375, 950);
    
    // Tips card
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.beginPath();
    ctx.roundRect(75, 990, 600, 72, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '16px Inter, system-ui, sans-serif';
    ctx.fillText('🎤 Speak clearly and naturally', 375, 1034);
    
    // Controls
    // Pause button
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.arc(225, 1180, 32, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(215, 1168);
    ctx.lineTo(215, 1192);
    ctx.moveTo(225, 1168);
    ctx.lineTo(225, 1192);
    ctx.stroke();
    
    // Done button (large)
    const doneGradient = ctx.createLinearGradient(323, 1148, 427, 1212);
    doneGradient.addColorStop(0, '#6366F1');
    doneGradient.addColorStop(1, '#8B5CF6');
    ctx.fillStyle = doneGradient;
    ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(375, 1180, 42, 0, Math.PI * 2);
    ctx.fill();
    
    // Square icon
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.roundRect(359, 1164, 32, 32, 6);
    ctx.fill();
    
    // Spacer (symmetry)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.arc(525, 1180, 32, 0, Math.PI * 2);
    ctx.fill();
    
    const outputPath = join(screenshotsDir, 'record.png');
    writeFileSync(outputPath, canvas.toBuffer('image/png'));
    console.log('✅ Generated: record.png (750x1334)');
}

generateHomeScreenshot();
generateRecordScreenshot();

console.log('\n✅ All screenshots generated!');
console.log('\n📁 Files:');
console.log('   - public/screenshots/home.png');
console.log('   - public/screenshots/record.png');
