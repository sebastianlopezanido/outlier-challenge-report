const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

tape('health', async function (t) {
  const url = `${endpoint}/health`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error connecting to sqlite database; did you initialize it by running `npm run init-db`?')
    }
    t.ok(data.success, 'should have successful healthcheck')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('student', async function (t) {
  t.plan(2)
  const student = {
    id: 1,
    first_name: 'Scotty',
    last_name: 'Quigley',
    email: 'Scotty79@hotmail.com',
    is_registered: 1,
    is_approved: 1,
    password_hash: '657907e1fd8e48e2be2aa59031ff8e0f0ecf8694',
    address: '241 Denesik Knolls Apt. 955',
    city: 'Buffalo',
    state: 'ME',
    zip: '04710',
    phone: '1-503-560-6954',
    created: '1628767983203.0',
    last_login: '1628770445749.0',
    ip_address: '2.137.18.155'
  }
  const url = `${endpoint}/student/${student.id}`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error retriving studend data from database')
    }
    t.ok(data, 'Student data should exist')
    t.deepEqual(data.data, student, 'should be spected student')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('student/grades', async function (t) {
  t.plan(2)
  const studentId = 1
  const url = `${endpoint}/student/${studentId}/grades`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error retriving studend grade data from database')
    }
    t.ok(data, 'Student grade data should exist')
    t.ok(data.success, 'should have successful student grade')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('course/grades', async function (t) {
  t.plan(2)
  const url = `${endpoint}/course/all/grades`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error retriving course grade data from database')
    }
    t.ok(data, 'Course grade data should exist')
    t.ok(data.success, 'should have successful course grade')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('cleanup', function (t) {
  server.closeDB()
  server.close()
  t.end()
})
