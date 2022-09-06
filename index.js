const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const pool = require('./db');
const dotenv = require('dotenv').config();
const config = require('config');

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

app.use(express.static('build'));
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(morgan(config.get('logger')));

app.get('/', (req, res) => {
  res.send('<h1>phonebook home</h1>').end();
});

app.get('/api/persons', (req, res) => {
  const sql = 'SELECT * FROM persons';

  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const sql = 'SELECT * FROM persons WHERE id = ?';

  pool.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/info', (req, res) => {
  const time = new Date();
  const sql = 'SELECT * FROM persons';

  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.send(`Phonebook has info for ${result.length} people<br>${time.toString()}`);
  });
});

app.post('/api/persons', (req, res) => {
  const id = Math.floor(Math.random() * 10000000);
  const body = req.body;

  const repetNumber = persons.filter(person => person.number === body.number);
  const repetName = persons.filter(person => person.name === body.name);

  if (repetNumber) {
    return res.json({ error: 'Number must be a unique' });
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

app.put('/api/persons/:id', (req, res) => {
  let id = Number(req.params.id);
  const body = req.body;
  const sql = 'UPDATE persons SET ?';

  pool.query(sql, body, (err, result) => {
    if (err) throw err;

    pool.query('SELECT * FROM persons WHERE id = ?', [id], (err, results) => {
      if (err) throw err;

      res.json(results);
    });
  });
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const sql = 'DELETE FROM persons WHERE id= ?';

  pool.query(sql, [id], (err, result) => {
    if (err) throw err;

    res.json(result);
  });
});

const port = process.env.PORT || 3001;
app.listen(port, (req, res) => {
  console.log(`Server running on port ${port}`);
});
