import React, { useEffect, useState } from "react";
import api from "../api/api";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { FaTrashAlt, FaEdit, FaPlus, FaCopy } from "react-icons/fa";

interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  isCompleted: boolean;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    taskId: number
  ) => {
    const isChecked = event.target.checked;

    const taskToUpdate = tasks.find((task) => task.id === taskId);

    if (!taskToUpdate) {
      console.error("Task not found in local state:", taskId);
      return;
    }

    try {
      await api.put(`/tasks/${taskId}`, {
        ...taskToUpdate,
        isCompleted: isChecked,
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, isCompleted: isChecked } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDuplicateTask = async (task: Task) => {
    try {
      const response = await api.post("/tasks", {
        title: `${task.title}`,
        description: task.description,
        category: task.category,
        isCompleted: false,
      });
      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (error) {
      console.error("Error duplicating task:", error);
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
      }}
    >
      <div
        style={{
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#f9f9f9",
          padding: "20px",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: "bold", mb: 3 }}
        >
          Task List
        </Typography>
        <Box
          sx={{
            maxHeight: "60vh",
            overflowY: "auto",
          }}
        >
          <List>
            {tasks.map((task) => (
              <ListItem
                key={task.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  p: 2,
                  mb: 2,
                  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={task.isCompleted}
                        onChange={(event) =>
                          handleCheckboxChange(event, task.id)
                        }
                        name="isCompleted"
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          textDecoration: task.isCompleted
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {task.title}
                      </Typography>
                    }
                  />
                  <Box>
                    <IconButton
                      component={Link}
                      to={`/tasks/${task.id}`}
                      sx={{ color: "#1976d2", mr: 1 }}
                    >
                      <FaEdit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteTask(task.id)}
                      sx={{ color: "#d32f2f", mr: 1 }}
                    >
                      <FaTrashAlt />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDuplicateTask(task)}
                      sx={{ color: "#4caf50" }}
                    >
                      <FaCopy />
                    </IconButton>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  sx={{ marginLeft: "24px", marginBottom: 1, color: "#555" }}
                >
                  {task.description}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    marginLeft: "24px",
                    color: "#757575",
                    fontStyle: "italic",
                  }}
                >
                  Category: {task.category}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
        <Button
          component={Link}
          to="/tasks/new"
          variant="contained"
          color="primary"
          startIcon={<FaPlus />}
          fullWidth
          sx={{
            mt: 3,
            p: 1.5,
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Add Task
        </Button>
      </div>
    </Box>
  );
};

export default TaskList;
