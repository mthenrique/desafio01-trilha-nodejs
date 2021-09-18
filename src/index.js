const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if(!user){
    return response.status(404).json({ error: "User not found!" });
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;
  const userAlreadyExists = users.find((user) => user.username === username);

  if(userAlreadyExists){
    return response.status(400).json({ error: "Username already exists!" });
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };

  users.push(newUser);

  return response.status(201).json(newUser);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;
  
  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  user.todos.push(newTodo);

  return response.status(201).json(newTodo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;

  const todoSelected = user.todos.find((todo) => todo.id === id);

  if(!todoSelected){
    return response.status(404).json({ error: "Todo not found!" });
  }

  todoSelected.title = title;
  todoSelected.deadline = new Date(deadline);

  return response.json(todoSelected);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const todoSelected = user.todos.find((todo) => todo.id === id);

  if(!todoSelected){
    return response.status(404).json({ error: "Mensagem do erro" });
  }

  todoSelected.done = true;
  
  return response.json(todoSelected);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const todoSelected = user.todos.findIndex((todo) => todo.id === id);

  if(todoSelected === -1){
    return response.status(404).json({ error: "Todo not found!"});
  }

  user.todos.splice(todoSelected, 1);
  
  return response.status(204).send();
  
});

module.exports = app;