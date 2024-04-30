require('dotenv').config()
const Person = require('../models/person')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

app.use(express.static('dist'))

morgan.token('person', function (req, res) {
  return JSON.stringify(req.body) 
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const filterName = (persons, personName) => {
  const person = persons.find(person => person.name === personName)
  if (person) {
    return true
  }else{
    return false
  }
}

app.get('/info', function(request, response) {
  response.send(`<p>Phonebook has info</p>`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/notes/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', function(request, response) {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.put('/api/persons/:id', function(request, response) {
  const body = request.body
  const person = {
    id: body.id,
    name: body.name,
    number: body.number
  }
  persons[persons.map((x, i) => [i, x]).filter(
    x => x[1].id === id)[0][0]] = person
  response.json(person)
})

app.use(express.json())

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  const person = new Person({
    id: body.id,
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

/*
app.post('/api/persons', function(request, response) {
  const body = request.body
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }
  if(!filterName(persons, person.name) && person.name != ""){
    persons = persons.concat(person)
    response.json(persons)
  }else if(person.name == ""){
    return response.status(400).json({ 
      error: "name mustn't be empty"
    })
  }else{
    return response.status(400).json({ 
      error: "name must be unique"
    })
  }
})
*/