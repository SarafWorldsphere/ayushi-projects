import { NextResponse } from 'next/server';
import postgres from 'postgres';

export const dynamic = 'force-dynamic';

const sql = postgres(process.env.DATABASE_URL, { 
  ssl: 'require'
});

const validateEmail = (email) => {
  if (!email || email.trim() === '') return null;
  const trimmedEmail = email.trim().toLowerCase();
  if (trimmedEmail.endsWith('@gmail.com')) {
    return trimmedEmail;
  }
  return null;
};

export async function GET(request) {
  try {
    const teachers = await sql`
      SELECT 
        teacher_id as id,
        full_name as name,
        subject_name as subject,
        NULL as qualification,       -- DB doesn't have this column
        class_id as classId,
        section_1 as section1,         -- Mapped to the only section column
        NULL as section2,            -- DB doesn't have this column
        role as role,
        phone as contact,        -- Mapped to mobile_no
        email_id as email,
        '' as isClassTeacher,        -- DB doesn't have this column
        NULL as subjects,            -- DB doesn't have this column
        CASE WHEN is_active = true THEN 'active' ELSE 'inactive' END as status
      FROM dem_teacher_master
      ORDER BY teacher_id DESC
      LIMIT 100
    `;
    
    return NextResponse.json({ success: true, teachers: teachers });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      name, subject, qualification, classId, section1, section2, 
      role, contact, email, isClassTeacher, subjects, status
    } = body;
    
    const isActive = status === 'active';
    const validEmail = validateEmail(email);
    
    const result = await sql`
      INSERT INTO dem_teacher_master (
        full_name,
        subject_name,
        class_id,
        section_1,
        role,
        phone,
        email_id,
        created_at,
        is_active
      )
      VALUES (
        ${name}, 
        ${subject || null},
        ${classId || null},
        ${section1 || null},
        ${role || 'TEACHER'},
        ${contact || null}, 
        ${validEmail},
        NOW(),
        ${isActive}
      )
      RETURNING teacher_id as id
    `;
    
    return NextResponse.json({ success: true, message: 'Teacher added successfully', teacher: result[0] });
  } catch (error) {
    console.error('Error inserting teacher:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
