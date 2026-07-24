import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// NOTE: Make sure to import your actual database connection utility here!
// Example: import { query } from '@/lib/db'; 

// 1. Initialize the S3 Client using your .env variables
const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// Helper function to process the file buffer and upload to S3
async function uploadToS3(file: File, folderName: string): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const buffer = Buffer.from(await file.arrayBuffer());
  const uniqueFileName = `${folderName}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: uniqueFileName,
    Body: buffer,
    ContentType: file.type,
  });

  await s3Client.send(command);

  // Return the public S3 URL so we can save it in the database
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;
}

export async function POST(request: Request) {
  try {
    // 2. Parse the incoming multipart/form-data
    const formData = await request.formData();

    // Extract text fields
    const fatherName = formData.get('fatherName') as string;
    const fatherPhone = formData.get('fatherPhone') as string;
    const fatherEmail = formData.get('fatherEmail') as string;
    
    const motherName = formData.get('motherName') as string;
    const motherPhone = formData.get('motherPhone') as string;
    const motherEmail = formData.get('motherEmail') as string;

    // 3. Extract the image files
    const fatherPhotoFile = formData.get('fatherPhoto') as File | null;
    const motherPhotoFile = formData.get('motherPhoto') as File | null;

    // 4. Upload files to S3 and get their URLs
    const fatherPhotoUrl = fatherPhotoFile ? await uploadToS3(fatherPhotoFile, 'parents/fathers') : null;
    const motherPhotoUrl = motherPhotoFile ? await uploadToS3(motherPhotoFile, 'parents/mothers') : null;

    // 5. Save to your PostgreSQL database (dem_student_master)
    /* 
      REPLACE THIS BLOCK WITH YOUR ACTUAL DB INSERT LOGIC. 
      Example using a raw SQL query:
      
      const sql = `
        INSERT INTO dem_student_master (
          "fatherName", "fatherPhone", "fatherEmail", "fatherPhoto",
          "motherName", "motherPhone", "motherEmail", "motherPhoto"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
      `;
      
      const values = [
        fatherName, fatherPhone, fatherEmail, fatherPhotoUrl,
        motherName, motherPhone, motherEmail, motherPhotoUrl
      ];
      
      await query(sql, values);
    */

    return NextResponse.json(
      { success: true, message: 'Student and parent data saved successfully' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error processing student data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save data or upload images' },
      { status: 500 }
    );
  }
}
