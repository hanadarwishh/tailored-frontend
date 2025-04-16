import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import user_icon from "../Assets/user.png";
import password_icon from "../Assets/password.png";
import logo from "../Assets/tailored logo.png";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [courseid, setCourseid] = useState();
  const [fieldErrors, setFieldErrors] = useState({
    username: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setFieldErrors({ username: false, password: false });

    if (!username || !password) {
      setFieldErrors({
        username: !username,
        password: !password,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Incorrect email/username or password");
      }

      const userData = await response.json();
      localStorage.setItem("userData", JSON.stringify(userData));
      const TOKEN = userData.token;

      // Fetch courses
      const coursesResponse = await fetch("http://localhost:3002/api/courses", {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      if (!coursesResponse.ok) {
        throw new Error("Failed to fetch courses");
      }

      const coursesData = await coursesResponse.json();
      const courseid = coursesData.courses[0]?.id;

      if (!courseid) {
        navigate("/Welcome");
        return;
      }

      // Fetch role based on courseid
      const roleResponse = await fetch(
        `http://localhost:3002/api/user/role/${courseid}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!roleResponse.ok) {
        throw new Error("Failed to fetch user role");
      }

      const roleData = await roleResponse.json();
      const userRole = roleData.role[0].shortname;
      console.log(roleData);

      if (userRole === "student") {
        navigate("/student");
      } else {
        navigate("/instructor");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-content">
          <img src={logo} alt="TailorED Logo" />
          <h1>Welcome to TailorED</h1>
          <p>
            Take control of your learning. With TailorED, your study experience
            is built around you.
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-container">
          <h1 className="login-title">Log In</h1>
          <p className="login-subtitle">
            Enter your credentials to unlock your full learning experience
          </p>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <img src={user_icon} alt="User Icon" className="icon" />
              <input
                id="username"
                type="text"
                placeholder="Email or Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={fieldErrors.username ? "input-error" : ""}
              />
            </div>
            {fieldErrors.username && (
              <p className="error-text">
                <MdErrorOutline className="error-icon" />
                <span>Email or Username is required</span>
              </p>
            )}

            <div className="form-group">
              <img src={password_icon} alt="Password Icon" className="icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={fieldErrors.password ? "input-error" : ""}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                role="button"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            {fieldErrors.password && (
              <p className="error-text">
              <MdErrorOutline className="error-icon" />
              <span>Password is required</span>
            </p>
            )}
            
            <button type="submit" className="login-button">
              Log In
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
