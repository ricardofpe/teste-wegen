import { Box, Typography, Button, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Welcome = () => {
  return (
    <Box
      sx={{
        mx: "auto",
        maxWidth: 600,
        backgroundColor: "#f9f9f9",
        p: 3,
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        height: "100vh",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 2, color: "#333" }}
      >
        Welcome to ToDo List WeGen
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: "#555" }}>
        Organize your tasks efficiently.
      </Typography>

      <Button
        component={RouterLink}
        to="/register"
        variant="contained"
        color="primary"
        sx={{
          mt: 3,
          p: 1.5,
          fontSize: "16px",
          fontWeight: "bold",
          display: "block",
          mx: "auto",
          width: "80%",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        Register
      </Button>
      <Typography variant="body2" sx={{ mt: 2, color: "#757575" }}>
        Already have an account?
        <Link
          component={RouterLink}
          to="/login"
          sx={{ ml: 0.5, color: "#1976d2", fontWeight: "bold" }}
        >
          Login
        </Link>
      </Typography>
    </Box>
  );
};

export default Welcome;
