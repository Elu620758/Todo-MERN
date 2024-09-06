//express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//create an instance of express
const app = express();
app.use(express.json());
app.use(cors());

//enableing dotenv
require('dotenv').config();
//sample in-memory storage for todo item
let todos = [];
//mongodb connection
const Mongurl = process.env.MONGO_DB_URL
mongoose.connect(Mongurl)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('DB error', err));
//creating schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})
//creating model
const todoModel = mongoose.model('Todo', todoSchema)
//create a  new todo item
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    try {
        const newTodo = new todoModel({ title, description });
        await newTodo.save();
        res.status(201).json(newTodo)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})
//get all items
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})
//update a todo item
app.put("/todos/:id", async (req, res) => {
    try {
        const { title, description } = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        )
        if (!updatedTodo) {
            return res.status(404).json({ message: "todo not found" })
        }
        res.json(updatedTodo)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})
//delete a todo item
app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})
//start the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`server listening to the port ${port}`)
})