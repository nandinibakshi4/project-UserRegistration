
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdateTeacher = () => {
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [flag, setFlag] = useState(false);
    const [data, setData] = useState("");

    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [department, setDepartment] = useState("");
    const [address, setAddress] = useState("");

    const [errorMessage, setErrorMessage] = useState(""); // Added state for error message

    const navigate = useNavigate();

    // Function to fetch teacher data by email
    const getData = async () => {
        const token = localStorage.getItem('jwtToken'); // Retrieve JWT token from sessionStorage
        if (!token) {
            // If no token, redirect to login
            navigate('/login');
            return;
        }

        try {
            let result = await fetch(`http://localhost:9000/teacher/${mail}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include token in header
                },
            });

            if (!result.ok) {
                if (result.status === 403 || result.status === 401) {
                    alert('Invalid or expired token. Please login again.');
                    navigate('/login'); // Redirect to login
                    return;
                }
                setFlag(false); // Ensure form is hidden
                setErrorMessage("Invalid email or Password");
                return;
            }

            result = await result.json();

            if (result) {
                if (result.error) {
                    setErrorMessage("Teacher not found.");
                    setFlag(false);
                    setData("");
                } else {
                    setData(result);
                    setFlag(true);
                    setErrorMessage(""); // Clear any previous error
                    setName(result.name);
                    setAge(result.age);
                    setDepartment(result.department);
                    setAddress(result.address);
                }
            } else {
                setErrorMessage("Teacher not found.");
                setFlag(false);
                setData("");
            }
        } catch (error) {
            console.error("Error fetching teacher data:", error);
            setErrorMessage("Failed to fetch teacher data.");
            setFlag(false);
            setData("");
        }
    };

    // Function to update teacher data
    const updateData = async () => {
        if (!name || !age || !department || !address) {
            alert("All fields are required!");
            return;
        }

        const token = localStorage.getItem('jwtToken'); // Retrieve JWT token from sessionStorage
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            let result = await fetch(`http://localhost:9000/teacher/${mail}`, {
                method: 'PUT',
                body: JSON.stringify({ name, age, address, department }),
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`, // Include token in header
                },
            });

            if (!result.ok) {
                if (result.status === 403 || result.status === 401) {
                    alert('Invalid or expired token. Please login again.');
                    navigate('/login');
                    return;
                }
                alert("Error updating data.");
                return;
            }

            result = await result.json();
            alert("Data updated successfully.");
            navigate('/'); // Navigate back to home after update
        } catch (error) {
            console.error("Error updating teacher:", error);
            alert("Failed to update data.");
        }
    };

    return (
        <div>
            <input
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                className="input-sec"
                type="text"
                placeholder="Enter email"
            />
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-sec"
                type="password"
                placeholder="Enter password"
            />
            <button className='input-btn' onClick={getData} type="button">FETCH TEACHER</button>

            {errorMessage && <h4 className="error-message">{errorMessage}</h4>} {/* Show error message */}

            {flag && (
                <div>
                    <input
                        className='input-sec'
                        value={name}
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className='input-sec'
                        value={age}
                        type="text"
                        onChange={(e) => setAge(e.target.value)}
                    />
                    <input
                        className='input-sec'
                        value={department}
                        type="text"
                        onChange={(e) => setDepartment(e.target.value)}
                    />
                    <input
                        className='input-sec'
                        value={address}
                        type="text"
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <button className='input-btn' onClick={updateData}>UPDATE DATA</button>
                </div>
            )}
        </div>
    );
};

export default UpdateTeacher;
