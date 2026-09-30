from typing import Any, Optional
import datetime
import decimal
import uuid

from sqlalchemy import BigInteger, Boolean, CHAR, CheckConstraint, Date, DateTime, ForeignKeyConstraint, Integer, Numeric, PrimaryKeyConstraint, SmallInteger, String, Text, Time, UniqueConstraint, Uuid, text
from sqlalchemy.dialects.postgresql import INET, JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass


class JclgAuthProvider(Base):
    __tablename__ = 'jclg_auth_provider'
    __table_args__ = (
        PrimaryKeyConstraint('auth_provider_id', name='jclg_auth_provider_pkey'),
        UniqueConstraint('provider_code', name='jclg_auth_provider_provider_code_key')
    )

    auth_provider_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    provider_code: Mapped[str] = mapped_column(String(30), nullable=False)
    provider_name: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    issuer_url: Mapped[Optional[str]] = mapped_column(Text)
    client_id: Mapped[Optional[str]] = mapped_column(String(255))
    config_json: Mapped[Optional[dict]] = mapped_column(JSONB)

    jclg_user_auth: Mapped[list['JclgUserAuth']] = relationship('JclgUserAuth', back_populates='auth_provider')
    jclg_login_audit: Mapped[list['JclgLoginAudit']] = relationship('JclgLoginAudit', back_populates='auth_provider')


class JclgInstitution(Base):
    __tablename__ = 'jclg_institution'
    __table_args__ = (
        PrimaryKeyConstraint('institution_id', name='jclg_institution_pkey'),
        UniqueConstraint('institution_code', name='jclg_institution_institution_code_key')
    )

    institution_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    institution_code: Mapped[str] = mapped_column(String(30), nullable=False)
    institution_name: Mapped[str] = mapped_column(String(150), nullable=False)
    status: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    address: Mapped[Optional[str]] = mapped_column(Text)
    city: Mapped[Optional[str]] = mapped_column(String(100))
    state: Mapped[Optional[str]] = mapped_column(String(100))
    postal_code: Mapped[Optional[str]] = mapped_column(String(15))
    phone: Mapped[Optional[str]] = mapped_column(String(20))
    email: Mapped[Optional[str]] = mapped_column(String(150))
    website_url: Mapped[Optional[str]] = mapped_column(Text)

    jclg_campus: Mapped[list['JclgCampus']] = relationship('JclgCampus', back_populates='institution')


class JclgRole(Base):
    __tablename__ = 'jclg_role'
    __table_args__ = (
        PrimaryKeyConstraint('role_id', name='jclg_role_pkey'),
        UniqueConstraint('role_code', name='jclg_role_role_code_key')
    )

    role_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    role_code: Mapped[str] = mapped_column(String(50), nullable=False)
    role_name: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    description: Mapped[Optional[str]] = mapped_column(Text)

    jclg_role_module: Mapped[list['JclgRoleModule']] = relationship('JclgRoleModule', back_populates='role')
    jclg_login_session: Mapped[list['JclgLoginSession']] = relationship('JclgLoginSession', back_populates='selected_role')
    jclg_user_role: Mapped[list['JclgUserRole']] = relationship('JclgUserRole', back_populates='role')


class JclgCampus(Base):
    __tablename__ = 'jclg_campus'
    __table_args__ = (
        ForeignKeyConstraint(['institution_id'], ['jclg_institution.institution_id'], name='jclg_campus_institution_id_fkey'),
        PrimaryKeyConstraint('campus_id', name='jclg_campus_pkey'),
        UniqueConstraint('campus_code', name='jclg_campus_campus_code_key')
    )

    campus_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    institution_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    campus_code: Mapped[str] = mapped_column(String(30), nullable=False)
    campus_name: Mapped[str] = mapped_column(String(150), nullable=False)
    status: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    address: Mapped[Optional[str]] = mapped_column(Text)
    city: Mapped[Optional[str]] = mapped_column(String(100))
    state: Mapped[Optional[str]] = mapped_column(String(100))
    postal_code: Mapped[Optional[str]] = mapped_column(String(15))
    phone: Mapped[Optional[str]] = mapped_column(String(20))
    email: Mapped[Optional[str]] = mapped_column(String(150))

    institution: Mapped['JclgInstitution'] = relationship('JclgInstitution', back_populates='jclg_campus')
    jclg_academic_year: Mapped[list['JclgAcademicYear']] = relationship('JclgAcademicYear', back_populates='campus')
    jclg_stream: Mapped[list['JclgStream']] = relationship('JclgStream', back_populates='campus')
    jclg_subject: Mapped[list['JclgSubject']] = relationship('JclgSubject', back_populates='campus')
    jclg_user: Mapped[list['JclgUser']] = relationship('JclgUser', back_populates='campus')
    jclg_ai_usage: Mapped[list['JclgAiUsage']] = relationship('JclgAiUsage', back_populates='campus')
    jclg_audit_log: Mapped[list['JclgAuditLog']] = relationship('JclgAuditLog', back_populates='campus')
    jclg_exam: Mapped[list['JclgExam']] = relationship('JclgExam', back_populates='campus')
    jclg_faculty: Mapped[list['JclgFaculty']] = relationship('JclgFaculty', back_populates='campus')
    jclg_user_role: Mapped[list['JclgUserRole']] = relationship('JclgUserRole', back_populates='campus')
    jclg_admission: Mapped[list['JclgAdmission']] = relationship('JclgAdmission', back_populates='campus')
    jclg_fee_structure: Mapped[list['JclgFeeStructure']] = relationship('JclgFeeStructure', back_populates='campus')
    jclg_notice: Mapped[list['JclgNotice']] = relationship('JclgNotice', back_populates='campus')
    jclg_student: Mapped[list['JclgStudent']] = relationship('JclgStudent', back_populates='campus')
    jclg_timetable: Mapped[list['JclgTimetable']] = relationship('JclgTimetable', back_populates='campus')
    jclg_ai_insight: Mapped[list['JclgAiInsight']] = relationship('JclgAiInsight', back_populates='campus')


class JclgRoleModule(Base):
    __tablename__ = 'jclg_role_module'
    __table_args__ = (
        ForeignKeyConstraint(['role_id'], ['jclg_role.role_id'], name='jclg_role_module_role_id_fkey'),
        PrimaryKeyConstraint('role_module_id', name='jclg_role_module_pkey'),
        UniqueConstraint('role_id', 'module_code', name='jclg_role_module_role_id_module_code_key')
    )

    role_module_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    role_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    module_code: Mapped[str] = mapped_column(String(50), nullable=False)
    can_view: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    can_create: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('false'))
    can_update: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('false'))
    can_delete: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('false'))
    status: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    module_name: Mapped[Optional[str]] = mapped_column(String(100))

    role: Mapped['JclgRole'] = relationship('JclgRole', back_populates='jclg_role_module')


