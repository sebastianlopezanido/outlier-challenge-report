const knex = require('./db')

class Student {
    studentId
    constructor(studentId) { 
        this.studentId = studentId
    }

    async toJson(){
        try {
            return await knex('students').where({ id : this.studentId }).first()
        } catch (error) {
            throw new Error(`Error fetching students data: ${error.message}`)
        }
    }
    
}

module.exports = {
    Student
}