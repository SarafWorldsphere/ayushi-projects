import { NextResponse } from 'next/server';
import postgres from 'postgres';

export const dynamic = 'force-dynamic';

const sql = postgres(process.env.DATABASE_URL, { 
  ssl: 'require' 
});

export async function GET(request) {
  try {
    const school = await sql`
      SELECT 
        school_id as id,
        school_name as name,
        address as address,
        city as city,
        state as state,
        pincode as pincode,
        contact_person as contactPerson,
        mobile_no as phone,
        email_id as email,
        CASE WHEN record_status = 'Active' THEN 'active' ELSE 'inactive' END as status
      FROM dem_school_master
      WHERE record_status = 'Active' OR record_status IS NULL
      LIMIT 1
    `;
    
    // Returning school[0] because there is usually only one main school profile
    return NextResponse.json({ success: true, school: school[0] });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, address, city, state, pincode, contactPerson, phone, email, status } = body;
    
    const isActive = status === 'active';
    
    const result = await sql`
      INSERT INTO dem_school_master (
        school_name, 
        address, 
        city, 
        state, 
        pincode, 
        contact_person, 
        mobile_no, 
        email_id, 
        created_datetime, 
        record_status
      )
      VALUES (
        ${name}, 
        ${address || null}, 
        ${city || null}, 
        ${state || null}, 
        ${pincode || null}, 
        ${contactPerson || null}, 
        ${phone || null}, 
        ${email || null}, 
        NOW(), 
        ${isActive ? 'Active' : 'Inactive'}
      )
      RETURNING school_id as id
    `;
    
    return NextResponse.json({ success: true, message: 'School added successfully', school: result[0] });
  } catch (error) {
    console.error('Error inserting school:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}