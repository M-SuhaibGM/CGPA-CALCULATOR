"use client";

import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Save, Trash2, Loader2, Building2 } from 'lucide-react';
import { toast } from "sonner";

const StudentEntryPage = () => {
  const { data: session, status } = useSession();
  const [isSaving, setIsSaving] = useState(false);

  const initialStudentInfo = {
    name: '',
    regNo: '',
    currentSemester: '',
    departmentId: '', // Added for Department model
  };

  const initialSubjects = [
    { name: '', marks: '', credits: '', semesterNo: '' }
  ];

  const [studentInfo, setStudentInfo] = useState(initialStudentInfo);
  const [pastSubjects, setPastSubjects] = useState(initialSubjects);

  if (status === "unauthenticated") redirect("/auth/login");

  const handleSubjectChange = (index, field, value) => {
    const updated = [...pastSubjects];
    updated[index][field] = value;
    setPastSubjects(updated);
  };

  const handleSubmit = async () => {
    if (!studentInfo.regNo || !studentInfo.name || !studentInfo.departmentId) {
      toast.error("Please fill in all profile details including Department.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/student/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...studentInfo,
          subjects: pastSubjects
        }),
      });

      if (response.ok) {
        toast.success("Academic Record Saved Successfully!");
        setStudentInfo(initialStudentInfo);
        setPastSubjects(initialSubjects);
      } else {
        const error = await response.json();
        toast.error(`Error: ${error.message}`);
      }
    } catch (err) {
      toast.error("A network error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Welcome, {session?.user?.name}</h1>
        <p className="text-muted-foreground">Manage your student records and academic history.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" /> Basic Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Full Name"
            value={studentInfo.name}
            onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
          />
          <Input
            placeholder="Registration Number"
            value={studentInfo.regNo}
            onChange={(e) => setStudentInfo({ ...studentInfo, regNo: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Semester"
            value={studentInfo.currentSemester}
            onChange={(e) => setStudentInfo({ ...studentInfo, currentSemester: e.target.value })}
          />
          {/* Department Selection */}
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={studentInfo.departmentId}
            onChange={(e) => setStudentInfo({ ...studentInfo, departmentId: e.target.value })}
          >
            <option value="">Select Dept</option>
            <option value="1">Computer Science</option>
            <option value="2">Information Technology</option>
            <option value="3">Software Engineering</option>
          </select>
        </CardContent>
      </Card>

      {/* ... Subject Input Card remains similar to previous version ... */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Academic Subjects</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setPastSubjects([...pastSubjects, { name: '', marks: '', credits: '', semesterNo: '' }])}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Subject
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {pastSubjects.map((subject, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end border-b pb-4">
              <Input type="number" placeholder="Sem #" value={subject.semesterNo} onChange={(e) => handleSubjectChange(index, 'semesterNo', e.target.value)} />
              <Input className="md:col-span-2" placeholder="Subject Name" value={subject.name} onChange={(e) => handleSubjectChange(index, 'name', e.target.value)} />
              <Input type="number" placeholder="Marks" value={subject.marks} onChange={(e) => handleSubjectChange(index, 'marks', e.target.value)} />
              <div className="flex gap-2">
                <Input type="number" placeholder="Credits" value={subject.credits} onChange={(e) => handleSubjectChange(index, 'credits', e.target.value)} />
                <Button variant="destructive" size="icon" onClick={() => setPastSubjects(pastSubjects.filter((_, i) => i !== index))} disabled={pastSubjects.length === 1}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Academic Record
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentEntryPage;