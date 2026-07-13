"""
SQLAlchemy ORM models — Parent Dashboard

Alignment strategy
──────────────────
• __tablename__ uses explicit "dem_" prefix for all tables.

• Column aliasing:  attr = Column('rds_col_name', Type, …)
  Maps the physical RDS column name to the existing Python
  attribute name so backend routes, Pydantic schemas, service
  math and React JSON keys are all unchanged.

• BigInteger IDs promoted only where the RDS schema uses bigint.
  Integer stays where RDS explicitly keeps integer
  (parent_master, support_tickets PKs, ticket_messages PK).
"""

from sqlalchemy import (
    Column, Integer, BigInteger, String, Numeric,
    ForeignKey, TIMESTAMP, Date, Text, Boolean, DateTime,
)
from sqlalchemy.dialects.postgresql import ENUM as PgEnum
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


# ── 0. UsersMaster ───────────────────────────────────────────────────────────

class UsersMaster(Base):
    __tablename__ = "dem_users_master"

    # Matching the 17 columns currently in pgAdmin
    user_id = Column(BigInteger, primary_key=True, index=True)
    login_id = Column(String(100), nullable=True)
    password_hash = Column(Text, nullable=True)
    full_name = Column(String(150), nullable=False)
    
    # Python uses 'email', but maps to 'email_id' in PostgreSQL
    email = Column('email_id', String(150), nullable=True)
    
    mobile_no = Column(String(20), nullable=True)
    role_id = Column(BigInteger, nullable=True)
    school_id = Column(BigInteger, nullable=True)
    is_active = Column(Boolean, nullable=True)
    
    created_datetime = Column(TIMESTAMP, nullable=True)
    created_user_id = Column(String(50), nullable=True)
    created_ip_address = Column(String(50), nullable=True)
    modified_datetime = Column(TIMESTAMP, nullable=True)
    modified_user_id = Column(String(50), nullable=True)
    modified_ip_address = Column(String(50), nullable=True)
    record_status = Column(String(20), nullable=True)
    version_no = Column(Integer, nullable=True)


# ── 1. ClassMaster ────────────────────────────────────────────────────────────

class ClassMaster(Base):
    __tablename__ = "dem_class_master"

    class_id         = Column(BigInteger, primary_key=True, index=True)
    school_id        = Column(BigInteger, nullable=True)
    class_name       = Column(String, index=True)
    section_name     = Column(String)
    academic_year    = Column(String)
    class_teacher_id = Column(BigInteger, ForeignKey("dem_users_master.user_id"), nullable=True)
    
    created_datetime  = Column(TIMESTAMP, nullable=True)
    modified_datetime = Column(TIMESTAMP, nullable=True)
    record_status     = Column(String, nullable=True)
    version_no        = Column(Integer, nullable=True)


# ── 2. StudentMaster ──────────────────────────────────────────────────────────

class StudentMaster(Base):
    __tablename__ = "dem_student_master"

    student_id = Column(BigInteger, primary_key=True, index=True)
    admission_no = Column(String, nullable=True)

    full_name = Column("name", String)

    class_id = Column(
        BigInteger,
        ForeignKey("dem_class_master.class_id"),
        index=True
    )

    section = Column(String)
    roll_no = Column("roll_number", String)

    student_phone = Column(String, nullable=True)
    student_email = Column(String, nullable=True)

    guardian_name = Column(String, nullable=True)
    guardian_phone = Column(String, nullable=True)
    guardian_email = Column(String, nullable=True)

    is_active = Column(Boolean, nullable=True)

    created_at = Column(TIMESTAMP, nullable=True)
    updated_at = Column(TIMESTAMP, nullable=True)

    record_status = Column(String, nullable=True)
    version_no = Column(Integer, nullable=True)

    class_info = relationship("ClassMaster")


# ── 3. ParentMaster ───────────────────────────────────────────────────────────

class ParentMaster(Base):
    __tablename__ = "dem_parent_master"

    parent_id     = Column(Integer, primary_key=True, index=True)
    full_name     = Column(String)
    email         = Column(String, index=True)
    phone         = Column(String)
    profile_image = Column(String, nullable=True)
    created_at    = Column(DateTime, default=datetime.utcnow)
    updated_at    = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# ── 4. ParentStudentMap ───────────────────────────────────────────────────────

class ParentStudentMap(Base):
    __tablename__ = "dem_parent_student_map"

    id                = Column(Integer, primary_key=True, index=True)
    parent_id         = Column(Integer, ForeignKey("dem_parent_master.parent_id"), index=True)
    student_id        = Column(BigInteger, ForeignKey("dem_student_master.student_id"), index=True)
    relationship_type = Column(String)

    parent_info  = relationship("ParentMaster")
    student_info = relationship("StudentMaster")


# ── 5. TeacherMaster ──────────────────────────────────────────────────────────

