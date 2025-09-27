#!/bin/bash

# 날리자쿠 백엔드 AWS EC2 배포 스크립트

set -e  # 오류 발생 시 스크립트 중단

echo "======================================="
echo "날리자쿠 백엔드 AWS EC2 배포 시작"
echo "======================================="

# 환경 변수 확인
if [ -z "$SPRING_PROFILES_ACTIVE" ]; then
    echo "SPRING_PROFILES_ACTIVE 환경변수를 설정해주세요 (prod 또는 dev)"
    exit 1
fi

echo "배포 환경: $SPRING_PROFILES_ACTIVE"

# 1. 애플리케이션 빌드
echo "1. 애플리케이션 빌드 중..."
./mvnw clean package -DskipTests

# 2. 기존 프로세스 종료
echo "2. 기존 Spring Boot 프로세스 종료 중..."
pkill -f "nallijaku-backend" || true

# 3. 백업 디렉토리 생성
BACKUP_DIR="/opt/nallijaku/backup/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# 4. 기존 JAR 파일 백업 (있다면)
if [ -f "/opt/nallijaku/app.jar" ]; then
    echo "3. 기존 JAR 파일 백업 중..."
    cp /opt/nallijaku/app.jar $BACKUP_DIR/
fi

# 5. 새 JAR 파일 배포
echo "4. 새 JAR 파일 배포 중..."
cp target/*.jar /opt/nallijaku/app.jar

# 6. 로그 디렉토리 생성
mkdir -p /var/log/nallijaku

# 7. 애플리케이션 시작
echo "5. 애플리케이션 시작 중..."
nohup java -jar \
    -Dspring.profiles.active=$SPRING_PROFILES_ACTIVE \
    -Xms512m -Xmx1024m \
    /opt/nallijaku/app.jar \
    > /var/log/nallijaku/app.log 2>&1 &

# 8. 프로세스 시작 확인
sleep 5
if pgrep -f "nallijaku" > /dev/null; then
    echo "✅ 배포 완료! 애플리케이션이 정상적으로 시작되었습니다."
    echo "로그 확인: tail -f /var/log/nallijaku/app.log"
else
    echo "❌ 배포 실패! 애플리케이션 시작에 실패했습니다."
    echo "로그 확인: cat /var/log/nallijaku/app.log"
    exit 1
fi

echo "======================================="
echo "배포 완료"
echo "======================================="