class JclgAcademicYear(Base):
    __tablename__ = 'jclg_academic_year'
    __table_args__ = (
        ForeignKeyConstraint(['campus_id'], ['jclg_campus.campus_id'], name='jclg_academic_year_campus_id_fkey'),
        PrimaryKeyConstraint('academic_year_id', name='jclg_academic_year_pkey')
    )

    academic_year_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    campus_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    year_name: Mapped[str] = mapped_column(String(20), nullable=False)
    start_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    end_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    is_current: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('false'))
    status: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))

    campus: Mapped['JclgCampus'] = relationship('JclgCampus', back_populates='jclg_academic_year')
    jclg_exam: Mapped[list['JclgExam']] = relationship('JclgExam', back_populates='academic_year')
    jclg_group: Mapped[list['JclgGroup']] = relationship('JclgGroup', back_populates='academic_year')
    jclg_admission: Mapped[list['JclgAdmission']] = relationship('JclgAdmission', back_populates='academic_year')
    jclg_fee_structure: Mapped[list['JclgFeeStructure']] = relationship('JclgFeeStructure', back_populates='academic_year')
    jclg_student: Mapped[list['JclgStudent']] = relationship('JclgStudent', back_populates='academic_year')
    jclg_timetable: Mapped[list['JclgTimetable']] = relationship('JclgTimetable', back_populates='academic_year')
    jclg_attendance: Mapped[list['JclgAttendance']] = relationship('JclgAttendance', back_populates='academic_year')


class JclgStream(Base):
    __tablename__ = 'jclg_stream'
    __table_args__ = (
        ForeignKeyConstraint(['campus_id'], ['jclg_campus.campus_id'], name='jclg_stream_campus_id_fkey'),
        PrimaryKeyConstraint('stream_id', name='jclg_stream_pkey')
    )

    stream_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    campus_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    stream_code: Mapped[str] = mapped_column(String(30), nullable=False)
    stream_name: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    description: Mapped[Optional[str]] = mapped_column(Text)

    campus: Mapped['JclgCampus'] = relationship('JclgCampus', back_populates='jclg_stream')
    jclg_group: Mapped[list['JclgGroup']] = relationship('JclgGroup', back_populates='stream')
    jclg_admission: Mapped[list['JclgAdmission']] = relationship('JclgAdmission', back_populates='stream')


class JclgSubject(Base):
    __tablename__ = 'jclg_subject'
    __table_args__ = (
        ForeignKeyConstraint(['campus_id'], ['jclg_campus.campus_id'], name='jclg_subject_campus_id_fkey'),
        PrimaryKeyConstraint('subject_id', name='jclg_subject_pkey')
    )

    subject_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    campus_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    subject_code: Mapped[str] = mapped_column(String(30), nullable=False)
    subject_name: Mapped[str] = mapped_column(String(150), nullable=False)
    status: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    subject_type: Mapped[Optional[str]] = mapped_column(String(30))
    max_marks: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(6, 2))
    pass_marks: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(6, 2))
    credits: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(5, 2))

    campus: Mapped['JclgCampus'] = relationship('JclgCampus', back_populates='jclg_subject')
    jclg_assignment: Mapped[list['JclgAssignment']] = relationship('JclgAssignment', back_populates='subject')
    jclg_exam_subject: Mapped[list['JclgExamSubject']] = relationship('JclgExamSubject', back_populates='subject')
    jclg_study_material: Mapped[list['JclgStudyMaterial']] = relationship('JclgStudyMaterial', back_populates='subject')
    jclg_timetable: Mapped[list['JclgTimetable']] = relationship('JclgTimetable', back_populates='subject')


class JclgUser(Base):
    __tablename__ = 'jclg_user'
    __table_args__ = (
        ForeignKeyConstraint(['campus_id'], ['jclg_campus.campus_id'], name='jclg_user_campus_id_fkey'),
        PrimaryKeyConstraint('user_id', name='jclg_user_pkey'),
        UniqueConstraint('email', name='jclg_user_email_key'),
        UniqueConstraint('username', name='jclg_user_username_key')
    )

    user_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(150), nullable=False)
    status: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    campus_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    username: Mapped[Optional[str]] = mapped_column(String(100))
    last_name: Mapped[Optional[str]] = mapped_column(String(100))
    phone: Mapped[Optional[str]] = mapped_column(String(20))
    gender: Mapped[Optional[str]] = mapped_column(String(20))
    profile_photo: Mapped[Optional[str]] = mapped_column(Text)
    last_login: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))

    campus: Mapped[Optional['JclgCampus']] = relationship('JclgCampus', back_populates='jclg_user')
    jclg_ai_usage: Mapped[list['JclgAiUsage']] = relationship('JclgAiUsage', back_populates='user')
    jclg_audit_log: Mapped[list['JclgAuditLog']] = relationship('JclgAuditLog', back_populates='user')
    jclg_faculty: Mapped[list['JclgFaculty']] = relationship('JclgFaculty', back_populates='user')
    jclg_login_session: Mapped[list['JclgLoginSession']] = relationship('JclgLoginSession', back_populates='user')
    jclg_notification: Mapped[list['JclgNotification']] = relationship('JclgNotification', back_populates='user')
    jclg_parent: Mapped[list['JclgParent']] = relationship('JclgParent', back_populates='user')
    jclg_user_auth: Mapped[list['JclgUserAuth']] = relationship('JclgUserAuth', back_populates='user')
    jclg_user_role_assigned_by: Mapped[list['JclgUserRole']] = relationship('JclgUserRole', foreign_keys='[JclgUserRole.assigned_by]', back_populates='jclg_user')
    jclg_user_role_user: Mapped[list['JclgUserRole']] = relationship('JclgUserRole', foreign_keys='[JclgUserRole.user_id]', back_populates='user')
    jclg_login_audit: Mapped[list['JclgLoginAudit']] = relationship('JclgLoginAudit', back_populates='user')
    jclg_notice: Mapped[list['JclgNotice']] = relationship('JclgNotice', back_populates='jclg_user')
    jclg_student: Mapped[list['JclgStudent']] = relationship('JclgStudent', back_populates='user')
    jclg_attendance: Mapped[list['JclgAttendance']] = relationship('JclgAttendance', back_populates='jclg_user')
    jclg_fee_payment: Mapped[list['JclgFeePayment']] = relationship('JclgFeePayment', back_populates='jclg_user')
    jclg_leave_approved_by: Mapped[list['JclgLeave']] = relationship('JclgLeave', foreign_keys='[JclgLeave.approved_by]', back_populates='jclg_user')
    jclg_leave_user: Mapped[list['JclgLeave']] = relationship('JclgLeave', foreign_keys='[JclgLeave.user_id]', back_populates='user')
    jclg_marks: Mapped[list['JclgMarks']] = relationship('JclgMarks', back_populates='jclg_user')
    jclg_fee_receipt: Mapped[list['JclgFeeReceipt']] = relationship('JclgFeeReceipt', back_populates='jclg_user')


