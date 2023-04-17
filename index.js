const http = require('http')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})

let persons = [
  {
    "name": "Arto Hellas",
    "number": "123",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  console.log(req)
  res.send(`<div>Phonebook has info for ${persons.length} people</div><p>${Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const person = req.body

  if (!person.name || !person.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }

  const checkIfNameExists = persons.find(e => e.name === person.name)
  if (checkIfNameExists) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const min = persons.length + 1
  const max = 1000
  function getNewId(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
  }
  person.id = getNewId(min, max)
  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
