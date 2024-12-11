import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const authContext = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const prefilledUsername = localStorage.getItem("prefilledUsername");
    if (prefilledUsername) {
      setUsername(prefilledUsername);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await authContext?.login(username, password);
    } catch (err: any) {
      console.log(err);
      if (err.response.data) {
        setError(err.response.data);
      } else {
        setError("Login failed");
      }
    }
    localStorage.removeItem("prefilledUsername");
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold", mb: 3, color: "#333" }}
      >
        Login
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
        />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 3,
            p: 1.5,
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          Login
        </Button>
      </form>
      <Typography
        variant="body2"
        sx={{ mt: 2, textAlign: "center", color: "#757575" }}
      >
        Não tem uma conta?
        <Link
          component={RouterLink}
          to="/register"
          sx={{ ml: 0.5, color: "#1976d2", fontWeight: "bold" }}
        >
          Registre-se
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;
