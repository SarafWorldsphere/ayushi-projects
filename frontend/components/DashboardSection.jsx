"use client";

import React, { useState, useEffect } from "react";
import { Users, GraduationCap, TrendingUp, BookOpen } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useLanguage } from "../context/LanguageContext";
import TranslatedText from "./TranslatedText";

const COLORS = ["#2563EB", "#22C55E", "#F59E0B", "#EF4444"];

export default function DashboardSection({
  dashboardSummary = {},
  performanceData = [],
  pieData = [],
}) {
  const { language, translateText } = useLanguage();

  // State to hold all our translatable text labels
  const [labels, setLabels] = useState({
    students: "Total Students",
    teachers: "Total Teachers",
    pass: "Pass Percentage",
    classes: "Total Classes",
    perfChart: "Class-wise Performance",
    passChart: "Pass vs Fail Analysis",
  });

  // Trigger translation when the language changes
  useEffect(() => {
    async function fetchTranslations() {
      if (!translateText) return;

      const tStudents = await translateText("Total Students");
      const tTeachers = await translateText("Total Teachers");
      const tPass = await translateText("Pass Percentage");
      const tClasses = await translateText("Total Classes");
      const tPerfChart = await translateText("Class-wise Performance");
      const tPassChart = await translateText("Pass vs Fail Analysis");

      setLabels({
        students: tStudents,
        teachers: tTeachers,
        pass: tPass,
        classes: tClasses,
        perfChart: tPerfChart,
        passChart: tPassChart,
      });
    }

    fetchTranslations();
  }, [language, translateText]);

  return (
    <>
      <div className="analytics-grid">
        <div className="analytics-card blue">
          <Users size={32} />
          <div>
            <h2>{dashboardSummary.total_students || 0}</h2>
            <p>{labels.students}</p>
          </div>
        </div>

        <div className="analytics-card green">
          <GraduationCap size={32} />
          <div>
            <h2>{dashboardSummary.total_teachers || 0}</h2>
            <p>{labels.teachers}</p>
          </div>
        </div>

        <div className="analytics-card purple">
          <TrendingUp size={32} />
          <div>
            <h2>{dashboardSummary.pass_percentage || 0}%</h2>
            <p>{labels.pass}</p>
          </div>
        </div>

        <div className="analytics-card orange">
          <BookOpen size={32} />
          <div>
            <h2>{dashboardSummary.total_classes || 0}</h2>
            <p>{labels.classes}</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card">
          <h3>{labels.perfChart}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <XAxis dataKey="class_name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#fff" }} />
              <Bar dataKey="percentage" fill="#2563EB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>{labels.passChart}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`pie-${entry.name || index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
