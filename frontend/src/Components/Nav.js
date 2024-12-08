import React from 'react';
import {Link} from 'react-router-dom';

const Nav = ({user}) =>{

    function handleLogout(){
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("loginTime");
        localStorage.removeItem("jwtToken");
    }

    return (
        <div>
            <ul className='nav-ul'>
                <li> <Link className="nav-link" to="/welcome"> WELCOME TO TEACHERS DASHBOARD </Link>  </li>
                <li> <Link className="nav-link" to="/"> TEACHER'S LIST </Link> </li>
                <li> <Link className="nav-link" to="/add"> ADD TEACHER </Link>  </li>
                <li> <Link className="nav-link" to="/get"> GET TEACHER</Link> </li>
                <li> <Link className="nav-link" to="/update"> UPDATE TEACHER </Link> </li>
                <li> <Link className="nav-link" to="/delete">DELETE TEACHER</Link> </li>
                {/* <li className="nav-link"> {user.username} </li> */}
                <li> <Link className="nav-link"  onClick={handleLogout} to="/login">LOGOUT</Link> </li>
                
            </ul>
        </div>
    )
}

export default  Nav; 
