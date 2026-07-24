import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// Import your DB connection here

const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

async function uploadToS3(file: File, folderName: string): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const buffer = Buffer.from(await file.arrayBuffer());
  const uniqueFileName = `${folderName}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: uniqueFileName,
    Body: buffer,
    ContentType: file.type,
  }));

  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const formData = await request.formData();
    
    // Extract Image Files
    const fatherPhotoFile = formData.get('fatherPhoto') as File | null;
    const motherPhotoFile = formData.get('motherPhoto') as File | null;

    // Upload new files to S3 if they exist
    const fatherPhotoUrl = fatherPhotoFile ? await uploadToS3(fatherPhotoFile, 'parents/fathers') : null;
    const motherPhotoUrl = motherPhotoFile ? await uploadToS3(motherPhotoFile, 'parents/mothers') : null;

    // TODO: ADD YOUR DATABASE UPDATE LOGIC HERE using the 'id' and 'formData'

    return NextResponse.json({ success: true, message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ success: false, error: 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    // TODO: ADD YOUR DATABASE DELETE LOGIC HERE using 'id'
    
    return NextResponse.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete student' }, { status: 500 });
  }
}
