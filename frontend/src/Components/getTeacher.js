import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../content.css';

const GetTeacher = () => {
    const [mail, setMail] = useState("");
    const [data, setData] = useState(null);
    const [flag, setFlag] = useState(false);
    const [wrongField, setWrongField] = useState(false);

    const navigate = useNavigate();

    const getData = async () => {
        const token = localStorage.getItem('jwtToken'); // Retrieve JWT token from localStorage
        if (!token) {
            // If no token, redirect to login
            navigate('/login');
            return;
        }

        try {
            let request = await fetch(`http://localhost:9000/teacher/${mail}`, { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Fixed template literal
                },
            });

            if (!request.ok) {
                // If token is expired or invalid, handle the error
                if (request.status === 403 || request.status === 401) {
                    alert('Invalid or expired token. Please login again.');
                    navigate('/login'); // Redirect to login
                    return;
                }
                // Optionally handle other errors here
                alert('Error fetching data');
                return;
            }

            const response = await request.json(); // Make sure to parse the response as JSON

            if (response) {
                if (response.error) {
                    setWrongField(true);
                    setFlag(false);
                    setData(null); // Clear previous data
                } else {
                    setData(response);
                    setFlag(true);
                    setWrongField(false);
                }
            } else {
                setFlag(false);
                setWrongField(true);
                setData(null); // Clear previous data
            }
        } catch (error) {
            setFlag(false);
            setWrongField(true);
            setData(null); // Clear previous data
            console.error("Error fetching teacher data:", error);
        }
    };

    // Navigate to Update page with teacher's ID
    const handleUpdate = (id) => {
        navigate('/update', { state: { id } });
    };

    // Navigate to Delete page with teacher's ID
    const handleDelete = (id) => {
        navigate('/delete', { state: { id } });
    };

    return (
        <div>
            <input
                className="input-sec"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                type="text"
                placeholder="ENTER MAIL ID"
            />
            <button className="input-btn" type="button" onClick={getData}>
                FETCH DATA
            </button>

            <h3>&nbsp;&nbsp;&nbsp;FETCHED TEACHER DETAILS HERE: </h3>

            {flag && data && (
                <div className="content-container">
                    <div className="teacher-card">
                        <div className="teacher-image">
                            {data.image ? (
                                <img
                                    src={data.image}
                                    alt={`${data.name}'s Profile`} 
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
                        <div className="teacher-actions">
                            <button
                                className="update-btn"
                                onClick={() => handleUpdate(data.id)} // Correct usage
                            >
                                Update
                            </button>
                            <button
                                className="delete-btn"
                                onClick={() => handleDelete(data.id)} // Correct usage
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {wrongField && <h4 style={{ color: "red", textAlign: "center" }}>WRONG MAIL ID !!!!! NO MATCH FOUND</h4>}
        </div>
    );
};

export default GetTeacher;