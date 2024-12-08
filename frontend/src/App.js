import './App.css';
import { BrowserRouter, Route, Routes, useLocation,Link, useNavigate } from 'react-router-dom';
import Nav from './Components/Nav.js';
import AddTeacher from './Components/signUpp.js';
import GetTeacher from './Components/getTeacher.js';
import Content from './Components/content.js';
import ParticularContent from './Components/particularContent.js';
import DeleteTeacher from './Components/deleteTeacher.js';
import UpdateTeacher from './Components/update.js';
import Login from './Components/Login.js';
import Signup from './Components/signup.js'; // Correct import for Signup
import React, { useState, useEffect } from 'react';
import teacherImage from './download.jpg';

// Welcome page component
const Welcome = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '40px',
        height: '100vh',
        backgroundColor: '#f0f8ff',
        fontFamily: "'Poppins', Arial, sans-serif",
      }}
    >
      <div style={{ flex: 1, padding: '0 0 10px 0', marginTop: '-100px' }}>
        <img
          src={teacherImage}
          alt="Teachers Dashboard"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '10px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
          }}
        />
      </div>
      <div
        style={{
          flex: 1,
          padding: '20px 40px',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginTop: '-60px',
        }}
      >
        <h1
          style={{
            fontSize: '3.5rem',
            color: '#2c3e50',
            marginBottom: '20px',
            fontWeight: 'bold',
            textShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
          }}
        >
          Welcome to the <span style={{ color: '#007bff' }}>Teachers Dashboard</span>
        </h1>
        <p
          style={{
            fontSize: '1.4rem',
            color: '#444',
            lineHeight: '1.8',
            marginBottom: '25px',
            letterSpacing: '0.5px',
          }}
        >
          Effortlessly manage teacher-related data in one place. Add, update, view, or delete teacher details with ease. Simplify your workflow today!
        </p>
        <p
          style={{
            fontSize: '1.2rem',
            color: '#333',
            marginBottom: '30px',
          }}
        >
          Ready to get started? Click the button below to add teacher details now:
        </p>
        <Link to="/add">
          <button
            style={{
              padding: '15px 30px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#0056b3';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#007bff';
              e.target.style.transform = 'scale(1)';
            }}
          >
            Add Teacher
          </button>
        </Link>
        <p
          style={{
            fontSize: '1.2rem',
            color: '#333',
            marginTop: '20px',
          }}
        >
          Want to view teacher details? <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>Go to Teachers</Link>
        </p>
      </div>
    </div>
  );
};

// Wrapper to handle conditional rendering of the Nav component
const AppWrapper = () => {
  const location = useLocation();

  // Paths where Nav should not be shown
  const hideNavRoutes = ["/login", "/newaccount"]; // Correct route for signup page

  const [user, setUser] = useState(null); // To store the logged-in user
  const [token, setToken] = useState(sessionStorage.getItem('token')); 

   // Define session timeout duration (2 hours)
  const SESSION_TIMEOUT = 1 * 60 * 60 * 1000; // 2 hours in millisecond

  // Function to handle login to set the user:
  const handleLogin = (userData, token) => {
    console.log(userData);
    setUser(userData); // Store user data
    setToken(token);
    const currentTime = new Date().getTime(); // Current timestamp
    sessionStorage.setItem("user", JSON.stringify(userData.username)); // Store user data in sessionStorage
    sessionStorage.setItem("loginTime", currentTime); // Store the login time in sessionStorage
    sessionStorage.setItem('token', token); // Save JWT token to sessionStorage
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); // Store user data
    setToken(null);
    const currentTime = new Date().getTime(); // Current timestamp
    sessionStorage.removeItem("user"); // Remove user data from sessionStorage
    sessionStorage.removeItem("loginTime"); // Remove the login time from sessionStorage
    sessionStorage.removeItem("token");
    navigate("login");
  };

  // Check session expiration on a regular interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedLoginTime = sessionStorage.getItem("loginTime");
      const currentTime = new Date().getTime();

      if (storedLoginTime) {
        const elapsedTime = currentTime - storedLoginTime;
        console.log('Elapsed time:', elapsedTime);
        if (elapsedTime >= SESSION_TIMEOUT) {
          console.log('Session expired. Logging out...');
          alert('Session expired. Logging out...');
          handleLogout();
        }
      }
    }, 5000); // Check every 5 seconds (this can be adjusted)

    // Clear the interval when the component unmounts or when the user logs out
    return () => clearInterval(intervalId);

  }, [user]); // This effect will run every time the user state changes


  return (
    <div className="App">
      {/* Conditionally render Nav */}
      {!hideNavRoutes.includes(location.pathname) && <Nav user={user} />}
      <Routes>
        <Route path="/login" element={<Login  onLogin={handleLogin}/>} /> {/* Login route */}
        <Route path="/newaccount" element={<Signup />} /> {/* Correct route for Signup */}
        <Route path="/" element={<div><h1 style={{ marginLeft: '650px' }}>TEACHER'S LIST</h1><Content /></div>} />
        <Route path="/get" element={<div><h1> Get Teacher </h1><GetTeacher /></div>} />
        <Route path="/get/:mail" element={<div><h1> Get Teacher Details </h1><ParticularContent /></div>} />
        <Route path="/add" element={<div><h1> Add Teacher </h1><AddTeacher /></div>} />
        <Route path="/update" element={<div><h1> Update Teacher </h1><UpdateTeacher /></div>} />
        <Route path="/delete" element={<div><h1> Delete Teacher </h1><DeleteTeacher /></div>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/welcome" element={<Welcome />} /> {/* Welcome route */}
        <Route path="*" element={<h1>No Page Found</h1>} /> {/* Handle all invalid routes */}
      </Routes>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
