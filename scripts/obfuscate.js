const fs = require('fs');
const path = require('path');

// HTML 암호화 함수
function obfuscateHTML(html) {
  // 기본적인 HTML 암호화 (실제 프로덕션에서는 더 강력한 암호화 사용)
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

// JavaScript 코드 암호화
function obfuscateJS(js) {
  // 간단한 Base64 인코딩 (실제 프로덕션에서는 더 강력한 암호화 사용)
  return Buffer.from(js).toString('base64');
}

// CSS 암호화
function obfuscateCSS(css) {
  // CSS 압축 및 암호화
  return css
    .replace(/\s+/g, ' ')
    .replace(/;\s*/g, ';')
    .replace(/{\s*/g, '{')
    .replace(/}\s*/g, '}')
    .trim();
}

// 빌드 디렉토리 생성
const buildDir = path.join(__dirname, '../build');
const obfuscatedDir = path.join(__dirname, '../build-obfuscated');

if (!fs.existsSync(obfuscatedDir)) {
  fs.mkdirSync(obfuscatedDir, { recursive: true });
}

// HTML 파일 처리
const htmlFiles = ['index.html'];
htmlFiles.forEach(file => {
  const sourcePath = path.join(buildDir, file);
  const targetPath = path.join(obfuscatedDir, file);
  
  if (fs.existsSync(sourcePath)) {
    let content = fs.readFileSync(sourcePath, 'utf8');
    
    // HTML 암호화
    content = obfuscateHTML(content);
    
    // 암호화된 HTML을 JavaScript로 래핑
    const obfuscatedHTML = `
(function() {
  const html = '${content}';
  const decoded = html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\\\\n/g, '\\n')
    .replace(/\\\\r/g, '\\r')
    .replace(/\\\\t/g, '\\t');
  document.write(decoded);
})();
`;
    
    fs.writeFileSync(targetPath, obfuscatedHTML);
    console.log(`Obfuscated ${file}`);
  }
});

// 정적 파일 복사
const staticFiles = ['manifest.json', 'favicon.ico'];
staticFiles.forEach(file => {
  const sourcePath = path.join(buildDir, file);
  const targetPath = path.join(obfuscatedDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied ${file}`);
  }
});

// images 폴더 복사
const imagesDir = path.join(buildDir, 'images');
const targetImagesDir = path.join(obfuscatedDir, 'images');

if (fs.existsSync(imagesDir)) {
  if (!fs.existsSync(targetImagesDir)) {
    fs.mkdirSync(targetImagesDir, { recursive: true });
  }
  
  const files = fs.readdirSync(imagesDir);
  files.forEach(file => {
    const sourcePath = path.join(imagesDir, file);
    const targetPath = path.join(targetImagesDir, file);
    fs.copyFileSync(sourcePath, targetPath);
  });
  console.log('Copied images directory');
}

console.log('HTML obfuscation completed!');
