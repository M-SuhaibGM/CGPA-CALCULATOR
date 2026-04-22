"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, GraduationCap, User, Loader2, Building2, BadgeCheck } from 'lucide-react';
import { toast } from "sonner";

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);

  // Helper to convert marks to Letter Grade for the UI
  /**
   * @param {number} marks
   * @returns {{ grade: string, color: string }}
   */
  const getLetterGrade = (marks) => {
    if (marks >= 80) return { grade: "A", color: "text-green-600" };
    if (marks >= 70) return { grade: "B", color: "text-blue-600" };
    if (marks >= 60) return { grade: "C", color: "text-yellow-600" };
    if (marks >= 50) return { grade: "D", color: "text-orange-600" };
    return { grade: "F", color: "text-red-600" };
  };

  const handleSearch = async () => {
    if (!query) return toast.error("Please enter a registration number");

    setLoading(true);
    setStudent(null);

    try {
      const res = await fetch(`/api/student/search/${query}`);
      const data = await res.json();

      if (res.ok) {
        setStudent(data);
        toast.success("Record found!");
      } else {
        toast.error(data.message || "No record found");
      }
    } catch (err) {
      toast.error("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Search Header */}
      <div className="flex flex-col items-center space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Student Record Search</h1>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input 
            placeholder="Registration Number..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading} className="bg-blue-600">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {student && (
        <div className="space-y-6">
          {/* Enhanced Profile Overview Card */}
          <Card className="bg-slate-50 border-blue-200 shadow-sm">
            <CardHeader className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="bg-blue-600 p-4 rounded-xl text-white shadow-md w-fit">
                <User size={32} />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-3xl font-extrabold">{student.name}</CardTitle>
                <div className="flex flex-wrap gap-4 text-sm font-medium">
                   <div className="flex items-center gap-1.5 text-slate-600">
                      <BadgeCheck className="h-4 w-4 text-blue-500" />
                      <span>{student.registrationNo}</span>
                   </div>
                   {/* SHOWING DEPARTMENT HERE */}
                   <div className="flex items-center gap-1.5 text-slate-600">
                      <Building2 className="h-4 w-4 text-blue-500" />
                      <span>{student.department?.name || "General Department"}</span>
                   </div>
                </div>
              </div>
              <div className="md:ml-auto flex flex-col items-start md:items-end gap-1 border-l md:border-l-0 md:border-r-4 border-blue-600 pl-4 md:pr-4">
                <p className="text-xs uppercase tracking-wider font-bold text-slate-500">Current Progress</p>
                <p className="text-2xl font-black text-blue-700">Semester {student.currentSemester}</p>
              </div>
            </CardHeader>
          </Card>

          {/* Semesters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {student.semesters.map((sem) => (
              <Card key={sem.id} className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow">
                <CardHeader className="bg-white border-b flex flex-row justify-between items-center py-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    <span className="font-bold text-slate-800">Semester {sem.semesterNo}</span>
                  </div>
                  {/* SHOWING SEMESTER GPA */}
                  <div className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    <span className="text-xs font-bold text-blue-600 mr-1">GPA:</span>
                    <span className="text-sm font-black text-blue-800">{sem.semesterCgpa.toFixed(2)}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {sem.subjects.map((sub) => {
                      const gradeData = getLetterGrade(sub.marks);
                      return (
                        <div key={sub.id} className="flex justify-between items-center text-sm pb-2 border-b border-slate-100 last:border-0">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-700">{sub.name}</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Credits: {sub.credits}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xs font-bold text-slate-500">Marks</p>
                              <p className="font-mono font-bold">{sub.marks}</p>
                            </div>
                            {/* SHOWING GRADE HERE */}
                            <div className={`w-10 h-10 flex items-center justify-center rounded-lg bg-slate-50 border font-black text-lg ${gradeData.color}`}>
                              {gradeData.grade}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!student && !loading && (
        <div className="py-20 text-center border-2 border-dashed rounded-2xl bg-slate-50/50">
          <p className="text-slate-400 font-medium">Search for a registration number to view results</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;