class TeacherMaster(Base):
    __tablename__ = "dem_teacher_master"

    teacher_id = Column(BigInteger, primary_key=True, index=True)
    full_name  = Column(String, index=True)
    email      = Column('email_id', String)
    phone      = Column(BigInteger, nullable=True)

    subject_name = Column(String, nullable=True)
    class_id     = Column(BigInteger, nullable=True)
    section_1    = Column(String, nullable=True)
    section_2    = Column(String, nullable=True)
    role         = Column(String, nullable=True)
    is_active    = Column(Boolean, nullable=True)
    created_at   = Column(TIMESTAMP, nullable=True)


# ── 6. SubjectMaster ──────────────────────────────────────────────────────────

class SubjectMaster(Base):
    __tablename__ = "dem_subject_master"

    subject_id   = Column(BigInteger, primary_key=True, index=True)
    class_id     = Column(BigInteger, ForeignKey("dem_class_master.class_id"))
    subject_name = Column(String)
    subject_code = Column(String, nullable=True)
    teacher_id   = Column(BigInteger, ForeignKey("dem_users_master.user_id"), nullable=True)
    
    created_datetime  = Column(TIMESTAMP, nullable=True)
    modified_datetime = Column(TIMESTAMP, nullable=True)
    record_status     = Column(String, nullable=True)
    version_no        = Column(Integer, nullable=True)


# ── 7. ChapterMaster ──────────────────────────────────────────────────────────

class ChapterMaster(Base):
    __tablename__ = "dem_chapter_master"

    chapter_id = Column(BigInteger, primary_key=True, index=True)
    subject_id = Column(BigInteger, ForeignKey("dem_subject_master.subject_id"), index=True)
    
    chapter_no          = Column(Integer, nullable=True)
    chapter_name        = Column(String)
    chapter_description = Column(Text, nullable=True)
    chapter_order       = Column(Integer)
    
    created_datetime  = Column(TIMESTAMP, nullable=True)
    created_user_id   = Column(String, nullable=True)
    modified_datetime = Column(TIMESTAMP, nullable=True)
    record_status     = Column(String, nullable=True)
    version_no        = Column(Integer, nullable=True)

    subject_info = relationship("SubjectMaster")


# ── 8. AssignmentMaster ───────────────────────────────────────────────────────

class AssignmentMaster(Base):
    __tablename__ = "dem_assignment_master"

    assignment_id    = Column(BigInteger, primary_key=True, index=True)
    chapter_id       = Column(BigInteger, ForeignKey("dem_chapter_master.chapter_id"), index=True)
    assignment_title = Column(String)
    assignment_text  = Column(Text)
    due_date         = Column(Date)
    assigned_by      = Column(BigInteger, ForeignKey("dem_users_master.user_id"), nullable=True)
    created_datetime = Column(TIMESTAMP, default=datetime.utcnow)

    created_user_id     = Column(BigInteger, nullable=True)
    modified_user_id    = Column(BigInteger, nullable=True)
    modified_datetime   = Column(TIMESTAMP, nullable=True)
    modified_ip_address = Column(String, nullable=True)
    record_status       = Column(String, nullable=True)
    version_no          = Column(Integer, nullable=True)

    chapter_info = relationship("ChapterMaster")


# ── 9. StudentSubmission ──────────────────────────────────────────────────────

class StudentSubmission(Base):
    __tablename__ = "dem_student_submission"

    submission_id   = Column(BigInteger, primary_key=True, index=True)
    assignment_id   = Column(BigInteger, ForeignKey("dem_assignment_master.assignment_id"))
    student_id      = Column(BigInteger, ForeignKey("dem_student_master.student_id"), index=True)
    submission_text = Column(Text)
    file_path       = Column(Text)
    marks_obtained  = Column(Numeric(5, 2))
    teacher_remarks = Column(Text)
    submitted_at    = Column(TIMESTAMP, default=datetime.utcnow)
    
    created_datetime  = Column(TIMESTAMP, nullable=True)
    modified_datetime = Column(TIMESTAMP, nullable=True)
    record_status     = Column(String, nullable=True)
    version_no        = Column(Integer, nullable=True)

    assignment_info = relationship("AssignmentMaster")


# ── 10. QuizMaster ────────────────────────────────────────────────────────────

class QuizMaster(Base):
    __tablename__ = "dem_quiz_master"

    quiz_id          = Column(BigInteger, primary_key=True, index=True)
    chapter_id       = Column(BigInteger, ForeignKey("dem_chapter_master.chapter_id"), index=True)
    quiz_title       = Column(String)
    total_marks      = Column(Integer)
    duration_minutes = Column(Integer)
    created_datetime = Column(TIMESTAMP, default=datetime.utcnow)

    modified_datetime = Column(TIMESTAMP, nullable=True)
    record_status     = Column(String, nullable=True)
    version_no        = Column(Integer, nullable=True)

    chapter_info = relationship("ChapterMaster")


# ── 11. QuizResponse ──────────────────────────────────────────────────────────