class JclgAiUsage(Base):
    __tablename__ = 'jclg_ai_usage'
    __table_args__ = (
        ForeignKeyConstraint(['campus_id'], ['jclg_campus.campus_id'], name='jclg_ai_usage_campus_id_fkey'),
        ForeignKeyConstraint(['user_id'], ['jclg_user.user_id'], name='jclg_ai_usage_user_id_fkey'),
        PrimaryKeyConstraint('ai_usage_id', name='jclg_ai_usage_pkey')
    )

    ai_usage_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    campus_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    feature_name: Mapped[str] = mapped_column(String(100), nullable=False)
    provider: Mapped[str] = mapped_column(String(100), nullable=False)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    input_tokens: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text('0'))
    output_tokens: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text('0'))
    total_tokens: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text('0'))
    request_cost: Mapped[decimal.Decimal] = mapped_column(Numeric(12, 6), nullable=False, server_default=text('0'))
    request_status: Mapped[str] = mapped_column(String(30), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    latency_ms: Mapped[Optional[int]] = mapped_column(Integer)

    campus: Mapped['JclgCampus'] = relationship('JclgCampus', back_populates='jclg_ai_usage')
    user: Mapped['JclgUser'] = relationship('JclgUser', back_populates='jclg_ai_usage')


class JclgAuditLog(Base):
    __tablename__ = 'jclg_audit_log'
    __table_args__ = (
        ForeignKeyConstraint(['campus_id'], ['jclg_campus.campus_id'], name='jclg_audit_log_campus_id_fkey'),
        ForeignKeyConstraint(['user_id'], ['jclg_user.user_id'], name='jclg_audit_log_user_id_fkey'),
        PrimaryKeyConstraint('audit_id', name='jclg_audit_log_pkey')
    )

    audit_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    action: Mapped[str] = mapped_column(String(50), nullable=False)
    table_name: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    user_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    campus_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    record_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    old_values: Mapped[Optional[dict]] = mapped_column(JSONB)
    new_values: Mapped[Optional[dict]] = mapped_column(JSONB)
    ip_address: Mapped[Optional[Any]] = mapped_column(INET)
    user_agent: Mapped[Optional[str]] = mapped_column(Text)

    campus: Mapped[Optional['JclgCampus']] = relationship('JclgCampus', back_populates='jclg_audit_log')
    user: Mapped[Optional['JclgUser']] = relationship('JclgUser', back_populates='jclg_audit_log')


class JclgExam(Base):
    __tablename__ = 'jclg_exam'
    __table_args__ = (
        ForeignKeyConstraint(['academic_year_id'], ['jclg_academic_year.academic_year_id'], name='jclg_exam_academic_year_id_fkey'),
        ForeignKeyConstraint(['campus_id'], ['jclg_campus.campus_id'], name='jclg_exam_campus_id_fkey'),
        PrimaryKeyConstraint('exam_id', name='jclg_exam_pkey')
    )

    exam_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    campus_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    academic_year_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    exam_name: Mapped[str] = mapped_column(String(150), nullable=False)
    start_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    end_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    status: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    exam_type: Mapped[Optional[str]] = mapped_column(String(50))
    description: Mapped[Optional[str]] = mapped_column(Text)

    academic_year: Mapped['JclgAcademicYear'] = relationship('JclgAcademicYear', back_populates='jclg_exam')
    campus: Mapped['JclgCampus'] = relationship('JclgCampus', back_populates='jclg_exam')
    jclg_exam_subject: Mapped[list['JclgExamSubject']] = relationship('JclgExamSubject', back_populates='exam')
    jclg_result: Mapped[list['JclgResult']] = relationship('JclgResult', back_populates='exam')


class JclgFaculty(Base):
    __tablename__ = 'jclg_faculty'
    __table_args__ = (
        ForeignKeyConstraint(['campus_id'], ['jclg_campus.campus_id'], name='jclg_faculty_campus_id_fkey'),
        ForeignKeyConstraint(['user_id'], ['jclg_user.user_id'], name='jclg_faculty_user_id_fkey'),
        PrimaryKeyConstraint('faculty_id', name='jclg_faculty_pkey'),
        UniqueConstraint('employee_code', name='jclg_faculty_employee_code_key')
    )

    faculty_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    campus_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    employee_code: Mapped[str] = mapped_column(String(50), nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    user_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    last_name: Mapped[Optional[str]] = mapped_column(String(100))
    phone: Mapped[Optional[str]] = mapped_column(String(20))
    email: Mapped[Optional[str]] = mapped_column(String(150))
    qualification: Mapped[Optional[str]] = mapped_column(String(255))
    designation: Mapped[Optional[str]] = mapped_column(String(100))
    joining_date: Mapped[Optional[datetime.date]] = mapped_column(Date)
    department: Mapped[Optional[str]] = mapped_column(String(100))

    campus: Mapped['JclgCampus'] = relationship('JclgCampus', back_populates='jclg_faculty')
    user: Mapped[Optional['JclgUser']] = relationship('JclgUser', back_populates='jclg_faculty')
    jclg_section: Mapped[list['JclgSection']] = relationship('JclgSection', back_populates='class_teacher')
    jclg_assignment: Mapped[list['JclgAssignment']] = relationship('JclgAssignment', back_populates='faculty')
    jclg_study_material: Mapped[list['JclgStudyMaterial']] = relationship('JclgStudyMaterial', back_populates='faculty')
    jclg_timetable: Mapped[list['JclgTimetable']] = relationship('JclgTimetable', back_populates='faculty')
    jclg_ai_insight: Mapped[list['JclgAiInsight']] = relationship('JclgAiInsight', back_populates='faculty')


class JclgGroup(Base):
    __tablename__ = 'jclg_group'
    __table_args__ = (
        ForeignKeyConstraint(['academic_year_id'], ['jclg_academic_year.academic_year_id'], name='jclg_group_academic_year_id_fkey'),
        ForeignKeyConstraint(['stream_id'], ['jclg_stream.stream_id'], name='jclg_group_stream_id_fkey'),
        PrimaryKeyConstraint('group_id', name='jclg_group_pkey')
    )

    group_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    stream_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    academic_year_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    group_code: Mapped[str] = mapped_column(String(30), nullable=False)
    group_name: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    description: Mapped[Optional[str]] = mapped_column(Text)

    academic_year: Mapped['JclgAcademicYear'] = relationship('JclgAcademicYear', back_populates='jclg_group')
    stream: Mapped['JclgStream'] = relationship('JclgStream', back_populates='jclg_group')
    jclg_admission: Mapped[list['JclgAdmission']] = relationship('JclgAdmission', back_populates='group')
    jclg_fee_structure: Mapped[list['JclgFeeStructure']] = relationship('JclgFeeStructure', back_populates='group')
    jclg_section: Mapped[list['JclgSection']] = relationship('JclgSection', back_populates='group')
    jclg_student: Mapped[list['JclgStudent']] = relationship('JclgStudent', back_populates='group')


class JclgLoginSession(Base):
    __tablename__ = 'jclg_login_session'
    __table_args__ = (
        ForeignKeyConstraint(['selected_role_id'], ['jclg_role.role_id'], name='jclg_login_session_selected_role_id_fkey'),
        ForeignKeyConstraint(['user_id'], ['jclg_user.user_id'], name='jclg_login_session_user_id_fkey'),
        PrimaryKeyConstraint('session_id', name='jclg_login_session_pkey')
    )

    session_id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, server_default=text('gen_random_uuid()'))
    user_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    session_token_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    expires_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    selected_role_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    selected_module_code: Mapped[Optional[str]] = mapped_column(String(50))
    ip_address: Mapped[Optional[Any]] = mapped_column(INET)
    user_agent: Mapped[Optional[str]] = mapped_column(Text)
    last_activity_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))
    revoked_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))

    selected_role: Mapped[Optional['JclgRole']] = relationship('JclgRole', back_populates='jclg_login_session')
    user: Mapped['JclgUser'] = relationship('JclgUser', back_populates='jclg_login_session')
    jclg_login_audit: Mapped[list['JclgLoginAudit']] = relationship('JclgLoginAudit', back_populates='session')


