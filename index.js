const express = require('express');
const app = express();
const cors = require('cors');

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocal',
    important: true,
  },
];

app.use(express.json());
app.use(cors());

const welcome = `
  <h1>Welcome, to Notes</h1>
  <p>Your notes display here</p>
`;

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

app.use(requestLogger);

app.use(express.static('dist'));

app.get('/', (request, response) => {
  response.send(welcome);
});

app.get('/api/notes', (request, response) => {
  response.json(notes);
  console.log(notes);
});

app.get('/api/notes/:id', (request, response) => {
  const id = parseInt(request.params.id, 10);
  const note = notes.find(note => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/notes/:id', (request, response) => {
  const id = parseInt(request.params.id, 10);
  notes = notes.filter(note => note.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0;
  return String(maxId + 1);
};

app.post('/api/notes', (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    });
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndPoint);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
