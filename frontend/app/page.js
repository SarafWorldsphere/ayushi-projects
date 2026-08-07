"use client";

import { useEffect, useState, useRef } from "react";
import useAuthGuard from "@/hooks/useAuthGuard";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import DashboardSection from "../components/DashboardSection";
import StudentsSection from "../components/StudentsSection";
import TeachersSection from "../components/TeachersSection";
import ProgressSection from "../components/ProgressSection";
import NotificationsSection from "../components/NotificationsSection";
import FunctionsSection from "../components/FunctionsSection";
import ToursSection from "../components/ToursSection";
import ClassTeachersSection from "../components/ClassTeachersSection";
import Header from '../components/Header';
import { useLanguage } from '../context/LanguageContext';

// ================= API SETUP =================
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
});

// ================= MAIN PAGE =================
export default function HomePage() {
  const isCheckingAuth = useAuthGuard();
  const fetched = useRef(false);

  const { translateText } = useLanguage();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [classTeachers, setClassTeachers] = useState([]);
  const [functionsData, setFunctionsData] = useState([]);
  const [toursData, setToursData] = useState([]);

  const [dashboardSummary, setDashboardSummary] = useState({});
  const [performanceData, setPerformanceData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [headmaster, setHeadmaster] = useState(null);

  const [unreadCount, setUnreadCount] = useState(0);
  const [searchText, setSearchText] = useState("");

  const [loaded, setLoaded] = useState({
    students: false,
    teachers: false,
    performance: false, // CHANGED from progress to performance
    notifications: false,
    functions: false,
    tours: false,
    classTeachers: false,
  });

  // ================= DASHBOARD LOAD =================
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get("/dashboard/");
        const data = res.data;

        setDashboardSummary(data.summary || {});
        setPerformanceData(data.performance || []);
        setPieData(data.pass_fail || []);
        setHeadmaster(data.headmaster || null);
        setUnreadCount(data.unread_count || 0);
      } catch (err) {
        console.error("Dashboard API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // ================= TAB HANDLER =================
  const handleTabChange = async (tab) => {
    setActiveTab(tab);

    try {
      setLoading(true);

      if (tab === "students" && !loaded.students) {
        const res = await api.get("/students/");
        setStudents(res.data || []);
        setLoaded((p) => ({ ...p, students: true }));
      }

      if (tab === "teachers" && !loaded.teachers) {
        const res = await api.get("/teachers/");
        setTeachers(res.data || []);
        setLoaded((p) => ({ ...p, teachers: true }));
      }

      // --> FIXED: Cleaned up logic to ONLY look for "performance"
      if (tab === "performance" && !loaded.performance) {
        const res = await api.get("/students/progress");
        setProgressData(res.data || []);
        setLoaded((p) => ({ ...p, performance: true }));
      }

      if (tab === "notifications" && !loaded.notifications) {
        const res = await api.get("/notifications/");
        setNotifications(res.data || []);
        setLoaded((p) => ({ ...p, notifications: true }));
      }

      if (tab === "functions" && !loaded.functions) {
        const res = await api.get("/functions/");
        setFunctionsData(res.data || []);
        setLoaded((p) => ({ ...p, functions: true }));
      }

      if (tab === "tours" && !loaded.tours) {
        const res = await api.get("/tours/");
        setToursData(res.data || []);
        setLoaded((p) => ({ ...p, tours: true }));
      }

      if (tab === "classTeachers" && !loaded.classTeachers) {
        const res = await api.get("/class-teachers/");
        setClassTeachers(res.data || []);
        setLoaded((p) => ({ ...p, classTeachers: true }));
      }

    } catch (err) {
      console.error("Tab API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= SEARCH =================
  const searchItems = (items, keys) => {
    if (!searchText.trim()) return items || [];
    const search = searchText.toLowerCase();
    return (items || []).filter((item) =>
      keys.some((key) =>
        String(item?.[key] || "")
          .toLowerCase()
          .includes(search)
      )
    );
  };

  // ================= UI =================
  return (
    <>
    <div className="layout">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

      <div className="main-content">
        <Topbar
          headmaster={headmaster}
          searchText={searchText}
          setSearchText={setSearchText}
          notificationCount={unreadCount}
          translateText={translateText}
        />

        {loading && (
          <div style={{ padding: "10px" }}>
            Loading...
          </div>
        )}

        {activeTab === "dashboard" && (
          <DashboardSection
            dashboardSummary={dashboardSummary}
            performanceData={performanceData}
            pieData={pieData}
          />
        )}

        {activeTab === "students" && (
          <StudentsSection
            students={students}
            searchText={searchText}
            loaded={loaded.students}
          />
        )}

        {activeTab === "teachers" && (
          <TeachersSection
            teachers={searchItems(teachers, [
              "full_name",
              "subject_name",
              "teacher_id",
              "role",
              "email_id",
              "phone",
            ])}
          />
        )}

        {/* --> FIXED: Cleaned up the render condition to ONLY look for "performance" */}
        {activeTab === "performance" && (
          <ProgressSection
            progressData={searchItems(progressData, [
              "full_name",
              "exam_name",
              "subject_name",
              "grade",
              "remarks",
            ])}
          />
        )}

        {activeTab === "notifications" && (
          <NotificationsSection
            notifications={searchItems(notifications, [
              "notice_title",
              "notice_text",
              "notice_date",
            ])}
            loaded={loaded.notifications}
          />
        )}

        {activeTab === "functions" && (
          <FunctionsSection
            functionsData={searchItems(functionsData, [
              "function_name",
              "description",
            ])}
          />
        )}

        {activeTab === "tours" && (
          <ToursSection
            toursData={searchItems(toursData, [
              "tour_name",
              "destination",
            ])}
          />
        )}

        {activeTab === "classTeachers" && (
          <ClassTeachersSection
            classTeachers={searchItems(classTeachers, [
              "teacher_name",
              "class_name",
            ])}
          />
        )}
      </div>
    </div>
  </>
  );
}
