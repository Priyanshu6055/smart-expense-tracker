import React, { useState } from "react";

function login(){
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const [message, setMassage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e)=> {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }
}



const Login = () => {
  return (
    <div>
      <h1>Login Page</h1>
      <form>
        <label>Email</label>
        <input />

        <br />
        <br />

        <lable>Password</lable>
        <input />

        <button>Login</button>
      </form>
    </div>
  );
};

export default Login;
