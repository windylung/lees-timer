import "./login-style.css";
import React, { useState } from "react";
import logo from "../Image/LeesLogo.png"

import axios from "axios";
const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const login = async () => {
    const userData = {
      name: name,
      password: password,
    };
    
    await axios
      .post("/api/login", userData)
      .then((response) => {
        console.log(response);
        sessionStorage.setItem("userId", response.data.userId);
      })
      .catch((e) => console.log(e));
      document.location.href = "/";
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "end"}}>
      <img className="logo" src={logo}  alt="logo" ></img>
      <input
        className={`input-wrapper ${
          name === "" ? "gray-color" : "black-color"
        }`}
        placeholder="NAME"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className={`input-wrapper ${
          password === "" ? "gray-color" : "black-color"
        }`}
        placeholder="PASSWORD"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <div
        className="login-button"
        onClick={() => {
          login();
        }}
      >
        LOGIN
      </div>
    </div>
  );
};

export default Login;
