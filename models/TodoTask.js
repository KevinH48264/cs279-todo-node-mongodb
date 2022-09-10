// import mongoose
const mongoose = require('mongoose');

// define the database columns for todo task
const todoTaskSchema = new mongoose.Schema({
content: {
type: String,
required: true
},
date: {
type: Date,
default: Date.now
}
})

// export using mongoose
module.exports = mongoose.model('TodoTask',todoTaskSchema);