class JclgNotification(Base):
    __tablename__ = 'jclg_notification'
    __table_args__ = (
        ForeignKeyConstraint(['user_id'], ['jclg_user.user_id'], name='jclg_notification_user_id_fkey'),
        PrimaryKeyConstraint('notification_id', name='jclg_notification_pkey')
    )

    notification_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('false'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    user_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    notification_type: Mapped[Optional[str]] = mapped_column(String(50))
    channel: Mapped[Optional[str]] = mapped_column(String(30))
    reference_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    sent_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))
    delivery_status: Mapped[Optional[str]] = mapped_column(String(30))

    user: Mapped[Optional['JclgUser']] = relationship('JclgUser', back_populates='jclg_notification')


class JclgParent(Base):
    __tablename__ = 'jclg_parent'
    __table_args__ = (
        ForeignKeyConstraint(['user_id'], ['jclg_user.user_id'], name='jclg_parent_user_id_fkey'),
        PrimaryKeyConstraint('parent_id', name='jclg_parent_pkey'),
        UniqueConstraint('parent_code', name='jclg_parent_parent_code_key')
    )

    parent_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    parent_code: Mapped[str] = mapped_column(String(50), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    status: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    user_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    father_name: Mapped[Optional[str]] = mapped_column(String(150))
    mother_name: Mapped[Optional[str]] = mapped_column(String(150))
    guardian_name: Mapped[Optional[str]] = mapped_column(String(150))
    alternate_phone: Mapped[Optional[str]] = mapped_column(String(20))
    email: Mapped[Optional[str]] = mapped_column(String(150))
    address: Mapped[Optional[str]] = mapped_column(Text)
    occupation: Mapped[Optional[str]] = mapped_column(String(150))

    user: Mapped[Optional['JclgUser']] = relationship('JclgUser', back_populates='jclg_parent')
    jclg_student_parent: Mapped[list['JclgStudentParent']] = relationship('JclgStudentParent', back_populates='parent')


class JclgUserAuth(Base):
    __tablename__ = 'jclg_user_auth'
    __table_args__ = (
        ForeignKeyConstraint(['auth_provider_id'], ['jclg_auth_provider.auth_provider_id'], name='jclg_user_auth_auth_provider_id_fkey'),
        ForeignKeyConstraint(['user_id'], ['jclg_user.user_id'], name='jclg_user_auth_user_id_fkey'),
        PrimaryKeyConstraint('user_auth_id', name='jclg_user_auth_pkey'),
        UniqueConstraint('auth_provider_id', 'provider_user_id', name='jclg_user_auth_auth_provider_id_provider_user_id_key')
    )

    user_auth_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    auth_provider_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    provider_user_id: Mapped[str] = mapped_column(String(255), nullable=False)
    email_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('false'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    provider_email: Mapped[Optional[str]] = mapped_column(String(150))
    token_expires_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))
    last_authenticated_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))

    auth_provider: Mapped['JclgAuthProvider'] = relationship('JclgAuthProvider', back_populates='jclg_user_auth')
    user: Mapped['JclgUser'] = relationship('JclgUser', back_populates='jclg_user_auth')


class JclgUserRole(Base):
    __tablename__ = 'jclg_user_role'
    __table_args__ = (
        ForeignKeyConstraint(['assigned_by'], ['jclg_user.user_id'], name='jclg_user_role_assigned_by_fkey'),
        ForeignKeyConstraint(['campus_id'], ['jclg_campus.campus_id'], name='jclg_user_role_campus_id_fkey'),
        ForeignKeyConstraint(['role_id'], ['jclg_role.role_id'], name='jclg_user_role_role_id_fkey'),
        ForeignKeyConstraint(['user_id'], ['jclg_user.user_id'], name='jclg_user_role_user_id_fkey'),
        PrimaryKeyConstraint('user_role_id', name='jclg_user_role_pkey'),
        UniqueConstraint('user_id', 'role_id', 'campus_id', name='jclg_user_role_user_id_role_id_campus_id_key')
    )

    user_role_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    role_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    is_primary: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('false'))
    status: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    assigned_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    campus_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    assigned_by: Mapped[Optional[int]] = mapped_column(BigInteger)

    jclg_user: Mapped[Optional['JclgUser']] = relationship('JclgUser', foreign_keys=[assigned_by], back_populates='jclg_user_role_assigned_by')
    campus: Mapped[Optional['JclgCampus']] = relationship('JclgCampus', back_populates='jclg_user_role')
    role: Mapped['JclgRole'] = relationship('JclgRole', back_populates='jclg_user_role')
    user: Mapped['JclgUser'] = relationship('JclgUser', foreign_keys=[user_id], back_populates='jclg_user_role_user')


