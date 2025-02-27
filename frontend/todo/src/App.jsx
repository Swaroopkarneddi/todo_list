import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UndoIcon from "@mui/icons-material/Undo";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("low");

  useEffect(() => {
    axios
      .get("http://localhost:8000/todos")
      .then((response) => setTodos(response.data))
      .catch((error) => console.error(error));
  }, []);

  const addTodo = () => {
    if (!text.trim() || !category.trim()) return;
    axios
      .post("http://localhost:8000/todos", { text, category, priority })
      .then((response) => {
        setTodos([...todos, response.data]);
        setText("");
        setCategory("");
        setPriority("low");
      })
      .catch((error) => console.error(error));
  };

  const toggleComplete = (id, completed) => {
    axios
      .patch(`http://localhost:8000/todos/${id}`, { completed: !completed })
      .then((response) => {
        setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      })
      .catch((error) => console.error(error));
  };

  const deleteTodo = (id) => {
    axios
      .delete(`http://localhost:8000/todos/${id}`)
      .then(() => setTodos(todos.filter((todo) => todo._id !== id)))
      .catch((error) => console.error(error));
  };

  const deleteCategory = (category) => {
    axios
      .delete(`http://localhost:8000/todos/category/${category}`)
      .then(() => setTodos(todos.filter((todo) => todo.category !== category)))
      .catch((error) => console.error(error));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ff4d4d"; // Red
      case "medium":
        return "#ffbb33"; // Orange
      case "low":
        return "#66cc66"; // Green
      default:
        return "#f0f0f0"; // Gray
    }
  };

  const groupedTodos = todos.reduce((groups, todo) => {
    const group = groups[todo.category] || [];
    group.push(todo);
    groups[todo.category] = group;
    return groups;
  }, {});

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" gutterBottom align="center">
        Todo List
      </Typography>

      <TextField
        label="New Todo"
        value={text}
        onChange={(e) => setText(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Priority</InputLabel>
        <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <MenuItem value="low">Low Priority</MenuItem>
          <MenuItem value="medium">Medium Priority</MenuItem>
          <MenuItem value="high">High Priority</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={addTodo}
        fullWidth
        sx={{
          backgroundColor: "#1976d2",
          "&:hover": {
            backgroundColor: "#1565c0",
          },
        }}
      >
        Add Todo
      </Button>

      {Object.entries(groupedTodos).map(([category, todos]) => (
        <Paper
          key={category}
          elevation={3}
          sx={{ margin: "20px 0", padding: "10px" }}
        >
          <Typography variant="h5">{category}</Typography>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={() => deleteCategory(category)}
            sx={{ marginBottom: "10px" }}
          >
            Delete All in Category
          </Button>
          <List>
            {todos.map((todo) => (
              <ListItem
                key={todo._id}
                dense
                sx={{
                  backgroundColor: getPriorityColor(todo.priority),
                  borderRadius: "5px",
                  marginBottom: "10px",
                  padding: "10px",
                }}
              >
                <ListItemText
                  primary={todo.text}
                  secondary={todo.priority}
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => toggleComplete(todo._id, todo.completed)}
                    color="primary"
                  >
                    {todo.completed ? <UndoIcon /> : <CheckCircleIcon />}
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => deleteTodo(todo._id)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      ))}
    </Container>
  );
};

export default App;
