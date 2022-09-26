import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom';



const Login = (props) => {

  const [credentials, setCredentials] = useState({ email: "", password: "" })
  let navigate = useNavigate();



  const onChange = (e) => {

    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  }



  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
        //   "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjMyNGNiYzI2NzY5N2U2NDExMzBkNDI4In0sImlhdCI6MTY2MzM1Nzc1NX0.gdkr-JwIghChYc0l4eR81ALGvrm8PcxfVFpKSeFi-1M"

      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password })
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      // save the auth  token and redirect
      localStorage.setItem('token', json.authtoken);
      navigate("/");
      props.showAlert("Logged In Created", "success")
    }
    else {
      props.showAlert("Invalid Details", "danger")
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor='email' className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" onChange={onChange} value={credentials.email} />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name='password' onChange={onChange} value={credentials.password} />
        </div>

        <button type="submit" className="btn btn-primary" >Submit</button>
      </form>
    </>
  )
}

export default Login