class JclgAdmission(Base):
    __tablename__ = 'jclg_admission'
    __table_args__ = (
        ForeignKeyConstraint(['academic_year_id'], ['jclg_academic_year.academic_year_id'], name='jclg_admission_academic_year_id_fkey'),
        ForeignKeyConstraint(['campus_id'], ['jclg_campus.campus_id'], name='jclg_admission_campus_id_fkey'),
        ForeignKeyConstraint(['group_id'], ['jclg_group.group_id'], name='jclg_admission_group_id_fkey'),
        ForeignKeyConstraint(['stream_id'], ['jclg_stream.stream_id'], name='jclg_admission_stream_id_fkey'),
        PrimaryKeyConstraint('admission_id', name='jclg_admission_pkey'),
        UniqueConstraint('application_no', name='jclg_admission_application_no_key')
    )

    admission_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    campus_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    academic_year_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    application_no: Mapped[str] = mapped_column(String(50), nullable=False)
    student_name: Mapped[str] = mapped_column(String(200), nullable=False)
    date_of_birth: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    stream_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    application_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    admission_status: Mapped[str] = mapped_column(String(30), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    gender: Mapped[Optional[str]] = mapped_column(String(20))
    phone: Mapped[Optional[str]] = mapped_column(String(20))
    email: Mapped[Optional[str]] = mapped_column(String(150))
    previous_school: Mapped[Optional[str]] = mapped_column(String(200))
    group_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    admission_date: Mapped[Optional[datetime.date]] = mapped_column(Date)
    documents_status: Mapped[Optional[str]] = mapped_column(String(30))

    academic_year: Mapped['JclgAcademicYear'] = relationship('JclgAcademicYear', back_populates='jclg_admission')
    campus: Mapped['JclgCampus'] = relationship('JclgCampus', back_populates='jclg_admission')
    group: Mapped[Optional['JclgGroup']] = relationship('JclgGroup', back_populates='jclg_admission')
    stream: Mapped['JclgStream'] = relationship('JclgStream', back_populates='jclg_admission')
    jclg_student: Mapped[list['JclgStudent']] = relationship('JclgStudent', back_populates='admission')


class JclgFeeStructure(Base):
    __tablename__ = 'jclg_fee_structure'
    __table_args__ = (
        ForeignKeyConstraint(['academic_year_id'], ['jclg_academic_year.academic_year_id'], name='jclg_fee_structure_academic_year_id_fkey'),
        ForeignKeyConstraint(['campus_id'], ['jclg_campus.campus_id'], name='jclg_fee_structure_campus_id_fkey'),
        ForeignKeyConstraint(['group_id'], ['jclg_group.group_id'], name='jclg_fee_structure_group_id_fkey'),
        PrimaryKeyConstraint('fee_structure_id', name='jclg_fee_structure_pkey')
    )

    fee_structure_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    campus_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    academic_year_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    fee_type: Mapped[str] = mapped_column(String(100), nullable=False)
    amount: Mapped[decimal.Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    concession_allowed: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('false'))
    status: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    group_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    due_date: Mapped[Optional[datetime.date]] = mapped_column(Date)
    frequency: Mapped[Optional[str]] = mapped_column(String(30))

    academic_year: Mapped['JclgAcademicYear'] = relationship('JclgAcademicYear', back_populates='jclg_fee_structure')
    campus: Mapped['JclgCampus'] = relationship('JclgCampus', back_populates='jclg_fee_structure')
    group: Mapped[Optional['JclgGroup']] = relationship('JclgGroup', back_populates='jclg_fee_structure')
    jclg_fee_payment: Mapped[list['JclgFeePayment']] = relationship('JclgFeePayment', back_populates='fee_structure')


class JclgLoginAudit(Base):
    __tablename__ = 'jclg_login_audit'
    __table_args__ = (
        ForeignKeyConstraint(['auth_provider_id'], ['jclg_auth_provider.auth_provider_id'], name='jclg_login_audit_auth_provider_id_fkey'),
        ForeignKeyConstraint(['session_id'], ['jclg_login_session.session_id'], name='jclg_login_audit_session_id_fkey'),
        ForeignKeyConstraint(['user_id'], ['jclg_user.user_id'], name='jclg_login_audit_user_id_fkey'),
        PrimaryKeyConstraint('login_audit_id', name='jclg_login_audit_pkey')
    )

    login_audit_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    event_type: Mapped[str] = mapped_column(String(30), nullable=False)
    success: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    event_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    user_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    auth_provider_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    session_id: Mapped[Optional[uuid.UUID]] = mapped_column(Uuid)
    failure_reason: Mapped[Optional[str]] = mapped_column(Text)
    ip_address: Mapped[Optional[Any]] = mapped_column(INET)
    user_agent: Mapped[Optional[str]] = mapped_column(Text)

    auth_provider: Mapped[Optional['JclgAuthProvider']] = relationship('JclgAuthProvider', back_populates='jclg_login_audit')
    session: Mapped[Optional['JclgLoginSession']] = relationship('JclgLoginSession', back_populates='jclg_login_audit')
    user: Mapped[Optional['JclgUser']] = relationship('JclgUser', back_populates='jclg_login_audit')


class JclgSection(Base):
    __tablename__ = 'jclg_section'
    __table_args__ = (
        CheckConstraint('capacity >= 0', name='jclg_section_capacity_check'),
        ForeignKeyConstraint(['class_teacher_id'], ['jclg_faculty.faculty_id'], name='jclg_section_class_teacher_id_fkey'),
        ForeignKeyConstraint(['group_id'], ['jclg_group.group_id'], name='jclg_section_group_id_fkey'),
        PrimaryKeyConstraint('section_id', name='jclg_section_pkey')
    )

    section_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    group_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    section_name: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    class_teacher_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    room_no: Mapped[Optional[str]] = mapped_column(String(30))
    capacity: Mapped[Optional[int]] = mapped_column(SmallInteger)

    class_teacher: Mapped[Optional['JclgFaculty']] = relationship('JclgFaculty', back_populates='jclg_section')
    group: Mapped['JclgGroup'] = relationship('JclgGroup', back_populates='jclg_section')
    jclg_assignment: Mapped[list['JclgAssignment']] = relationship('JclgAssignment', back_populates='section')
    jclg_exam_subject: Mapped[list['JclgExamSubject']] = relationship('JclgExamSubject', back_populates='section')
    jclg_notice: Mapped[list['JclgNotice']] = relationship('JclgNotice', back_populates='jclg_section')
    jclg_student: Mapped[list['JclgStudent']] = relationship('JclgStudent', back_populates='section')
    jclg_study_material: Mapped[list['JclgStudyMaterial']] = relationship('JclgStudyMaterial', back_populates='section')
    jclg_timetable: Mapped[list['JclgTimetable']] = relationship('JclgTimetable', back_populates='section')
    jclg_attendance: Mapped[list['JclgAttendance']] = relationship('JclgAttendance', back_populates='section')


class JclgAssignment(Base):
    __tablename__ = 'jclg_assignment'
    __table_args__ = (
        ForeignKeyConstraint(['faculty_id'], ['jclg_faculty.faculty_id'], name='jclg_assignment_faculty_id_fkey'),
        ForeignKeyConstraint(['section_id'], ['jclg_section.section_id'], name='jclg_assignment_section_id_fkey'),
        ForeignKeyConstraint(['subject_id'], ['jclg_subject.subject_id'], name='jclg_assignment_subject_id_fkey'),
        PrimaryKeyConstraint('assignment_id', name='jclg_assignment_pkey')
    )

    assignment_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    faculty_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    subject_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    section_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    assigned_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    due_date: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    description: Mapped[Optional[str]] = mapped_column(Text)
    max_marks: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(6, 2))
    attachment_url: Mapped[Optional[str]] = mapped_column(Text)

    faculty: Mapped['JclgFaculty'] = relationship('JclgFaculty', back_populates='jclg_assignment')
    section: Mapped['JclgSection'] = relationship('JclgSection', back_populates='jclg_assignment')
    subject: Mapped['JclgSubject'] = relationship('JclgSubject', back_populates='jclg_assignment')


