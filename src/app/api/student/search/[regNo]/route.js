import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  // Use await params to ensure the variable is captured correctly in Next.js 15+
  const { regNo } = await params;

  try {
    const student = await prisma.student.findUnique({
      where: { registrationNo: regNo },
      include: {
        // 1. ADDED: Include the department relation
        department: true, 
        semesters: {
          include: {
            subjects: true,
          },
          orderBy: {
            semesterNo: 'asc',
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { message: "Search failed", error: error.message }, 
      { status: 500 }
    );
  }
}