import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../content.css'; 
const Content = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate(); 
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
        const token = localStorage.getItem('jwtToken'); // Retrieve JWT token from local storage
        if (!token) {
          // If no token, redirect to login
          navigate('/login');
          return;
        }
    try {
      let result = await fetch('http://localhost:9000/teachers',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token in header
        },
      });

      if (!result.ok) {
        // If token is expired or invalid, handle the error
        if (result.status === 403 || result.status === 401) {
          alert('Invalid or expired token. Please login again.');
          navigate('/login'); // Redirect to login
          return;
        }
        alert('Error fetching data');
      }

      result = await result.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleUpdate = (id) => {
    navigate('/update', { state: { id } });
  };
  const handleDelete = (id) => {
    navigate('/delete', { state: { id } });
  };
  return (
    <div className="content-container">
      {data.map((item, index) => (
        <div key={index} className="teacher-card">
          <div className="teacher-image">
            {item.image ? (
              <img
                src={item.image}
                alt={`${item.name}'s Profile`}
                className="profile-img"
              />
            ) : (
              <p>No Image</p>
            )}
          </div>
          <div className="teacher-details">
            <p><strong>Name:</strong> {item.name}</p>
            <p><strong>Email:</strong> {item.mail}</p>
            <p><strong>Age:</strong> {item.age}</p>
            <p><strong>Department:</strong> {item.department}</p>
            <p><strong>Address:</strong> {item.address}</p>
          </div>
          <div className="teacher-actions">
            <button
              className="update-btn"
              onClick={() => handleUpdate(item.id)}
            >
              Update
            </button>
            <button
              className="delete-btn"
              onClick={() => handleDelete(item.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Content;
