const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const jsonfile = require('jsonfile');

const app = express();

let data = {
  todoList: [],
  error: ""
};

jsonfile.readFile('data.json',function(err,obj){
  // console.dir(obj);
  data.todoList = obj.todoList;
});

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
  // console.log("Data: ", data);
  res.render("index", data);
  data.error = "";
});

app.post("/todo", function(req, res){
  req.checkBody("todo","!! Error: no todo item added !!").notEmpty();

  if(req.validationErrors()){
  data.error = req.validationErrors()[0].msg;
  }

  if(!data.error){
    let newTask = {
      complete: false,
      task: req.body.todo,
      id: data.todoList.length
    };
    data.todoList.push(newTask);
    jsonfile.writeFile('data.json', data, function(err){
      console.error(err);
    });
  }
  res.redirect("/todo")
});

app.post("/taskcomplete", function(req, res){
  let taskID = req.body.taskid;
  data.todoList[taskID].complete = true;
  jsonfile.writeFile('data.json', data, function(err){
    console.error(err);
  });
  res.redirect("/todo");
});

app.listen(3000, function(){ console.log("App running on localhost:3000") });
