import { Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import Welcome from "./components/Welcome";
import Header from "./components/Header";

const App = () => {
  const authContext = useContext(AuthContext);

  const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    if (!authContext?.isLoggedIn) {
      return <Navigate to="/welcome" />;
    }
    return children;
  };

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TaskList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/new"
          element={
            <ProtectedRoute>
              <TaskForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/:id"
          element={
            <ProtectedRoute>
              <TaskForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
