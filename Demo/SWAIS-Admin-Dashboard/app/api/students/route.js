import { NextResponse } from 'next/server';
import postgres from 'postgres';

export const dynamic = 'force-dynamic';

// Connect to the database using the URL from your .env file
const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require'
});

// Email validation helper
const validateEmail = (email) => {
  if (!email || email.trim() === '') return null;
  const trimmedEmail = email.trim().toLowerCase();
  if (trimmedEmail.endsWith('@gmail.com')) {
    return trimmedEmail;
  }
  return null;
};

// GET Route: Fetch students for the dashboard table
export async function GET(request) {
  try {
    const students = await sql`
      SELECT
        student_id as "id",
        admission_no as "admissionNo",
        full_name as "name",
        class_id as "class",
        section as "section",
        roll_no as "rollNo",
        parent_name as "fatherName",
        mobile_no as "fatherPhone",
        email_id as "parentEmail",
        mobile_no as "contact",
        email_id as "email",
        father_photo_url as "fatherPhoto",
        mother_photo_url as "motherPhoto",
        NULL as "motherName",
        NULL as "motherPhone",
        NULL as "guardianName",
        NULL as "guardianPhone",
        CASE WHEN record_status = 'Active' THEN 'active' ELSE 'inactive' END as "status"
      FROM dem_student_master
      WHERE record_status = 'Active' OR record_status IS NULL
      ORDER BY student_id DESC
      LIMIT 100
    `;

    console.log('Returning', students.length, 'students');
    return NextResponse.json({ success: true, students: students });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST Route: Add a new student from the dashboard
export async function POST(request) {
  try {
    const formData = await request.formData();

    const admissionNo = formData.get('admissionNo');
    const name = formData.get('name');
    const className = formData.get('class');
    const section = formData.get('section');
    const rollNo = formData.get('rollNo');
    const parentName = formData.get('parentName');
    const parentPhone = formData.get('parentPhone');
    const parentEmail = formData.get('parentEmail');
    const contact = formData.get('contact');
    const email = formData.get('email');
    const status = formData.get('status');

    // Extract the string URLs sent directly from the frontend
    const fatherPhotoUrl = formData.get('fatherPhoto');
    const motherPhotoUrl = formData.get('motherPhoto');

    const isActive = status === 'active';

    // Since the database only has one email and phone column, we prioritize the student's,
    // and fall back to the parent's if the student's is missing.
    const finalEmail = validateEmail(email) || validateEmail(parentEmail);
    const finalPhone = contact || parentPhone || null;

    const result = await sql`
      INSERT INTO dem_student_master (
        admission_no,
        full_name,
        class_id,
        section,
        roll_no,
        parent_name,
        mobile_no,
        email_id,
        created_datetime,
        record_status,
        father_photo_url,
        mother_photo_url
      )
      VALUES (
        ${admissionNo || null},
        ${name},
        ${className || null},
        ${section || null},
        ${rollNo || null},
        ${parentName || null},
        ${finalPhone},
        ${finalEmail},
        NOW(),
        ${isActive ? 'Active' : 'Inactive'},
        ${fatherPhotoUrl || null},
        ${motherPhotoUrl || null}
      )
      RETURNING student_id as id
    `;

    return NextResponse.json({ success: true, message: 'Student added successfully', student: result[0] });
  } catch (error) {
    console.error('Error inserting student:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
