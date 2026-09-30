import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(request: NextRequest) {
  try {
    // 1. Read just the file name and type from the frontend
    const { fileName, fileType } = await request.json();

    if (!fileName || !fileType) {
      return NextResponse.json({ error: 'Missing file details' }, { status: 400 });
    }

    // 2. Create a unique key (path) for the file in S3
    const fileExtension = fileName.split('.').pop();
    const fileKey = `student-photos/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    // 3. Prepare the command for AWS
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      ContentType: fileType, 
    });

    // 4. Generate the Pre-Signed URL (Valid for 60 seconds)
    const preSignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    // 5. Send both the secure URL and the final key back to the frontend
    return NextResponse.json({ 
      uploadUrl: preSignedUrl, 
      fileKey: fileKey 
    });

  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 });
  }
}
