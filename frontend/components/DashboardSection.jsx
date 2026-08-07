"use client";

import React, { useState, useEffect } from "react";
import { Users, GraduationCap, TrendingUp, BookOpen } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { useLanguage } from "../context/LanguageContext";

const COLORS = ["#2563EB", "#22C55E", "#F59E0B", "#EF4444"];

export default function DashboardSection({ dashboardSummary = {}, performanceData = [], pieData = [] }) {
  const { language, translateText } = useLanguage();

  // State to hold translated UI text
  const [uiText, setUiText] = useState({
    totalStudents: "Total Students",
    totalTeachers: "Total Teachers",
    passPercentage: "Pass Percentage",
    totalClasses: "Total Classes",
    classWisePerf: "Class-wise Performance",
    passFailAnalysis: "Pass vs Fail Analysis"
  });

  // AI Translation Hook
  useEffect(() => {
    const fetchTranslations = async () => {
      if (language === "English" || language === "en") {
        setUiText({
          totalStudents: "Total Students",
          totalTeachers: "Total Teachers",
          passPercentage: "Pass Percentage",
          totalClasses: "Total Classes",
          classWisePerf: "Class-wise Performance",
          passFailAnalysis: "Pass vs Fail Analysis"
        });
        return;
      }

      const [ts, tt, pp, tc, cwp, pfa] = await Promise.all([
        translateText("Total Students"),
        translateText("Total Teachers"),
        translateText("Pass Percentage"),
        translateText("Total Classes"),
        translateText("Class-wise Performance"),
        translateText("Pass vs Fail Analysis")
      ]);

      setUiText({
        totalStudents: ts,
        totalTeachers: tt,
        passPercentage: pp,
        totalClasses: tc,
        classWisePerf: cwp,
        passFailAnalysis: pfa
      });
    };
    fetchTranslations();
  }, [language, translateText]);

  const summary = dashboardSummary || {};

  const safePerformanceData = Array.isArray(performanceData) ? performanceData.map((item, index) => {
    let numVal = 0;
    if (item) {
      const rawVal = item.percentage ?? item.value ?? item.score ?? item.average;
      if (typeof rawVal === 'string') {
        numVal = isNaN(parseFloat(rawVal.replace(/[^0-9.-]/g, ''))) ? 0 : parseFloat(rawVal.replace(/[^0-9.-]/g, ''));
      } else if (typeof rawVal === 'number') {
        numVal = rawVal;
      }
    }
    return { name: item?.class_name || item?.name || `Class ${index + 1}`, value: numVal };
  }) : [];

  const safePieData = Array.isArray(pieData) ? pieData.map((item, index) => ({
    name: item?.name || item?.label || `Item ${index + 1}`, value: Number(item?.value || item?.count) || 0
  })) : [];

  return (
    <>
      <div className="analytics-grid">
        <div className="analytics-card blue">
          <Users size={32} />
          <div><h2>{summary.total_students || 0}</h2><p>{uiText.totalStudents}</p></div>
        </div>
        <div className="analytics-card green">
          <GraduationCap size={32} />
          <div><h2>{summary.total_teachers || 0}</h2><p>{uiText.totalTeachers}</p></div>
        </div>
        <div className="analytics-card purple">
          <TrendingUp size={32} />
          <div><h2>{summary.pass_percentage || 0}%</h2><p>{uiText.passPercentage}</p></div>
        </div>
        <div className="analytics-card orange">
          <BookOpen size={32} />
          <div><h2>{summary.total_classes || 0}</h2><p>{uiText.totalClasses}</p></div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card">
          <h3>{uiText.classWisePerf}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={safePerformanceData}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#fff" }} />
              <Bar dataKey="value" fill="#2563EB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3>{uiText.passFailAnalysis}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={safePieData} dataKey="value" nameKey="name" outerRadius={90} label>
                {safePieData.map((entry, index) => <Cell key={`pie-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
