import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectAuthInitialized } from "../store";

const PrivateRoute = ({ children }) => {
  const currentUser = useSelector(selectCurrentUser);
  const initialized = useSelector(selectAuthInitialized);
  const location = useLocation();

  if (!initialized) {
    return null;
  }

  if (!currentUser) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;

