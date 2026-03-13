#!/usr/bin/env node
/**
 * scripts/generate-og-images.js
 * Purpose: Generate Open Graph (OG) images for social media sharing
 * Output: `public/og/` directory with 1200x630 PNG images
 * 
 * Usage:
 *  - Install sharp: `npm install sharp`
 *  - Run: `node scripts/generate-og-images.js`
 */

const fs = require('fs');
const path = require('path');
const REPO_ROOT = path.resolve(__dirname, '..');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Missing dependency: `sharp` is required to generate OG images.');
  console.error('Install it with: npm install sharp');
  process.exit(1);
}

// OG Image dimensions (recommended by Open Graph protocol)
const WIDTH = 1200;
const HEIGHT = 630;
const OUTPUT_DIR = path.join(REPO_ROOT, 'public', 'og');

// Ensure output directory exists
function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

/**
 * Generate a simple OG image with text overlay
 * @param {string} title - Main title text
 * @param {string} subtitle - Subtitle or tagline (optional)
 * @param {string} outputFileName - Output filename (e.g., 'about.png')
 * @param {object} options - Customization options
 */
async function generateOGImage(title, subtitle = '', outputFileName, options = {}) {
  const {
    bgColor = '#FF6B35', // Saffron/Orange - traditional Hindu color
    textColor = '#FFFFFF',
    accentColor = '#FFD700', // Gold accent
    fontSize = 72,
    subtitleSize = 36,
  } = options;

  // Create SVG with text
  const svgImage = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background gradient -->
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#E85D04;stop-opacity:1" />
        </linearGradient>
        <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="${accentColor}" opacity="0.1"/>
        </pattern>
      </defs>
      
      <!-- Background -->
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grad)"/>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#dots)"/>
      
      <!-- Decorative elements -->
      <circle cx="100" cy="100" r="150" fill="${accentColor}" opacity="0.1"/>
      <circle cx="${WIDTH - 100}" cy="${HEIGHT - 100}" r="120" fill="${accentColor}" opacity="0.1"/>
      
      <!-- Title text -->
      <text
        x="50%"
        y="45%"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${fontSize}"
        font-weight="bold"
        fill="${textColor}"
        text-anchor="middle"
        dominant-baseline="middle"
        style="text-shadow: 2px 2px 4px rgba(0,0,0,0.3);"
      >
        ${escapeXml(wrapText(title, 18))}
      </text>
      
      ${subtitle ? `
      <text
        x="50%"
        y="60%"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${subtitleSize}"
        fill="${textColor}"
        text-anchor="middle"
        dominant-baseline="middle"
        opacity="0.9"
      >
        ${escapeXml(subtitle)}
      </text>
      ` : ''}
      
      <!-- Bottom branding -->
      <text
        x="50%"
        y="${HEIGHT - 40}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="28"
        fill="${textColor}"
        text-anchor="middle"
        opacity="0.8"
      >
        sanatanadharmam.in
      </text>
      
      <!-- Decorative bottom line -->
      <rect x="400" y="${HEIGHT - 70}" width="400" height="3" fill="${accentColor}" opacity="0.6"/>
    </svg>
  `;

  const outputPath = path.join(OUTPUT_DIR, outputFileName);
  
  try {
    await sharp(Buffer.from(svgImage))
      .resize(WIDTH, HEIGHT)
      .png({ compressionLevel: 9 })
      .toFile(outputPath);
    
    console.log(`✓ Generated: ${outputFileName}`);
    return outputPath;
  } catch (err) {
    console.error(`✗ Failed to generate ${outputFileName}:`, err.message);
    throw err;
  }
}

/**
 * Wrap text to fit within a certain character limit per line
 */
function wrapText(text, maxChars) {
  if (text.length <= maxChars) return text;
  
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxChars) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  // For SVG, we need to create multiple tspan elements
  return lines.slice(0, 2).join(' '); // Limit to 2 lines for simplicity
}

/**
 * Escape XML special characters
 */
function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Define pages to generate OG images for
const pages = [
  { title: 'Sanatana Dharma', subtitle: 'Eternal Wisdom & Philosophy', file: 'home.png' },
  { title: 'About Sanatana Dharma', subtitle: 'Understanding Eternal Truth', file: 'about.png' },
  { title: 'Contact Us', subtitle: 'Get in Touch', file: 'contact.png' },
  { title: 'Donate', subtitle: 'Support Our Mission', file: 'donate.png', options: { bgColor: '#28A745' } },
  { title: 'Bhagavad Gita', subtitle: 'Sacred Scripture', file: 'bhagavathgita.png', options: { bgColor: '#6A4C93' } },
  { title: 'Hindu Philosophy', subtitle: 'Ancient Wisdom Traditions', file: 'philosophy.png', options: { bgColor: '#C9184A' } },
  { title: 'Vedas', subtitle: 'Sacred Knowledge', file: 'vedas.png', options: { bgColor: '#FF6B35' } },
  { title: 'Puranas', subtitle: 'Ancient Stories', file: 'puranas.png', options: { bgColor: '#0077B6' } },
  { title: 'Ramayana', subtitle: 'Epic of Lord Rama', file: 'ramayana.png', options: { bgColor: '#DC2F02' } },
  { title: 'Practices & Rituals', subtitle: 'Daily Worship & Traditions', file: 'practices.png', options: { bgColor: '#F77F00' } },
  { title: 'Stories & Scriptures', subtitle: 'Timeless Tales', file: 'stories.png', options: { bgColor: '#06AED5' } },
  { title: 'Kids Zone', subtitle: 'Learn Hindu Traditions', file: 'kidszone.png', options: { bgColor: '#FF006E' } },
  { title: 'Horoscope', subtitle: 'Vedic Astrology', file: 'horoscope.png', options: { bgColor: '#8338EC' } },
  { title: 'Cosmic Time', subtitle: 'Yugas & Time Cycles', file: 'cosmictime.png', options: { bgColor: '#3A86FF' } },
  { title: 'Stotras & Mantras', subtitle: 'Sacred Chants', file: 'stotras.png', options: { bgColor: '#FB5607' } },
];

// Main execution
(async () => {
  console.log('🎨 Generating OG Images...\n');
  ensureDir(OUTPUT_DIR);

  let successCount = 0;
  let failCount = 0;

  for (const page of pages) {
    try {
      await generateOGImage(page.title, page.subtitle, page.file, page.options || {});
      successCount++;
    } catch (err) {
      console.error(`Failed to generate ${page.file}:`, err.message);
      failCount++;
    }
  }

  console.log(`\n✅ Successfully generated ${successCount} OG images`);
  if (failCount > 0) {
    console.log(`❌ Failed to generate ${failCount} OG images`);
  }
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
})();
