import React, { useEffect } from "react";
import { Route, Navigate, Routes, useNavigate } from "react-router-dom";
import Login from "./Screen/Login";
import Layout from "./Layout";
import Dashboard from "./Screen/Dashboard";
import MyPage from "./Screen/MyPage";

const checkAuth = () => {
  return sessionStorage.getItem("userId") != null;
};


const RouteMap = () => {
  let isAuthorized = checkAuth();
  return (
    <Routes>
      <Route path="/" element={isAuthorized ? <Layout /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};


export default RouteMap;
