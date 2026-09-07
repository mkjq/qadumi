import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'materials');
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename preserving original extension
    const ext = file.name.split('.').pop();
    // sanitize filename to avoid issues
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_').split('.')[0].substring(0, 20);
    const filename = `${safeName}-${Date.now()}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({
      url: `/materials/${filename}`,
      filename,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
