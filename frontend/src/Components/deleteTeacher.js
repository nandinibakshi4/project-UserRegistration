import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DeleteTeacher = () => {
    const navigate = useNavigate();
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState("");
    const [flag, setFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // Added state for error messages

    const getData = async () => {
        const token = localStorage.getItem('jwtToken'); // Retrieve JWT token from sessionStorage
        if (!token) {
            navigate('/login'); // Redirect to login if no token
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
                    navigate('/login');
                    return;
                }
                setErrorMessage("Invalid email or password.");
                setFlag(false);
                setData(""); // Clear previous data
                return;
            }

            result = await result.json();

            if (result && !result.error) {
                setData(result);
                setFlag(true);
                setErrorMessage(""); // Clear any previous error
            } else {
                setErrorMessage("Teacher not found.");
                setFlag(false);
                setData(""); // Clear previous data
            }
        } catch (error) {
            console.error("Error fetching teacher data:", error);
            setErrorMessage("Failed to fetch teacher data.");
            setFlag(false);
            setData(""); // Clear previous data
        }
    };

    const deleteData = async () => {
        const token = localStorage.getItem('jwtToken'); // Retrieve JWT token from sessionStorage
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const result = await fetch(`http://localhost:9000/teacher/${mail}/${password}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include token in header
                },
            });

            if (result.ok) {
                alert("Data is deleted successfully!");
                navigate('/'); // Redirect after deletion
            } else {
                alert("Failed to delete data. Please check the email and password.");
            }
        } catch (error) {
            console.error("Error deleting teacher data:", error);
            alert("Failed to delete data.");
        }
    };

    return (
        <div>
            {!flag && (
                <h2 style={{ marginLeft: "470px" }}>
                    ENTER THE CORRECT MAIL AND PASSWORD TO DELETE THE DATA
                </h2>
            )}
            <input
                className="input-sec"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                type="text"
                placeholder="ENTER MAIL ID"
            />
            <input
                className="input-sec"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="ENTER PASSWORD "
            />
            <button className="input-btn" type="button" onClick={getData}>
                FETCH DATA
            </button>

            {errorMessage && (
                <h4 style={{ color: "red", marginLeft: "470px" }}>{errorMessage}</h4>
            )}
            {flag && data && (
                <div className="content-container">
                    <div className="teacher-card">
                        <div className="teacher-image">
                            {data.image ? (
                                <img
                                    src={data.image}
                                    alt={`${data.name}'s Profile`} // Fixed template literal
                                    className="profile-img"
                                />
                            ) : (
                                <p>No Image</p>
                            )}
                        </div>
                        <div className="teacher-details">
                            <p><strong>Name:</strong> {data.name}</p>
                            <p><strong>Email:</strong> {data.mail}</p>
                            <p><strong>Age:</strong> {data.age}</p>
                            <p><strong>Department:</strong> {data.department}</p>
                            <p><strong>Address:</strong> {data.address}</p>
                        </div>
                        <button
                        style={{ marginLeft: "5%",marginTop:20, width: "10rem", height: "2rem" }}
                        type="button"
                        onClick={deleteData}
                    >
                        DELETE TEACHER
                    </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteTeacher;