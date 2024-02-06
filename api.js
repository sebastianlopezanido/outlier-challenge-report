const knex = require('./db')
const { Student } = require('./student.js')
const { GradeManager } = require('./gradeManager.js')
require('./worker.js')

module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport
}

async function getHealth (req, res, next) {
  try {
    await knex('students').first()
    res.json({ success: true })
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function getStudent (req, res, next) {
  try {
    const student = new Student(req.params.id)
    const studentData = await student.toJson()
    if (!studentData) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      })
    }
    res.status(200).json({
      success: true,
      data: studentData
    })
  } catch (error) {
    next(error)
  }
}

async function getStudentGradesReport (req, res, next) {
  try {
    const student = new Student(req.params.id)
    const studentData = await student.toJson()
    if (!studentData) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      })
    }
    const grandManager = new GradeManager()
    const filteredGrades = grandManager.getGradeStudent(req.params.id)
    const report = {
      success: true,
      data: {
        student: studentData,
        grades: filteredGrades
      }
    }
    res.status(200).json(report)
  } catch (error) {
    next(error)
  }
}

async function getCourseGradesReport (req, res, next) {
  try {
    const grandManager = new GradeManager()
    const courseStats = grandManager.getCourseStats()
    res.status(200).json({ success: true, data: courseStats })
  } catch (error) {
    next(error)
  }
}
