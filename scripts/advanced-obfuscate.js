const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 고급 암호화 함수
function advancedObfuscate(content, key = 'ctm-secret-key-2024') {
  // 키를 32바이트로 변환 (AES-256용)
  const keyBuffer = crypto.createHash('sha256').update(key).digest();
  const iv = crypto.randomBytes(16);
  
  // AES 암호화
  const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
  let encrypted = cipher.update(content, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // IV와 암호화된 데이터를 결합
  const combined = iv.toString('hex') + ':' + encrypted;
  
  // Base64 인코딩
  const encoded = Buffer.from(combined).toString('base64');
  
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
      
      // Base64 디코딩
      const decoded = Buffer.from(deobfuscated, 'base64').toString('utf8');
      
      // IV와 암호화된 데이터 분리
      const [ivHex, encryptedData] = decoded.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      
      // 키를 32바이트로 변환 (AES-256용)
      const keyBuffer = require('crypto').createHash('sha256').update(key).digest();
      
      // AES 복호화
      const decipher = require('crypto').createDecipheriv('aes-256-cbc', keyBuffer, iv);
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
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
