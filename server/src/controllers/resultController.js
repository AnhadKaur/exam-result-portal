const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Helper function to calculate grade
const calculateGrade = (marks, totalMarks) => {
  const percentage = (marks / totalMarks) * 100;
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

// Helper function to determine pass/fail
const determineStatus = (marks, totalMarks) => {
  const percentage = (marks / totalMarks) * 100;
  return percentage >= 40 ? 'pass' : 'fail';
};

// Get all results with filters
const getResults = async (req, res) => {
  try {
    const { year, semesterId, examType, studentId } = req.query;

    let where = {};

    // Filter by student if provided
    if (studentId) {
      where.studentId = parseInt(studentId);
    }

    // Filter by year (for current user if student)
    if (year) {
      // This would require joining with student and semester
      // We'll handle basic filtering here
    }

    // Filter by exam type
    if (examType) {
      where.exam = { examType };
    }

    // Filter by semester
    if (semesterId) {
      where.exam = {
        ...where.exam,
        semesterId: parseInt(semesterId)
      };
    }

    const results = await prisma.result.findMany({
      where,
      include: {
        student: {
          include: {
            user: true
          }
        },
        subject: true,
        exam: {
          include: {
            semester: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching results', error: error.message });
  }
};

// Get results for current user (student)
const getMyResults = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.userId }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student record not found' });
    }

    const results = await prisma.result.findMany({
      where: { studentId: student.id },
      include: {
        student: {
          include: {
            user: true
          }
        },
        subject: true,
        exam: {
          include: {
            semester: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your results', error: error.message });
  }
};

// Add result (Faculty only)
const addResult = async (req, res) => {
  try {
    const { studentId, subjectId, examId, marks } = req.body;

    // Validate input
    if (!studentId || !subjectId || !examId || marks === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Get exam to know total marks
    const exam = await prisma.exam.findUnique({
      where: { id: examId }
    });

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Validate marks
    if (marks < 0 || marks > exam.totalMarks) {
      return res.status(400).json({ message: `Marks must be between 0 and ${exam.totalMarks}` });
    }

    // Check if result already exists
    const existingResult = await prisma.result.findUnique({
      where: {
        studentId_subjectId_examId: {
          studentId: parseInt(studentId),
          subjectId: parseInt(subjectId),
          examId: parseInt(examId)
        }
      }
    });

    if (existingResult) {
      return res.status(400).json({ message: 'Result already exists for this combination' });
    }

    // Calculate grade and status
    const grade = calculateGrade(marks, exam.totalMarks);
    const status = determineStatus(marks, exam.totalMarks);

    // Create result
    const result = await prisma.result.create({
      data: {
        marks: parseFloat(marks),
        grade,
        status,
        studentId: parseInt(studentId),
        subjectId: parseInt(subjectId),
        examId: parseInt(examId),
        userId: req.userId
      },
      include: {
        student: true,
        subject: true,
        exam: true
      }
    });

    res.status(201).json({
      message: 'Result added successfully',
      result
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding result', error: error.message });
  }
};

// Update result (Faculty only)
const updateResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { marks } = req.body;

    if (marks === undefined) {
      return res.status(400).json({ message: 'Marks are required' });
    }

    // Find result
    const result = await prisma.result.findUnique({
      where: { id: parseInt(id) },
      include: { exam: true }
    });

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    // Validate marks
    if (marks < 0 || marks > result.exam.totalMarks) {
      return res.status(400).json({ message: `Marks must be between 0 and ${result.exam.totalMarks}` });
    }

    // Calculate new grade and status
    const grade = calculateGrade(marks, result.exam.totalMarks);
    const status = determineStatus(marks, result.exam.totalMarks);

    // Update result
    const updatedResult = await prisma.result.update({
      where: { id: parseInt(id) },
      data: {
        marks: parseFloat(marks),
        grade,
        status
      },
      include: {
        student: true,
        subject: true,
        exam: true
      }
    });

    res.json({
      message: 'Result updated successfully',
      result: updatedResult
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating result', error: error.message });
  }
};

// Delete result (Faculty only)
const deleteResult = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await prisma.result.findUnique({
      where: { id: parseInt(id) }
    });

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    await prisma.result.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting result', error: error.message });
  }
};

// Get statistics for results
const getResultsStats = async (req, res) => {
  try {
    const { semesterId } = req.query;

    let where = {};
    if (semesterId) {
      where.exam = { semesterId: parseInt(semesterId) };
    }

    const results = await prisma.result.findMany({
      where,
      include: { exam: true }
    });

    const stats = {
      totalResults: results.length,
      passCount: results.filter(r => r.status === 'pass').length,
      failCount: results.filter(r => r.status === 'fail').length,
      averageMarks: results.length > 0 ? (results.reduce((sum, r) => sum + r.marks, 0) / results.length).toFixed(2) : 0,
      gradeDistribution: {
        A: results.filter(r => r.grade === 'A').length,
        B: results.filter(r => r.grade === 'B').length,
        C: results.filter(r => r.grade === 'C').length,
        D: results.filter(r => r.grade === 'D').length,
        F: results.filter(r => r.grade === 'F').length
      }
    };

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};

module.exports = {
  getResults,
  getMyResults,
  addResult,
  updateResult,
  deleteResult,
  getResultsStats
};