class JclgExamSubject(Base):
    __tablename__ = 'jclg_exam_subject'
    __table_args__ = (
        ForeignKeyConstraint(['exam_id'], ['jclg_exam.exam_id'], name='jclg_exam_subject_exam_id_fkey'),
        ForeignKeyConstraint(['section_id'], ['jclg_section.section_id'], name='jclg_exam_subject_section_id_fkey'),
        ForeignKeyConstraint(['subject_id'], ['jclg_subject.subject_id'], name='jclg_exam_subject_subject_id_fkey'),
        PrimaryKeyConstraint('exam_subject_id', name='jclg_exam_subject_pkey')
    )

    exam_subject_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    exam_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    subject_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    section_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    exam_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    start_time: Mapped[datetime.time] = mapped_column(Time, nullable=False)
    end_time: Mapped[datetime.time] = mapped_column(Time, nullable=False)
    max_marks: Mapped[decimal.Decimal] = mapped_column(Numeric(6, 2), nullable=False)
    pass_marks: Mapped[decimal.Decimal] = mapped_column(Numeric(6, 2), nullable=False)
    status: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))

    exam: Mapped['JclgExam'] = relationship('JclgExam', back_populates='jclg_exam_subject')
    section: Mapped['JclgSection'] = relationship('JclgSection', back_populates='jclg_exam_subject')
    subject: Mapped['JclgSubject'] = relationship('JclgSubject', back_populates='jclg_exam_subject')
    jclg_marks: Mapped[list['JclgMarks']] = relationship('JclgMarks', back_populates='exam_subject')


class JclgNotice(Base):
    __tablename__ = 'jclg_notice'
    __table_args__ = (
        ForeignKeyConstraint(['campus_id'], ['jclg_campus.campus_id'], name='jclg_notice_campus_id_fkey'),
        ForeignKeyConstraint(['created_by'], ['jclg_user.user_id'], name='jclg_notice_created_by_fkey'),
        ForeignKeyConstraint(['target_section'], ['jclg_section.section_id'], name='jclg_notice_target_section_fkey'),
        PrimaryKeyConstraint('notice_id', name='jclg_notice_pkey')
    )

    notice_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    campus_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    publish_date: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False)
    created_by: Mapped[int] = mapped_column(BigInteger, nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    notice_type: Mapped[Optional[str]] = mapped_column(String(50))
    target_role: Mapped[Optional[str]] = mapped_column(String(100))
    target_section: Mapped[Optional[int]] = mapped_column(BigInteger)
    expiry_date: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))
    attachment_url: Mapped[Optional[str]] = mapped_column(Text)

    campus: Mapped['JclgCampus'] = relationship('JclgCampus', back_populates='jclg_notice')
    jclg_user: Mapped['JclgUser'] = relationship('JclgUser', back_populates='jclg_notice')
    jclg_section: Mapped[Optional['JclgSection']] = relationship('JclgSection', back_populates='jclg_notice')


