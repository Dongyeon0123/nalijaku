#!/bin/bash

# AWS EC2 서버 초기 설정 스크립트 (Ubuntu 22.04 기준)

set -e

echo "======================================="
echo "AWS EC2 서버 초기 설정 시작"
echo "======================================="

# 1. 시스템 업데이트
echo "1. 시스템 업데이트 중..."
sudo apt update && sudo apt upgrade -y

# 2. Java 17 설치
echo "2. OpenJDK 17 설치 중..."
sudo apt install -y openjdk-17-jdk

# 3. MySQL 8.0 설치
echo "3. MySQL 8.0 설치 중..."
sudo apt install -y mysql-server

# 4. MySQL 보안 설정
echo "4. MySQL 보안 설정..."
sudo mysql_secure_installation

# 5. 애플리케이션 디렉토리 생성
echo "5. 애플리케이션 디렉토리 생성 중..."
sudo mkdir -p /opt/nallijaku
sudo mkdir -p /opt/nallijaku/backup
sudo mkdir -p /var/log/nallijaku

# 6. 사용자 생성 및 권한 설정
echo "6. nallijaku 사용자 생성 중..."
sudo useradd -r -s /bin/false nallijaku || true
sudo chown -R nallijaku:nallijaku /opt/nallijaku
sudo chown -R nallijaku:nallijaku /var/log/nallijaku

# 7. 방화벽 설정
echo "7. 방화벽 설정 중..."
sudo ufw allow ssh
sudo ufw allow 8080/tcp
sudo ufw allow 443/tcp
sudo ufw allow 80/tcp
sudo ufw --force enable

# 8. Nginx 설치 (리버스 프록시용)
echo "8. Nginx 설치 중..."
sudo apt install -y nginx

# 9. systemd 서비스 파일 생성
echo "9. systemd 서비스 파일 생성 중..."
sudo tee /etc/systemd/system/nallijaku.service > /dev/null <<EOF
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

# 환경 변수 (실제 값은 환경 파일에서 설정)
Environment=SPRING_PROFILES_ACTIVE=prod
EnvironmentFile=-/opt/nallijaku/app.env

[Install]
WantedBy=multi-user.target
EOF

# 10. systemd 서비스 활성화
sudo systemctl daemon-reload
sudo systemctl enable nallijaku

echo "======================================="
echo "EC2 초기 설정 완료!"
echo "======================================="
echo ""
echo "다음 단계:"
echo "1. MySQL 데이터베이스 생성"
echo "2. 환경 변수 파일 생성: /opt/nallijaku/app.env"
echo "3. 애플리케이션 JAR 파일 업로드"
echo "4. 서비스 시작: sudo systemctl start nallijaku"
echo ""
