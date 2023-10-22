import React from "react";
import BasePage from "./BasePage";
import { Navigate } from "react-router-dom";
const Layout = () => {
  // header, navigationBar를 구성하고
  // 내부 페이지만 교체할 수 있도록
  return <div>{<Navigate exact from="/" to="/mypage" />}</div>;
};

export default Layout;