class JclgStudent(Base):
    __tablename__ = 'jclg_student'
    __table_args__ = (
        CheckConstraint("student_type = ANY (ARRAY['DS'::bpchar, 'HS'::bpchar])", name='jclg_student_student_type_check'),
        ForeignKeyConstraint(['academic_year_id'], ['jclg_academic_year.academic_year_id'], name='jclg_student_academic_year_id_fkey'),
        ForeignKeyConstraint(['admission_id'], ['jclg_admission.admission_id'], name='jclg_student_admission_id_fkey'),
        ForeignKeyConstraint(['campus_id'], ['jclg_campus.campus_id'], name='jclg_student_campus_id_fkey'),
        ForeignKeyConstraint(['group_id'], ['jclg_group.group_id'], name='jclg_student_group_id_fkey'),
        ForeignKeyConstraint(['section_id'], ['jclg_section.section_id'], name='jclg_student_section_id_fkey'),
        ForeignKeyConstraint(['user_id'], ['jclg_user.user_id'], name='jclg_student_user_id_fkey'),
        PrimaryKeyConstraint('student_id', name='jclg_student_pkey'),
        UniqueConstraint('student_code', name='jclg_student_student_code_key')
    )

    student_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    campus_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    academic_year_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    student_code: Mapped[str] = mapped_column(String(50), nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    date_of_birth: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    student_type: Mapped[str] = mapped_column(CHAR(2), nullable=False)
    group_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    section_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    status: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    user_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    admission_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    roll_number: Mapped[Optional[str]] = mapped_column(String(30))
    last_name: Mapped[Optional[str]] = mapped_column(String(100))
    gender: Mapped[Optional[str]] = mapped_column(String(20))
    phone: Mapped[Optional[str]] = mapped_column(String(20))
    email: Mapped[Optional[str]] = mapped_column(String(150))
    address: Mapped[Optional[str]] = mapped_column(Text)
    city: Mapped[Optional[str]] = mapped_column(String(100))
    state: Mapped[Optional[str]] = mapped_column(String(100))
    postal_code: Mapped[Optional[str]] = mapped_column(String(15))
    photo: Mapped[Optional[str]] = mapped_column(Text)
    blood_group: Mapped[Optional[str]] = mapped_column(String(10))

    academic_year: Mapped['JclgAcademicYear'] = relationship('JclgAcademicYear', back_populates='jclg_student')
    admission: Mapped[Optional['JclgAdmission']] = relationship('JclgAdmission', back_populates='jclg_student')
    campus: Mapped['JclgCampus'] = relationship('JclgCampus', back_populates='jclg_student')
    group: Mapped['JclgGroup'] = relationship('JclgGroup', back_populates='jclg_student')
    section: Mapped['JclgSection'] = relationship('JclgSection', back_populates='jclg_student')
    user: Mapped[Optional['JclgUser']] = relationship('JclgUser', back_populates='jclg_student')
    jclg_ai_insight: Mapped[list['JclgAiInsight']] = relationship('JclgAiInsight', back_populates='student')
    jclg_attendance: Mapped[list['JclgAttendance']] = relationship('JclgAttendance', back_populates='student')
    jclg_fee_payment: Mapped[list['JclgFeePayment']] = relationship('JclgFeePayment', back_populates='student')
    jclg_leave: Mapped[list['JclgLeave']] = relationship('JclgLeave', back_populates='student')
    jclg_marks: Mapped[list['JclgMarks']] = relationship('JclgMarks', back_populates='student')
    jclg_result: Mapped[list['JclgResult']] = relationship('JclgResult', back_populates='student')
    jclg_student_parent: Mapped[list['JclgStudentParent']] = relationship('JclgStudentParent', back_populates='student')


class JclgStudyMaterial(Base):
    __tablename__ = 'jclg_study_material'
    __table_args__ = (
        ForeignKeyConstraint(['faculty_id'], ['jclg_faculty.faculty_id'], name='jclg_study_material_faculty_id_fkey'),
        ForeignKeyConstraint(['section_id'], ['jclg_section.section_id'], name='jclg_study_material_section_id_fkey'),
        ForeignKeyConstraint(['subject_id'], ['jclg_subject.subject_id'], name='jclg_study_material_subject_id_fkey'),
        PrimaryKeyConstraint('material_id', name='jclg_study_material_pkey')
    )

    material_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    faculty_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    subject_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    file_url: Mapped[str] = mapped_column(Text, nullable=False)
    uploaded_date: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    status: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    section_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    description: Mapped[Optional[str]] = mapped_column(Text)
    material_type: Mapped[Optional[str]] = mapped_column(String(50))

    faculty: Mapped['JclgFaculty'] = relationship('JclgFaculty', back_populates='jclg_study_material')
    section: Mapped[Optional['JclgSection']] = relationship('JclgSection', back_populates='jclg_study_material')
    subject: Mapped['JclgSubject'] = relationship('JclgSubject', back_populates='jclg_study_material')


class JclgTimetable(Base):
    __tablename__ = 'jclg_timetable'
    __table_args__ = (
        CheckConstraint('day_of_week >= 1 AND day_of_week <= 7', name='jclg_timetable_day_of_week_check'),
        ForeignKeyConstraint(['academic_year_id'], ['jclg_academic_year.academic_year_id'], name='jclg_timetable_academic_year_id_fkey'),
        ForeignKeyConstraint(['campus_id'], ['jclg_campus.campus_id'], name='jclg_timetable_campus_id_fkey'),
        ForeignKeyConstraint(['faculty_id'], ['jclg_faculty.faculty_id'], name='jclg_timetable_faculty_id_fkey'),
        ForeignKeyConstraint(['section_id'], ['jclg_section.section_id'], name='jclg_timetable_section_id_fkey'),
        ForeignKeyConstraint(['subject_id'], ['jclg_subject.subject_id'], name='jclg_timetable_subject_id_fkey'),
        PrimaryKeyConstraint('timetable_id', name='jclg_timetable_pkey')
    )

    timetable_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    campus_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    academic_year_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    section_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    subject_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    faculty_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    day_of_week: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    period_no: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    start_time: Mapped[datetime.time] = mapped_column(Time, nullable=False)
    end_time: Mapped[datetime.time] = mapped_column(Time, nullable=False)
    status: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('true'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    room_no: Mapped[Optional[str]] = mapped_column(String(30))

    academic_year: Mapped['JclgAcademicYear'] = relationship('JclgAcademicYear', back_populates='jclg_timetable')
    campus: Mapped['JclgCampus'] = relationship('JclgCampus', back_populates='jclg_timetable')
    faculty: Mapped['JclgFaculty'] = relationship('JclgFaculty', back_populates='jclg_timetable')
    section: Mapped['JclgSection'] = relationship('JclgSection', back_populates='jclg_timetable')
    subject: Mapped['JclgSubject'] = relationship('JclgSubject', back_populates='jclg_timetable')


class JclgAiInsight(Base):
    __tablename__ = 'jclg_ai_insight'
    __table_args__ = (
        CheckConstraint('confidence_score >= 0::numeric AND confidence_score <= 1::numeric', name='jclg_ai_insight_confidence_score_check'),
        ForeignKeyConstraint(['campus_id'], ['jclg_campus.campus_id'], name='jclg_ai_insight_campus_id_fkey'),
        ForeignKeyConstraint(['faculty_id'], ['jclg_faculty.faculty_id'], name='jclg_ai_insight_faculty_id_fkey'),
        ForeignKeyConstraint(['student_id'], ['jclg_student.student_id'], name='jclg_ai_insight_student_id_fkey'),
        PrimaryKeyConstraint('insight_id', name='jclg_ai_insight_pkey')
    )

    insight_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    campus_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    insight_type: Mapped[str] = mapped_column(String(100), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    student_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    faculty_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    recommendation: Mapped[Optional[str]] = mapped_column(Text)
    confidence_score: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(5, 4))
    generated_by: Mapped[Optional[str]] = mapped_column(String(100))
    metadata_: Mapped[Optional[dict]] = mapped_column('metadata', JSONB)

    campus: Mapped['JclgCampus'] = relationship('JclgCampus', back_populates='jclg_ai_insight')
    faculty: Mapped[Optional['JclgFaculty']] = relationship('JclgFaculty', back_populates='jclg_ai_insight')
    student: Mapped[Optional['JclgStudent']] = relationship('JclgStudent', back_populates='jclg_ai_insight')


class JclgAttendance(Base):
    __tablename__ = 'jclg_attendance'
    __table_args__ = (
        ForeignKeyConstraint(['academic_year_id'], ['jclg_academic_year.academic_year_id'], name='jclg_attendance_academic_year_id_fkey'),
        ForeignKeyConstraint(['marked_by'], ['jclg_user.user_id'], name='jclg_attendance_marked_by_fkey'),
        ForeignKeyConstraint(['section_id'], ['jclg_section.section_id'], name='jclg_attendance_section_id_fkey'),
        ForeignKeyConstraint(['student_id'], ['jclg_student.student_id'], name='jclg_attendance_student_id_fkey'),
        PrimaryKeyConstraint('attendance_id', name='jclg_attendance_pkey')
    )

    attendance_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    academic_year_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    section_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    attendance_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    marked_by: Mapped[int] = mapped_column(BigInteger, nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    period_no: Mapped[Optional[int]] = mapped_column(SmallInteger)
    remarks: Mapped[Optional[str]] = mapped_column(String(500))

    academic_year: Mapped['JclgAcademicYear'] = relationship('JclgAcademicYear', back_populates='jclg_attendance')
    jclg_user: Mapped['JclgUser'] = relationship('JclgUser', back_populates='jclg_attendance')
    section: Mapped['JclgSection'] = relationship('JclgSection', back_populates='jclg_attendance')
    student: Mapped['JclgStudent'] = relationship('JclgStudent', back_populates='jclg_attendance')


class JclgFeePayment(Base):
    __tablename__ = 'jclg_fee_payment'
    __table_args__ = (
        ForeignKeyConstraint(['fee_structure_id'], ['jclg_fee_structure.fee_structure_id'], name='jclg_fee_payment_fee_structure_id_fkey'),
        ForeignKeyConstraint(['received_by'], ['jclg_user.user_id'], name='jclg_fee_payment_received_by_fkey'),
        ForeignKeyConstraint(['student_id'], ['jclg_student.student_id'], name='jclg_fee_payment_student_id_fkey'),
        PrimaryKeyConstraint('payment_id', name='jclg_fee_payment_pkey')
    )

    payment_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    fee_structure_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    amount_paid: Mapped[decimal.Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    payment_date: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    payment_mode: Mapped[str] = mapped_column(String(30), nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    transaction_reference: Mapped[Optional[str]] = mapped_column(String(150))
    received_by: Mapped[Optional[int]] = mapped_column(BigInteger)

    fee_structure: Mapped['JclgFeeStructure'] = relationship('JclgFeeStructure', back_populates='jclg_fee_payment')
    jclg_user: Mapped[Optional['JclgUser']] = relationship('JclgUser', back_populates='jclg_fee_payment')
    student: Mapped['JclgStudent'] = relationship('JclgStudent', back_populates='jclg_fee_payment')
    jclg_fee_receipt: Mapped[list['JclgFeeReceipt']] = relationship('JclgFeeReceipt', back_populates='payment')


class JclgLeave(Base):
    __tablename__ = 'jclg_leave'
    __table_args__ = (
        ForeignKeyConstraint(['approved_by'], ['jclg_user.user_id'], name='jclg_leave_approved_by_fkey'),
        ForeignKeyConstraint(['student_id'], ['jclg_student.student_id'], name='jclg_leave_student_id_fkey'),
        ForeignKeyConstraint(['user_id'], ['jclg_user.user_id'], name='jclg_leave_user_id_fkey'),
        PrimaryKeyConstraint('leave_id', name='jclg_leave_pkey')
    )

    leave_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    leave_type: Mapped[str] = mapped_column(String(50), nullable=False)
    from_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    to_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    user_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    student_id: Mapped[Optional[int]] = mapped_column(BigInteger)
    approved_by: Mapped[Optional[int]] = mapped_column(BigInteger)
    approved_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))
    remarks: Mapped[Optional[str]] = mapped_column(String(500))

    jclg_user: Mapped[Optional['JclgUser']] = relationship('JclgUser', foreign_keys=[approved_by], back_populates='jclg_leave_approved_by')
    student: Mapped[Optional['JclgStudent']] = relationship('JclgStudent', back_populates='jclg_leave')
    user: Mapped[Optional['JclgUser']] = relationship('JclgUser', foreign_keys=[user_id], back_populates='jclg_leave_user')


class JclgMarks(Base):
    __tablename__ = 'jclg_marks'
    __table_args__ = (
        ForeignKeyConstraint(['entered_by'], ['jclg_user.user_id'], name='jclg_marks_entered_by_fkey'),
        ForeignKeyConstraint(['exam_subject_id'], ['jclg_exam_subject.exam_subject_id'], name='jclg_marks_exam_subject_id_fkey'),
        ForeignKeyConstraint(['student_id'], ['jclg_student.student_id'], name='jclg_marks_student_id_fkey'),
        PrimaryKeyConstraint('marks_id', name='jclg_marks_pkey'),
        UniqueConstraint('exam_subject_id', 'student_id', name='jclg_marks_exam_subject_id_student_id_key')
    )

    marks_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    exam_subject_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    student_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    entered_by: Mapped[int] = mapped_column(BigInteger, nullable=False)
    entered_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    marks_obtained: Mapped[Optional[decimal.Decimal]] = mapped_column(Numeric(6, 2))
    grade: Mapped[Optional[str]] = mapped_column(String(10))
    remarks: Mapped[Optional[str]] = mapped_column(String(500))

    jclg_user: Mapped['JclgUser'] = relationship('JclgUser', back_populates='jclg_marks')
    exam_subject: Mapped['JclgExamSubject'] = relationship('JclgExamSubject', back_populates='jclg_marks')
    student: Mapped['JclgStudent'] = relationship('JclgStudent', back_populates='jclg_marks')


class JclgResult(Base):
    __tablename__ = 'jclg_result'
    __table_args__ = (
        ForeignKeyConstraint(['exam_id'], ['jclg_exam.exam_id'], name='jclg_result_exam_id_fkey'),
        ForeignKeyConstraint(['student_id'], ['jclg_student.student_id'], name='jclg_result_student_id_fkey'),
        PrimaryKeyConstraint('result_id', name='jclg_result_pkey'),
        UniqueConstraint('student_id', 'exam_id', name='jclg_result_student_id_exam_id_key')
    )

    result_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    exam_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    total_marks: Mapped[decimal.Decimal] = mapped_column(Numeric(8, 2), nullable=False)
    marks_obtained: Mapped[decimal.Decimal] = mapped_column(Numeric(8, 2), nullable=False)
    percentage: Mapped[decimal.Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    result_status: Mapped[str] = mapped_column(String(30), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    grade: Mapped[Optional[str]] = mapped_column(String(10))
    rank: Mapped[Optional[int]] = mapped_column(Integer)
    remarks: Mapped[Optional[str]] = mapped_column(String(500))

    exam: Mapped['JclgExam'] = relationship('JclgExam', back_populates='jclg_result')
    student: Mapped['JclgStudent'] = relationship('JclgStudent', back_populates='jclg_result')


class JclgStudentParent(Base):
    __tablename__ = 'jclg_student_parent'
    __table_args__ = (
        ForeignKeyConstraint(['parent_id'], ['jclg_parent.parent_id'], name='jclg_student_parent_parent_id_fkey'),
        ForeignKeyConstraint(['student_id'], ['jclg_student.student_id'], name='jclg_student_parent_student_id_fkey'),
        PrimaryKeyConstraint('student_parent_id', name='jclg_student_parent_pkey'),
        UniqueConstraint('student_id', 'parent_id', name='jclg_student_parent_student_id_parent_id_key')
    )

    student_parent_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    parent_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    relationship_: Mapped[str] = mapped_column('relationship', String(30), nullable=False)
    is_primary: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text('false'))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))

    parent: Mapped['JclgParent'] = relationship('JclgParent', back_populates='jclg_student_parent')
    student: Mapped['JclgStudent'] = relationship('JclgStudent', back_populates='jclg_student_parent')


class JclgFeeReceipt(Base):
    __tablename__ = 'jclg_fee_receipt'
    __table_args__ = (
        ForeignKeyConstraint(['generated_by'], ['jclg_user.user_id'], name='jclg_fee_receipt_generated_by_fkey'),
        ForeignKeyConstraint(['payment_id'], ['jclg_fee_payment.payment_id'], name='jclg_fee_receipt_payment_id_fkey'),
        PrimaryKeyConstraint('receipt_id', name='jclg_fee_receipt_pkey'),
        UniqueConstraint('receipt_number', name='jclg_fee_receipt_receipt_number_key')
    )

    receipt_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    payment_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    receipt_number: Mapped[str] = mapped_column(String(50), nullable=False)
    receipt_date: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    amount: Mapped[decimal.Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    generated_by: Mapped[int] = mapped_column(BigInteger, nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    receipt_url: Mapped[Optional[str]] = mapped_column(Text)

    jclg_user: Mapped['JclgUser'] = relationship('JclgUser', back_populates='jclg_fee_receipt')
    payment: Mapped['JclgFeePayment'] = relationship('JclgFeePayment', back_populates='jclg_fee_receipt')
