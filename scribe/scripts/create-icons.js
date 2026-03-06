#!/usr/bin/env node

// Simple script to create placeholder PNG icons
// In production, replace with actual designed icons

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, 'public', 'icons');

// Create icons directory if it doesn't exist
if (!existsSync(iconsDir)) {
    mkdirSync(iconsDir, { recursive: true });
}

// Simple 1x1 pixel PNG as placeholder (base64)
// This is a minimal valid PNG that browsers can load
// Replace with actual icons in production
const placeholderPng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
);

// Create icon files
const iconSizes = [
    'icon-192.png',
    'icon-512.png',
    'icon-192-maskable.png',
    'icon-512-maskable.png',
    'icon-96.png'
];

console.log('Creating placeholder icons...');
iconSizes.forEach(size => {
    const filePath = join(iconsDir, size);
    writeFileSync(filePath, placeholderPng);
    console.log(`  ✓ Created ${size}`);
});

console.log('\n⚠️  Placeholder icons created. Replace with actual designed icons:');
console.log('  - 192x192: App icon for Android/home screen');
console.log('  - 512x512: Large app icon');
console.log('  - 96x96: Shortcut icon');
console.log('\nRecommended: Use Figma/Canva to create proper Hanna Scribe icons');
console.log('with the purple gradient orb + mic symbol design.');
