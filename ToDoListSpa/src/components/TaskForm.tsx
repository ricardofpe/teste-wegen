import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  IconButton,
} from "@mui/material";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import api from "../api/api";

interface Task {
  id?: number;
  title: string;
  description: string;
  category: string;
  isCompleted: boolean;
}

const TaskForm = () => {
  const [task, setTask] = useState<Task>({
    title: "",
    description: "",
    category: "",
    isCompleted: false,
  });

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fetchTask = async (taskId: string) => {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      setTask(response.data);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTask(id);
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (id) {
        await api.put(`/tasks/${id}`, task);
      } else {
        await api.post("/tasks", task);
      }
      navigate("/tasks");
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <Box
      sx={{
        mx: "auto",
        height: "100vh",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        maxWidth: 600,
        backgroundColor: "#f9f9f9",
        p: 3,
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
        }}
      >
        <IconButton
          onClick={() => navigate("/tasks")}
          sx={{ color: "#1976d2", mr: 2 }}
        >
          <FaArrowLeft />
        </IconButton>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", textAlign: "center", flexGrow: 1 }}
        >
          {id ? "Edit Task" : "Create Task"}
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={task.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
        />
        <TextField
          label="Description"
          name="description"
          value={task.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
        />
        <TextField
          label="Category"
          name="category"
          value={task.category}
          onChange={handleChange}
          fullWidth
          margin="normal"
          select
          sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
        >
          <MenuItem value="Work">Work</MenuItem>
          <MenuItem value="Personal">Personal</MenuItem>
          <MenuItem value="Hobby">Hobby</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<FaSave />}
          fullWidth
          sx={{
            mt: 3,
            p: 1.5,
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          Save Task
        </Button>
      </form>
    </Box>
  );
};

export default TaskForm;
