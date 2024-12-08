import React, { useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ParticularContent = ()=>{
    const params = useParams();
    const [data,setData] = useState([]);

    useEffect(()=>{
        getData();
    },[]);

    let flag=false;

    const navigate = useNavigate(); 

    const token = localStorage.getItem('jwtToken'); // Retrieve JWT token from sessionStorage
        if (!token) {
          // If no token, redirect to login
          navigate('/login');
          return;
        }

    const getData = async()=>{
        let result = await fetch(`http://localhost:9000/get/${params.mail}`,{
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
        if(result){
            flag=true;
        }
        console.log("RESULT "+ result);
        setData(result);
    }

    return(
        <div>
            {
                data.map((item,index)=>
                    <ul>
                        <li> Name : {item.name} </li>
                        <li> Mail : {item.mail} </li>
                        <li> Age : {item.age} </li>
                        <li> Department : {item.department} </li>
                        <li> Address : {item.address} </li>
                    </ul>
                )
            }
        </div>
    )        
}

export default ParticularContent;