# AWS EC2 서버 설정 단계별 가이드

## 5단계: 서버 환경 설정 (SSH 접속 후)

### 5-1. 시스템 업데이트
```bash
# EC2 서버에 SSH 접속한 상태에서
sudo apt update && sudo apt upgrade -y
```

### 5-2. Java 17 설치
```bash
sudo apt install -y openjdk-17-jdk

# 설치 확인
java -version
# 출력: openjdk version "17.0.x" 2023-xx-xx
```

### 5-3. MySQL 설치
```bash
sudo apt install -y mysql-server

# MySQL 보안 설정
sudo mysql_secure_installation

# 설정값:
# - root 비밀번호 설정: Y → 강력한 비밀번호 입력
# - 익명 사용자 제거: Y
# - 원격 root 로그인 금지: Y  
# - test 데이터베이스 제거: Y
# - 권한 테이블 다시 로드: Y
```

### 5-4. 데이터베이스 설정
```bash
# MySQL 접속
sudo mysql -u root -p
# 위에서 설정한 root 비밀번호 입력

# 데이터베이스 생성
CREATE DATABASE nallijaku_prod_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 사용자 생성 및 권한 부여
CREATE USER 'nallijaku_prod_user'@'localhost' IDENTIFIED BY 'super-secure-password-123!@#';
GRANT ALL PRIVILEGES ON nallijaku_prod_db.* TO 'nallijaku_prod_user'@'localhost';
FLUSH PRIVILEGES;

# 종료
EXIT;
```

### 5-5. 애플리케이션 디렉토리 생성
```bash
# 디렉토리 생성
sudo mkdir -p /opt/nallijaku
sudo mkdir -p /opt/nallijaku/backup
sudo mkdir -p /var/log/nallijaku

# 사용자 생성
sudo useradd -r -s /bin/false nallijaku

# 권한 설정
sudo chown -R nallijaku:nallijaku /opt/nallijaku
sudo chown -R nallijaku:nallijaku /var/log/nallijaku
```

### 5-6. 환경 변수 파일 생성
```bash
# 환경 변수 파일 생성
sudo nano /opt/nallijaku/app.env

# 아래 내용 입력 (실제 값으로 변경)
SPRING_PROFILES_ACTIVE=prod
PROD_DATABASE_URL=jdbc:mysql://localhost:3306/nallijaku_prod_db?useSSL=true&serverTimezone=Asia/Seoul&characterEncoding=UTF-8
PROD_DATABASE_USERNAME=nallijaku_prod_user
PROD_DATABASE_PASSWORD=super-secure-password-123!@#
JWT_SECRET=nallijaku-super-secure-jwt-secret-key-32chars-minimum-length
EMAIL_USERNAME=your-gmail@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
FILE_UPLOAD_DIR=/opt/nallijaku/uploads

# Ctrl+X → Y → Enter로 저장
```

### 5-7. 방화벽 설정
```bash
sudo ufw allow ssh
sudo ufw allow 8080/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# 상태 확인
sudo ufw status
```

### 5-8. Nginx 설치
```bash
sudo apt install -y nginx

# Nginx 시작
sudo systemctl start nginx
sudo systemctl enable nginx

# 브라우저에서 http://EC2-IP 접속하여 Nginx 기본 페이지 확인
```

## 6단계: 애플리케이션 배포

### 6-1. 로컬에서 JAR 파일 빌드
```bash
# 로컬 PC에서 (nallijaku/backend 폴더에서)
.\mvnw.cmd clean package -DskipTests

# target/nallijaku-backend-0.0.1-SNAPSHOT.jar 파일 생성됨
```

### 6-2. JAR 파일을 EC2로 업로드
```bash
# 로컬 PC에서 (PowerShell)
scp -i C:\Users\82105\.ssh\nallijaku-key.pem target\nallijaku-backend-0.0.1-SNAPSHOT.jar ubuntu@13.124.123.45:/tmp/

# EC2 서버에서
sudo mv /tmp/nallijaku-backend-0.0.1-SNAPSHOT.jar /opt/nallijaku/app.jar
sudo chown nallijaku:nallijaku /opt/nallijaku/app.jar
```

### 6-3. systemd 서비스 생성
```bash
# EC2 서버에서
sudo nano /etc/systemd/system/nallijaku.service

# 아래 내용 입력:
[Unit]
Description=Nallijaku Backend Application
After=network.target mysql.service

[Service]
Type=simple
User=nallijaku
Group=nallijaku
ExecStart=/usr/bin/java -jar -Dspring.profiles.active=prod -Xms512m -Xmx1024m /opt/nallijaku/app.jar
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
EnvironmentFile=/opt/nallijaku/app.env

[Install]
WantedBy=multi-user.target

# Ctrl+X → Y → Enter로 저장
```

### 6-4. 서비스 시작
```bash
sudo systemctl daemon-reload
sudo systemctl enable nallijaku
sudo systemctl start nallijaku

# 상태 확인
sudo systemctl status nallijaku

# 로그 확인
sudo journalctl -u nallijaku -f
```

### 6-5. 테스트
```bash
# 브라우저에서 접속
http://EC2-IP:8080/api/health

# 또는 curl로 테스트
curl http://localhost:8080/api/health
```

## 7단계: SSL 인증서 설정 (Let's Encrypt)

### 7-1. Certbot 설치
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 7-2. Nginx 설정
```bash
sudo nano /etc/nginx/sites-available/nallijaku

# 기본 HTTP 설정 먼저 입력:
server {
    listen 80;
    server_name api.nallijaku.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# 저장 후
sudo ln -s /etc/nginx/sites-available/nallijaku /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7-3. SSL 인증서 발급
```bash
sudo certbot --nginx -d api.nallijaku.com

# 이메일 입력 → 약관 동의 → 마케팅 이메일 거부/동의
# 성공하면 자동으로 HTTPS 설정됨
```

### 7-4. 최종 테스트
```bash
# 브라우저에서
https://api.nallijaku.com/api/health
```

## 완료! 🎉

이제 https://api.nallijaku.com/api 로 백엔드가 운영됩니다.
프론트엔드에서 이 주소로 API 호출하면 됩니다.
