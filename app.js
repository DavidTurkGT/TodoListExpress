const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const app = express();

let data = { todoList: [
  { complete: true, task: "Get job", id: 0},
  { complete: false, task: "Eat ice cream", id: 1},
  { complete: true, task: "Eat lunch", id: 2}
]
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(express.static('public'));

app.engine('mustache', mustacheExpress());

app.set('views','./views');
app.set('view engine','mustache');

app.get("/", function(req, res){
  res.redirect("/todo");
});

app.get("/todo", function(req, res){
  res.render("index", data);
});

app.post("/todo", function(req, res){
  let newTask = {
    complete: false,
    task: req.body.todo,
    id: data.todoList.length
  };
  data.todoList.push(newTask);

  res.redirect("/todo")
});

app.post("/taskcomplete", function(req, res){
  let taskID = req.body.taskid;
  data.todoList[taskID].complete = true;

  res.redirect("/todo");
});

app.listen(3000, function(){ console.log("App running on localhost:3000") });
