# Rich Menu Design Guide

## Layout

The Rich Menu has 4 buttons in a 2x2 grid:

```
┌─────────────────┬─────────────────┐
│                 │                 │
│  🩺 เช็คสุขภาพ   │  💊 บันทึกกินยา  │
│                 │                 │
├─────────────────┼─────────────────┤
│                 │                 │
│  👤 โปรไฟล์      │  ℹ️ ช่วยเหลือ    │
│                 │                 │
└─────────────────┴─────────────────┘
```

## Specifications

- **Canvas Size**: 2500 x 1686 pixels
- **Format**: PNG or JPEG
- **Max File Size**: 1 MB
- **Grid**: 2 columns x 2 rows

## Button Actions

| Button | Text | Action Type | Action |
|--------|------|-------------|--------|
| Top Left | เช็คสุขภาพ | Message | Sends "เช็คสุขภาพ" |
| Top Right | บันทึกกินยา | Message | Sends "บันทึกกินยา" |
| Bottom Left | โปรไฟล์ของฉัน | Message | Sends "โปรไฟล์ของฉัน" |
| Bottom Right | ช่วยเหลือ | URI | Opens LINE Official Account |

## Design Tips

1. **Use Hanna's Brand Colors**:
   - Primary: #06C755 (LINE Green)
   - Secondary: #1DB446 (Success Green)
   - Background: #FFFFFF or #F5F5F5

2. **Icons**: Use clear, simple icons for each button
   - Health Check: 🩺 or stethoscope icon
   - Medication: 💊 or pill icon
   - Profile: 👤 or user icon
   - Help: ℹ️ or question mark icon

3. **Typography**: Use readable Thai fonts
   - Noto Sans Thai
   - Kanit
   - Prompt

## Creating the Image

### Option 1: Figma (Recommended)
1. Create new frame: 2500 x 1686 px
2. Add grid: 2 columns, 2 rows
3. Design each button area
4. Export as PNG

### Option 2: Canva
1. Use custom dimensions: 2500 x 1686 px
2. Add elements and text
3. Download as PNG

### Option 3: Use LINE's Rich Menu Generator
https://developers.line.biz/console/

## Upload Steps

1. Run the setup script:
   ```bash
   node scripts/setupRichMenu.js
   ```

2. Copy the Rich Menu ID from the output

3. Go to LINE Developers Console:
   https://developers.line.biz/console/channel/YOUR_CHANNEL_ID/messaging-api

4. Navigate to Rich Menu > Upload image

5. Select your 2500x1686 image and upload

6. The Rich Menu will now appear for all users!

## Testing

1. Open LINE app on your phone
2. Go to Hanna's chat
3. Look at the bottom - you should see the menu bar
4. Tap each button to test functionality
