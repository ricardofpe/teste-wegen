import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiLogOut } from "react-icons/fi";
import { CSSProperties } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, logout } = useContext(AuthContext) || {
    user: null,
    logout: () => {},
  };

  const headerStyle: CSSProperties = {
    backgroundColor: "#510c76",
    position: "fixed",
    width: "100%",
    padding: "20px 0",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
  };

  const containerStyle: CSSProperties = {
    width: "90%",
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const logoStyle: CSSProperties = {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#fff",
    margin: "0",
  };

  const navStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
  };

  const welcomeMessageStyle: CSSProperties = {
    marginRight: "20px",
    fontSize: "1rem",
    color: "#fff",
  };

  const logoutButtonStyle: CSSProperties = {
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const iconStyle: CSSProperties = {
    fontSize: "1.5em",
  };

  const linkStyle: CSSProperties = {
    textDecoration: "none",
    color: "#fff",
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <Link to="/tasks" style={linkStyle}>
          <h1 style={logoStyle}>WeGen</h1>
        </Link>

        <nav style={navStyle}>
          {user && (
            <>
              <span style={welcomeMessageStyle}>Welcome, {user.username}!</span>
              <button style={logoutButtonStyle} onClick={logout}>
                <FiLogOut style={iconStyle} />
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
