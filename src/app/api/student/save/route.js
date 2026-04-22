import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const calculateGPA = (marks) => {
  const m = parseInt(marks);
  if (m >= 80) return 4.0;
  if (m >= 70) return 3.0;
  if (m >= 60) return 2.0;
  if (m >= 50) return 1.0;
  return 0.0;
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, regNo, currentSemester, departmentId, subjects } = body;

    const result = await prisma.$transaction(async (tx) => {
      
      // 1. FIX: Ensure Department exists to avoid Foreign Key Error
      // If the ID isn't found, it creates a placeholder
      const deptId = parseInt(departmentId) || 1;
      await tx.department.upsert({
        where: { id: deptId },
        update: {}, 
        create: {
          id: deptId,
          name: "Department " + deptId,
          code: "DEPT" + deptId
        }
      });

      // 2. Upsert Student
      const student = await tx.student.upsert({
        where: { registrationNo: regNo },
        update: { 
          name, 
          currentSemester: parseInt(currentSemester),
          departmentId: deptId
        },
        create: {
          name,
          registrationNo: regNo,
          currentSemester: parseInt(currentSemester),
          departmentId: deptId,
        },
      });

      // 3. CLEANUP: Delete old semester data for this student 
      // This prevents duplicate records when you click "Save" multiple times
      await tx.semester.deleteMany({
        where: { studentId: student.id }
      });

      // 4. Group and Create new Data
      const uniqueSemesters = [...new Set(subjects.map(s => s.semesterNo))];

      for (const semNo of uniqueSemesters) {
        const semSubjects = subjects.filter(s => s.semesterNo === semNo);
        
        let totalPoints = 0;
        let totalCredits = 0;
        semSubjects.forEach(s => {
          totalPoints += calculateGPA(s.marks) * parseInt(s.credits);
          totalCredits += parseInt(s.credits);
        });
        const semesterGPA = totalCredits > 0 ? (totalPoints / totalCredits) : 0;

        await tx.semester.create({
          data: {
            semesterNo: parseInt(semNo),
            semesterCgpa: semesterGPA,
            studentId: student.id,
            subjects: {
              create: semSubjects.map(s => ({
                name: s.name,
                marks: parseInt(s.marks),
                credits: parseInt(s.credits)
              }))
            }
          }
        });
      }
      return student;
    });

    return NextResponse.json({ message: "Success", data: result }, { status: 200 });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { message: "Failed to save data", error: error.message }, 
      { status: 500 }
    );
  }
}