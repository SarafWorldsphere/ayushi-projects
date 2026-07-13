from database import SessionLocal
from models import ParentMaster, StudentMaster, ParentStudentMap

def force_fix():
    db = SessionLocal()
    try:
        # 1. Force ensure Parent ID 1 exists
        p1 = db.query(ParentMaster).filter(ParentMaster.parent_id == 1).first()
        if not p1:
            print("Parent ID 1 missing. Creating Priya Sharma as ID 1...")
            p1 = ParentMaster(
                parent_id=1, 
                full_name="Priya Sharma", 
                email="priya@example.com", 
                phone="9999999999"
            )
            db.add(p1)
            db.commit()
            db.refresh(p1)
        else:
            print(f"Parent ID 1 already exists: {p1.full_name}")

        # 2. Grab all generated students
        students = db.query(StudentMaster).all()
        if not students:
            print("❌ No students found in the database! Please run mock_data.py first.")
            return

        # 3. Force link every single student to Parent 1
        linked_count = 0
        for student in students:
            existing_link = db.query(ParentStudentMap).filter_by(
                parent_id=1, 
                student_id=student.student_id
            ).first()

            if not existing_link:
                new_link = ParentStudentMap(
                    parent_id=1, 
                    student_id=student.student_id, 
                    relationship_type="Mother"
                )
                db.add(new_link)
                linked_count += 1

        db.commit()
        print(f"✅ SUCCESS! Parent ID 1 is now permanently linked to {linked_count} students.")
        print("Go refresh your frontend dashboard!")

    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    force_fix()