class QuizResponse(Base):
    __tablename__ = "dem_quiz_response"

    response_id    = Column(BigInteger, primary_key=True, index=True)
    quiz_id        = Column(BigInteger, ForeignKey("dem_quiz_master.quiz_id"))
    student_id     = Column(BigInteger, ForeignKey("dem_student_master.student_id"), index=True)
    score          = Column(Numeric(5, 2))
    completed_flag = Column(Boolean, default=False)
    
    created_datetime  = Column(TIMESTAMP, nullable=True)
    modified_datetime = Column(TIMESTAMP, nullable=True)
    record_status     = Column(String, nullable=True)
    version_no        = Column(Integer, nullable=True)

    quiz_info = relationship("QuizMaster")


# ── 12. NoticeBoard ───────────────────────────────────────────────────────────

class NoticeBoard(Base):
    __tablename__ = "dem_notice_board"

    notice_id        = Column(BigInteger, primary_key=True, index=True)
    notice_title     = Column(String(200))
    notice_text      = Column(Text)
    notice_date      = Column(Date)
    applicable_class = Column(String(50))
    posted_by        = Column(BigInteger, ForeignKey("dem_users_master.user_id"), nullable=True)
    created_datetime = Column(TIMESTAMP, default=datetime.utcnow)

    modified_datetime = Column(TIMESTAMP, nullable=True)
    record_status     = Column(String, nullable=True)
    version_no        = Column(Integer, nullable=True)


# ── 13. SupportTicket ─────────────────────────────────────────────────────────

class SupportTicket(Base):
    __tablename__ = "dem_support_tickets"

    ticket_id      = Column(Integer, primary_key=True, index=True)
    ticket_number  = Column(String, unique=True, index=True)
    parent_id      = Column(Integer, ForeignKey("dem_parent_master.parent_id"), index=True)
    student_id     = Column(BigInteger, ForeignKey("dem_student_master.student_id"), index=True)
    subject        = Column(String)
    category       = Column(String)
    priority       = Column(String)
    status         = Column(String, default="OPEN")
    recipient_name = Column(String, nullable=True)
    created_at     = Column(DateTime, default=datetime.utcnow)
    updated_at     = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    parent_info  = relationship("ParentMaster")
    student_info = relationship("StudentMaster")


# ── 14. TicketMessage ─────────────────────────────────────────────────────────

class TicketMessage(Base):
    __tablename__ = "dem_ticket_messages"

    message_id  = Column(Integer, primary_key=True, index=True)
    ticket_id   = Column(Integer, ForeignKey("dem_support_tickets.ticket_id"), index=True)
    sender_type = Column(String)
    sender_name = Column(String)
    message     = Column(Text)
    created_at  = Column(DateTime, default=datetime.utcnow)
    is_read     = Column(Boolean, default=False)

    ticket_info = relationship("SupportTicket")


# ── 15. Assessment ────────────────────────────────────────────────────────────

class Assessment(Base):
    __tablename__ = "dem_assessments"

    assessment_id   = Column(BigInteger, primary_key=True, index=True)
    teacher_id      = Column(BigInteger, ForeignKey("dem_teacher_master.teacher_id"), nullable=False)
    title           = Column(String(300))
    assessment_type = Column(
        PgEnum('quiz', 'test', 'exam', 'assignment', name='assessment_type', create_type=True),
        nullable=False,
        server_default='test',
    )
    chapter_id      = Column(BigInteger, ForeignKey("dem_chapter_master.chapter_id"), nullable=True)
    chapter         = Column(String(300), nullable=True)
    assessment_date = Column(Date, nullable=True)
    max_marks       = Column(Numeric(6, 2), nullable=True)
    class_name      = Column(String(10), nullable=False)
    section         = Column(String(5), nullable=False)
    total_students  = Column(Integer, nullable=True)
    submitted       = Column(Integer, nullable=True)
    class_average   = Column(Numeric(5, 2), nullable=True)
    created_at      = Column(TIMESTAMP, nullable=True)
    updated_at      = Column(TIMESTAMP, nullable=True)
    record_status   = Column(String(20), nullable=True)
    version_no      = Column(Integer, nullable=True)

    teacher_info = relationship("TeacherMaster")
    chapter_info = relationship("ChapterMaster")


# ── 16. AssessmentResult ──────────────────────────────────────────────────────

class AssessmentResult(Base):
    __tablename__ = "dem_assessment_results"

    result_id      = Column(BigInteger, primary_key=True, index=True)
    assessment_id  = Column(BigInteger, ForeignKey("dem_assessments.assessment_id"), index=True)
    student_id     = Column(BigInteger, ForeignKey("dem_student_master.student_id"), index=True)
    roll_number    = Column(String(20), nullable=False)
    student_name   = Column(String(150), nullable=True)
    marks_obtained = Column(Numeric(6, 2), nullable=True)
    percentage     = Column(Numeric(5, 2), nullable=True)
    is_absent      = Column(Boolean, nullable=False, default=False)
    created_at     = Column(TIMESTAMP, nullable=True)
    updated_at     = Column(TIMESTAMP, nullable=True)
    record_status  = Column(String(20), nullable=True)
    version_no     = Column(Integer, nullable=True)

    assessment_info = relationship("Assessment")