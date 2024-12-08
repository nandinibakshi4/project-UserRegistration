// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Login.css";  // You can include your custom styles here

// const Login = ({onLogin}) => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent page refresh

//     try {
//       // Simulate login process
//       const response = await fetch("http://localhost:9000/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await response.json();
      
//       if (response.ok && data.token) {
//         console.log(data);
//         console.log(data.token);
//         // If login is successful, store the JWT token in localStorage
//         localStorage.setItem("jwtToken", data.token); // Save token to localStorage
//         onLogin({ username }); // To set userName on nav header.
//         // Redirect on successful login
//         navigate("/welcome");
//       } else {
//         // Show error if login fails
//         setError(data.error || "Invalid credentials");
//       }
//     } catch (err) {
//       console.error("Error during login:", err);
//       setError("Something went wrong. Please try again later.");
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Login Page</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="name">UserName:</label>
//           <input
//             type="text"
//             id="name"
//             name="username"
//             placeholder="Enter your name"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//             autoComplete="off"
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             name="password"
//             id="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         {error && <p style={{ color: "red" }}>{error}</p>}
//         <button type="submit" className="submit-btn">Login</button>
//       </form>
//       <p>Don't have an account? <a href="newaccount">Sign Up</a></p>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Custom styles

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError("username, and password cannot be empty.");
      setIsLoading(false);
      return;
    }

    // if (!/\S+@\S+\.\S+/.test(email)) {
    //   setError("Please enter a valid email address.");
    //   setIsLoading(false);
    //   return;
    // }

    try {
      // API call to login endpoint
      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:9000"}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store the JWT token in localStorage
        localStorage.setItem("jwtToken", data.token);

        // Trigger the parent component's onLogin callback
        onLogin({ username });

        // Navigate to welcome page
        navigate("/welcome");
      } else {
        // Show error if login fails
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label htmlFor="name">Username:</label>
          <input
            type="text"
            id="name"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="show-password-btn"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
};

export default Login;