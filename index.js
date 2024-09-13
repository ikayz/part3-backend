const express = require('express');
const app = express();

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

const welcome = `
  <h1>Welcome, to Notes</h1>
  <p>Your notes display here</p>
`;

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

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
