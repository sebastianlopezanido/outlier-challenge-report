const jsonist = require('jsonist')

class GradeManager {
    static instance
    grades = []
    constructor() {
        if (!GradeManager.instance) {
            GradeManager.instance = this
        }
        return GradeManager.instance;
    }

    async update() {
        try {
            const url = 'https://outlier-coding-test-data.onrender.com/grades.json'
            const { data, response } = await jsonist.get(url)
            if (response.statusCode !== 200) {
                throw new Error('Error connecting to grades.json')
            }
            this.grades = data
        } catch (error) {
            console.error('Error fetching data')
        }
    }

    getGradeStudent(studentId) {
        const filteredGrades = this.grades.filter(grade => grade.id === parseInt(studentId)).map(({ course, grade }) => ({ course, grade }))
        return filteredGrades
    }

    getCourseStats() {
        const courseStats = {}

        this.grades.forEach(grade => {
            const courseId = grade.course
            const gradeValue = grade.grade

            if (!courseStats[courseId]) {
                courseStats[courseId] = {
                    highestGrade: gradeValue,
                    lowestGrade: gradeValue,
                    totalGrade: gradeValue,
                    studentCount: 1
                }
            } else {
                courseStats[courseId].highestGrade = Math.max(courseStats[courseId].highestGrade, gradeValue)
                courseStats[courseId].lowestGrade = Math.min(courseStats[courseId].lowestGrade, gradeValue)
                courseStats[courseId].totalGrade += gradeValue
                courseStats[courseId].studentCount++
            }
        })

        Object.keys(courseStats).forEach(courseId => {
            const stats = courseStats[courseId]
            stats.averageGrade = (stats.totalGrade / stats.studentCount).toFixed(2)
            delete stats.totalGrade
            delete stats.studentCount
        })

        return courseStats
    }
}

module.exports = {
    GradeManager
}