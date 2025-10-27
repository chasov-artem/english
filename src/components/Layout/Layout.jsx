import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import "./Layout.css";

const Layout = ({ children }) => {
  const location = useLocation();
  const isTeachersPage = location.pathname === "/teachers";

  return (
    <div className="layout">
      {!isTeachersPage && <Header />}
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
