import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { success: false, message: '파일이 없습니다.' },
                { status: 400 }
            );
        }

        // 파일 타입 검증
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { success: false, message: '이미지 파일만 업로드 가능합니다.' },
                { status: 400 }
            );
        }

        // 파일 크기 검증 (10MB 이하)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { success: false, message: '파일 크기는 10MB 이하여야 합니다.' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 업로드 디렉토리 설정
        const uploadDir = join(process.cwd(), 'public', 'uploads');

        // 디렉토리가 없으면 생성
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // 파일명 생성 (타임스탐프 + 랜덤)
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const ext = file.name.split('.').pop();
        const filename = `${timestamp}-${random}.${ext}`;

        // 파일 저장
        const filepath = join(uploadDir, filename);
        await writeFile(filepath, buffer);

        // 공개 URL 반환
        const url = `/uploads/${filename}`;

        return NextResponse.json(
            {
                success: true,
                message: '이미지가 업로드되었습니다.',
                url: url,
                data: { url: url },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('이미지 업로드 오류:', error);
        return NextResponse.json(
            { success: false, message: '이미지 업로드 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
