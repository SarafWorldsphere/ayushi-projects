import { NextResponse } from 'next/server';
import postgres from 'postgres';

export const dynamic = 'force-dynamic';

const sql = postgres(process.env.DATABASE_URL, { 
  ssl: 'require' 
});

export async function GET(request) {
  try {
    const classes = await sql`
      SELECT 
        class_id as id,
        class_name as className,
        section_name as section,
        academic_year as year,
        CASE WHEN record_status = 'Active' THEN 'active' ELSE 'inactive' END as status
      FROM dem_class_master
      WHERE record_status = 'Active' OR record_status IS NULL
      ORDER BY class_id DESC
      LIMIT 100
    `;
    
    return NextResponse.json({ success: true, classes: classes });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { className, section, year, status } = body;
    
    const isActive = status === 'active';
    
    const result = await sql`
      INSERT INTO dem_class_master (
        school_id, 
        class_name, 
        section_name, 
        academic_year, 
        created_datetime, 
        record_status
      )
      VALUES (
        1, -- Defaulting to the DEM School ID you created in SQL
        ${className}, 
        ${section || null}, 
        ${year || null}, 
        NOW(), 
        ${isActive ? 'Active' : 'Inactive'}
      )
      RETURNING class_id as id
    `;
    
    return NextResponse.json({ success: true, message: 'Class added successfully', class: result[0] });
  } catch (error) {
    console.error('Error inserting class:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}