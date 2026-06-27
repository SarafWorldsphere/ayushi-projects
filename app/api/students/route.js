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
        student_id as id,
        admission_no as admissionNo,
        full_name as name,
        class_id as class,           -- Fixed column name
        section as section,
        roll_no as rollNo,
        parent_name as parentName,   -- Fixed column name
        mobile_no as parentPhone,    -- Fixed column name
        email_id as parentEmail,     -- Fixed column name
        mobile_no as contact,        -- Mapped to the only phone column available
        email_id as email,           -- Mapped to the only email column available
        NULL as guardianName,        -- Column does not exist in DB
        NULL as guardianPhone,       -- Column does not exist in DB
        CASE WHEN record_status = 'Active' THEN 'active' ELSE 'inactive' END as status
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
    const body = await request.json();
    const { 
      admissionNo, name, class: className, section, rollNo,
      parentName, parentPhone, parentEmail,
      contact, email, status
    } = body;
    
    const isActive = status === 'active';
    
    // Since the database only has one email and phone column, we prioritize the student's, 
    // and fall back to the parent's if the student's is missing.
    const finalEmail = validateEmail(email) || validateEmail(parentEmail);
    const finalPhone = contact || parentPhone || null;
    
    const result = await sql`
      INSERT INTO dem_student_master (
        admission_no,
        full_name,
        class_id,        -- Fixed column name
        section,
        roll_no,
        parent_name,     -- Fixed column name
        mobile_no,       -- Fixed column name
        email_id,        -- Fixed column name
        created_datetime,
        record_status    -- Database uses record_status instead of is_active
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
        ${isActive ? 'Active' : 'Inactive'} 
      )
      RETURNING student_id as id
    `;
    
    return NextResponse.json({ success: true, message: 'Student added successfully', student: result[0] });
  } catch (error) {
    console.error('Error inserting student:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}