from database import SessionLocal
from models import ParentMaster, StudentMaster, ParentStudentMap

def force_link_students():
    db = SessionLocal()
    try:
        # Grab the first parent it can find
        parent = db.query(ParentMaster).first()
        # Grab all students
        students = db.query(StudentMaster).all()

        if not parent:
            print("❌ No parents found in the database!")
            return
        if not students:
            print("❌ No students found in the database!")
            return

        linked_count = 0
        for student in students:
            # Check if they are already linked
            existing_link = db.query(ParentStudentMap).filter_by(
                parent_id=parent.parent_id, 
                student_id=student.student_id
            ).first()

            if not existing_link:
                new_link = ParentStudentMap(
                    parent_id=parent.parent_id,
                    student_id=student.student_id,
                    relationship_type="Parent"
                )
                db.add(new_link)
                linked_count += 1
        
        db.commit()
        print(f"✅ BOOM! Successfully linked {linked_count} students to Parent: {parent.full_name} (ID: {parent.parent_id})")
        print("Go refresh your browser!")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    force_link_students()