import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err.message));

// Todo Schema
const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  category: String,
  priority: String, // "high", "medium", "low"
});

const Todo = mongoose.model("Todo", todoSchema);

// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new todo
app.post("/todos", async (req, res) => {
  const { text, category, priority } = req.body;
  try {
    const newTodo = new Todo({ text, completed: false, category, priority });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mark a todo as completed
app.patch("/todos/:id", async (req, res) => {
  const { completed } = req.body;
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a single todo
app.delete("/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete all todos in a category (delete group)
app.delete("/todos/category/:category", async (req, res) => {
  try {
    await Todo.deleteMany({ category: req.params.category });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
