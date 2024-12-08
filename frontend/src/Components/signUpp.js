import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const AddTeacher = () => {
    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState("");
    const [department, setDepartment] = useState("");
    const [address, setAddress] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const navigate = useNavigate();
    const collectData = async () => {
        if (!name || !mail || !password || !age || !department || !address || !profilePicture) {
            alert("Please fill in all fields!");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(mail)) {
            alert("Please enter a valid email address!");
            return;
        }
        const formData = new FormData();
        formData.append('name', name);
        formData.append('mail', mail);
        formData.append('password', password);
        formData.append('age', age);
        formData.append('department', department);
        formData.append('address', address);
        formData.append('image', profilePicture);

        try {
            const token = localStorage.getItem('jwtToken'); // Retrieve JWT token from sessionStorage
            if (!token) {
            // If no token, redirect to login
            navigate('/login');
            return;
            }

            let result = await fetch('http://localhost:9000/teacher', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`, // Include token in header
                },
            });

            if (!result.ok) {
                throw new Error(`Error: ${result.status} ${result.statusText}`);
            }

            const response = await result.json();
            console.log(response);

            if (response) {
                alert("Teacher data added successfully!");
                setName("");
                setMail("");
                setPassword("");
                setAge("");
                setDepartment("");
                setAddress("");
                setProfilePicture(null);
                navigate('/');
            }
        } catch (error) {
            console.error("Error adding teacher:", error);
            alert("Failed to add teacher. Please try again later.");
        }
    };

    return (
        <div>
            <input className="input-sec" value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Enter Name" />
            <input className="input-sec" value={mail} onChange={(e) => setMail(e.target.value)} type="email" placeholder="Enter Email" />
            <input className="input-sec" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter Password" />
            <input className="input-sec" value={age} onChange={(e) => setAge(e.target.value)} type="number" placeholder="Enter Age" />
            <input className="input-sec" value={department} onChange={(e) => setDepartment(e.target.value)} type="text" placeholder="Enter Department" />
            <input className="input-sec" value={address} onChange={(e) => setAddress(e.target.value)} type="text" placeholder="Enter Address" />
            <div className="file-input-container">
  <input
    className="input-sec"
    onChange={(e) => setProfilePicture(e.target.files[0])}
    type="file"
    accept="image/*"
    id="profilePic"
    style={{ display: 'none' }} // Hide default file input
  />
  <label htmlFor="profilePic" className="file-input-label">
    Upload Profile Picture
  </label>
</div>

            <button onClick={collectData} className="input-btn" type="button">ADD DETAILS</button>
        </div>
    );
};

export default AddTeacher;
