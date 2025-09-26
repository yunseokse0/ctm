# CTM Deployment Guide

## 🚀 Production Build Options

### 1. Standard Build
```bash
npm run build
```
- Output: `build/` directory
- Standard React build with minification

### 2. Obfuscated Build
```bash
npm run build:obfuscated
```
- Output: `build-obfuscated/` directory
- Basic HTML obfuscation
- Suitable for basic protection

### 3. Secure Build (Recommended)
```bash
npm run build:secure
```
- Output: `build-secure/` directory
- Advanced AES encryption
- HTML content obfuscated
- Maximum security for production

## 🌐 Deployment Platforms

### GitHub Pages
1. Build the project: `npm run build:secure`
2. Copy contents of `build-secure/` to your repository
3. Enable GitHub Pages in repository settings

### Netlify
1. Connect your repository
2. Build command: `npm run build:secure`
3. Publish directory: `build-secure`

### Vercel
1. Import your repository
2. Build command: `npm run build:secure`
3. Output directory: `build-secure`

## 🔒 Security Features

- **HTML Obfuscation**: Source code protection
- **AES Encryption**: Advanced content encryption
- **Minification**: Code size optimization
- **No Source Maps**: Prevents reverse engineering

## 📁 File Structure

```
build-secure/
├── index.html          # Encrypted HTML
├── manifest.json       # PWA manifest
├── favicon.ico         # Site icon
└── images/             # Static assets
    ├── icon_war_red.svg
    ├── icon_conflict_orange.svg
    ├── icon_disorder_yellow.svg
    └── qr_code_usdt_trc20.svg
```

## ⚠️ Important Notes

- The encrypted build requires JavaScript to be enabled
- Source code is protected but not 100% secure
- For maximum security, consider server-side rendering
- Test the encrypted build before deployment

## 🔧 Customization

To change encryption key, edit `scripts/advanced-obfuscate.js`:
```javascript
const key = 'your-custom-secret-key';
```
