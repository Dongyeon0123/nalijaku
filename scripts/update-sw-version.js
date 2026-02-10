#!/usr/bin/env node

/**
 * Service Worker 버전 자동 업데이트 스크립트
 * 배포 전에 실행하면 자동으로 버전을 올려줍니다.
 */

const fs = require('fs');
const path = require('path');

const SW_PATH = path.join(__dirname, '../public/sw.js');

try {
  // sw.js 파일 읽기
  let content = fs.readFileSync(SW_PATH, 'utf8');
  
  // 현재 버전 찾기
  const versionMatch = content.match(/CACHE_NAME = ['"]nallijaku-attendance-v(\d+)['"]/);
  
  if (!versionMatch) {
    console.error('❌ Service Worker 버전을 찾을 수 없습니다.');
    process.exit(1);
  }
  
  const currentVersion = parseInt(versionMatch[1]);
  const newVersion = currentVersion + 1;
  
  // 버전 업데이트
  content = content.replace(
    /CACHE_NAME = ['"]nallijaku-attendance-v\d+['"]/,
    `CACHE_NAME = 'nallijaku-attendance-v${newVersion}'`
  );
  
  // 파일 저장
  fs.writeFileSync(SW_PATH, content, 'utf8');
  
  console.log(`✅ Service Worker 버전 업데이트: v${currentVersion} → v${newVersion}`);
  console.log(`📝 파일: ${SW_PATH}`);
  
} catch (error) {
  console.error('❌ 에러 발생:', error.message);
  process.exit(1);
}
