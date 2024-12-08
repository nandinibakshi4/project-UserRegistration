// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Signup = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent form refresh

//     try {
//       // Perform the signup logic (e.g., sending data to the backend)
//       const response = await fetch('http://localhost:9000/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),
//       });
//       const data = await response.json();

//       if (response.ok) {
//         // On successful signup, navigate to the login page
//         navigate('/login');
//       } else {
//         // Show error message if something went wrong
//         setError(data.error || 'Signup failed. Please try again.');
//       }
//     } catch (err) {
//       console.error('Error during signup:', err);
//       setError('Something went wrong. Please try again later.');
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Create an Account</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="username">Username:</label>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="Enter your username"
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
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter your password"
//             required
//           />
//         </div>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <button type="submit" className="submit-btn">
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Signup;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [otpError, setOtpError] = useState('');
  const navigate = useNavigate();

  const handleGenerateOtp = async () => {
    try {
      const response = await fetch('http://localhost:9000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email }), // Send email as username
      });
      const data = await response.json();
  
      if (response.ok) {
        setOtpSent(true); // OTP sent successfully
        setError('');
      } else {
        setError(data.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      console.error('Error during OTP generation:', err);
      setError('Something went wrong. Please try again later.');
    }
  };
  

  const handleVerifyOtp = async (e) => {
    e.preventDefault(); // Prevent form refresh

    try {
      const response = await fetch('http://localhost:9000/verify-signup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, otp }),
      });
      const data = await response.json();

      if (response.ok) {
        // On successful verification, save user data
        const signupResponse = await fetch('http://localhost:9000/signup/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: email, password }),
        });

        const signupData = await signupResponse.json();
        if (signupResponse.ok) {
          navigate('/login'); // Redirect to login on successful signup
        } else {
          setError(signupData.error || 'Signup failed. Please try again.');
        }
      } else {
        setOtpError(data.error || 'Invalid or expired OTP.');
      }
    } catch (err) {
      console.error('Error during OTP verification:', err);
      setOtpError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="form-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleVerifyOtp}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            autoComplete="off"
          />
        </div>
        {!otpSent && (
          <div className="form-group">
            <button
              type="button"
              className="submit-btn"
              onClick={handleGenerateOtp}
            >
              Generate OTP
            </button>
          </div>
        )}
        {otpSent && (
          <>
            <div className="form-group">
              <label htmlFor="otp">Enter OTP:</label>
              <input
                type="text"
                name="otp"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP sent to your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Verify OTP and Sign Up
            </button>
          </>
        )}
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {otpError && <p style={{ color: 'red' }}>{otpError}</p>}
    </div>
  );
};

export default Signup;
