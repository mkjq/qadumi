import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const filename = `uploads/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    // If R2 env vars are present, upload to Cloudflare R2
    if (process.env.CF_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID) {
      const bucketName = process.env.R2_BUCKET_NAME || 'qadumi-assets';
      
      await s3Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
      }));

      // Return the public URL for the R2 bucket (must be configured in Cloudflare)
      const publicDomain = process.env.R2_PUBLIC_DOMAIN;
      return NextResponse.json({
        url: `${publicDomain}/${filename}`,
        filename,
      });
    }

    // Fallback to local filesystem for development
    const fs = await import('fs/promises');
    const path = await import('path');
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    
    const localFilename = filename.replace('uploads/', '');
    const filepath = path.join(uploadDir, localFilename);
    await fs.writeFile(filepath, buffer);

    return NextResponse.json({
      url: `/images/uploads/${localFilename}`,
      filename: localFilename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
