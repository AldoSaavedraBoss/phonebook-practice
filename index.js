const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
  {
    name: 'aldo',
    number: '5',
    id: 5,
  },
];

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

app.use(express.json());
app.use(cors());
app.use(express.static('build'));
app.use(requestLogger);
app.use(morgan('tiny'));

app.get('/', (req, res) => {
  res.send('<h1>phonebook home</h1>').end();
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (!person) {
    return res.status(404).end();
  }

  res.json(person);
});

app.get('/info', (req, res) => {
  const len = persons.length;
  const time = new Date();

  res.send(`Phonebook has info for ${len} people<br>${time.toString()}`);
});

app.post('/api/persons', (req, res) => {
  const id = Math.floor(Math.random() * 10000000);
  const body = req.body;

  const repetNumber = persons.filter(person => person.number === body.number);
  const repetName = persons.filter(person => person.name === body.name);

  if (repetNumber) {
    return res.json({ error: 'Number must be a unique' });
  }
  if (repetName) {
    return res.json({ error: 'Name must be a unique' });
  }

  if (!body.name || !body.number) {
    return res.json({ error: 'Missing data' }).end();
  }

  const person = {
    id: id,
    name: body.name,
    number: body.number,
  };

  persons.concat(person);
  res.status(200).json(person).end();
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(404).end();
});

const port = process.env.PORT || 3001;
app.listen(port, (req, res) => {
  console.log(`Server running on port ${port}`);
});
