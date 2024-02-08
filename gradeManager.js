const axios = require('axios')
const { parser } = require('stream-json')
const { chain } = require('stream-chain')
const {streamArray} = require('stream-json/streamers/StreamArray')

class GradeManager {
  static instance
  grades = []
  courseStats = {}
  constructor() {
    if (!GradeManager.instance) {
      GradeManager.instance = this
    }
    return GradeManager.instance
  }

  async update() {
    try {
      const grades = []
      const courseStats = {}
      const response = await axios({
        method: "get",
        url: "https://outlier-coding-test-data.onrender.com/grades.json",
        responseType: "stream",
      })
      const pipeline = chain([response.data, parser(), streamArray()])
      return new Promise((resolve, reject) => {
        pipeline.on("data", (data) => {
          grades.push(data.value)
          const courseId = data.value.course
          const gradeValue = data.value.grade
          if (!courseStats[courseId]) {
            courseStats[courseId] = {
              highestGrade: gradeValue,
              lowestGrade: gradeValue,
              totalGrade: gradeValue,
              studentCount: 1
            }
          } else {
            courseStats[courseId].highestGrade = Math.max(
              courseStats[courseId].highestGrade,
              gradeValue
            )
            courseStats[courseId].lowestGrade = Math.min(
              courseStats[courseId].lowestGrade,
              gradeValue
            )
            courseStats[courseId].totalGrade += gradeValue
            courseStats[courseId].studentCount++
          }
        })
        pipeline.on("end", (...args) => {
          console.log("end updating grade", args)
          this.grades = grades
          this.courseStats = courseStats
          resolve(args)
        })
        pipeline.on("error", reject)
      })   
    } catch (error) {
      console.error("Error downloading the JSON file:", error)
    }
  }

  getGradeStudent(studentId) {
    const filteredGrades = this.grades.filter(grade => grade.id === parseInt(studentId)).map(({ course, grade }) => ({ course, grade }))
    return filteredGrades
}

  getCourseStats() {
    const courseStats = this.courseStats
    return courseStats
  }
}

module.exports = {
  GradeManager,
}
