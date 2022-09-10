// require express dependencies and libraries to run our app
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const TodoTask = require("./models/TodoTask");

// use our environment variables
dotenv.config();

// use the static style spreadsheet to access css code
app.use("/static", express.static("public"))

// allow us to extract data from the form by adding it to the request object
app.use(express.urlencoded({ extended: true }));

// enable connection to db and notify us when connected
mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => {
      console.log("Connected to db!");
      app.listen(3000, () => console.log("Server Up and running"));
    }
  );

// use .ejs files as a template
app.set("view engine", "ejs");

// when entering the index page, send hello world as a string to the rseult
app.get('/',(req, res) => {
    res.render('todo.ejs');
});

//POST METHOD
app.post('/',async (req, res) => {
    // create a new task item and try to save it to our database, throw error if there is an error and send us back to root page
    const todoTask = new TodoTask({
    content: req.body.content
    });
    try {
    await todoTask.save();
    res.redirect("/");
    } catch (err) {
    res.redirect("/");
    }
    });

// GET METHOD, just render the todo.ejs template html page
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
    });
});

//UPDATE and have a new page route called /edit/[:id]
app.route("/edit/:id").get((req, res) => {
    const id = req.params.id;
    // render new page with tasks but this time with idTask of the one selected
    TodoTask.find({}, (err, tasks) => {
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
}).post((req, res) => {
    const id = req.params.id;
    // update todo task item based on id and updating the content, throw error if there is and send us back to root page
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
    if (err) return res.send(500, err);
        res.redirect("/");
    });
});

//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    // for the TodoTask model, find the id and remove it using the function, and throw and error if there's an error
    TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/"); // send back to root page
    });
    });
    