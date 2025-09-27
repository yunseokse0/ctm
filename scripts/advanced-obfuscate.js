const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 고급 암호화 함수
function advancedObfuscate(content, key = 'ctm-secret-key-2024') {
  // 간단한 XOR 암호화 (브라우저 호환)
  let encrypted = '';
  const keyBytes = Buffer.from(key, 'utf8');
  for (let i = 0; i < content.length; i++) {
    const charCode = content.charCodeAt(i) ^ keyBytes[i % keyBytes.length];
    encrypted += String.fromCharCode(charCode);
  }
  
  // Base64 인코딩
  const encoded = Buffer.from(encrypted, 'utf8').toString('base64');
  
  // 추가 난독화
  const obfuscated = encoded
    .split('')
    .map((char, index) => {
      const code = char.charCodeAt(0);
      return String.fromCharCode(code + (index % 3));
    })
    .join('');
    
  return obfuscated;
}

// 복호화 함수 (클라이언트에서 사용)
function generateDecryptor() {
  return `
(function() {
  // 간단한 브라우저 호환 암호화 해제
  function decrypt(encrypted, key = 'ctm-secret-key-2024') {
    try {
      // 역난독화
      const deobfuscated = encrypted
        .split('')
        .map((char, index) => {
          const code = char.charCodeAt(0);
          return String.fromCharCode(code - (index % 3));
        })
        .join('');
      
      // Base64 디코딩 (브라우저 호환)
      const decoded = atob(deobfuscated);
      
      // 간단한 XOR 복호화 (브라우저 호환)
      let decrypted = '';
      const keyBytes = new TextEncoder().encode(key);
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ keyBytes[i % keyBytes.length];
        decrypted += String.fromCharCode(charCode);
      }
      
      return decrypted;
    } catch (e) {
      console.error('Decryption failed:', e);
      return encrypted;
    }
  }
  
  // HTML 로드
  const encryptedHTML = 'ENCRYPTED_HTML_PLACEHOLDER';
  const decryptedHTML = decrypt(encryptedHTML);
  document.write(decryptedHTML);
})();
`;
}

// 빌드 디렉토리 생성
const buildDir = path.join(__dirname, '../build');
const obfuscatedDir = path.join(__dirname, '../build-secure');

if (!fs.existsSync(obfuscatedDir)) {
  fs.mkdirSync(obfuscatedDir, { recursive: true });
}

// HTML 파일 암호화
const htmlFiles = ['index.html'];
htmlFiles.forEach(file => {
  const sourcePath = path.join(buildDir, file);
  const targetPath = path.join(obfuscatedDir, file);
  
  if (fs.existsSync(sourcePath)) {
    const content = fs.readFileSync(sourcePath, 'utf8');
    const encrypted = advancedObfuscate(content);
    
    // 암호화된 HTML을 JavaScript로 래핑
    const decryptor = generateDecryptor().replace('ENCRYPTED_HTML_PLACEHOLDER', encrypted);
    
    fs.writeFileSync(targetPath, decryptor);
    console.log(`Advanced obfuscated ${file}`);
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

console.log('Advanced HTML obfuscation completed!');
