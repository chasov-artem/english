import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk, signupThunk } from "../../store/authSlice";
import Modal from "./Modal";
import "./AuthModal.css";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const AuthModal = ({ isOpen, onClose, mode = "login" }) => {
  const [authMode, setAuthMode] = useState(mode);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setError("");
      setLoading(true);

      if (authMode === "login") {
        const res = await dispatch(
          loginThunk({ email: data.email, password: data.password })
        );
        if (res.error) throw new Error(res.error.message || "Login failed");
      } else {
        const res = await dispatch(
          signupThunk({ email: data.email, password: data.password })
        );
        if (res.error) throw new Error(res.error.message || "Signup failed");
      }

      onClose();
      reset();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setAuthMode(authMode === "login" ? "signup" : "login");
    setError("");
    reset();
  };

  const handleClose = () => {
    onClose();
    setError("");
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={authMode === "login" ? "Login" : "Sign Up"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className={errors.email ? "error" : ""}
            placeholder="Enter your email"
          />
          {errors.email && (
            <span className="field-error">{errors.email.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className={errors.password ? "error" : ""}
            placeholder="Enter your password"
          />
          {errors.password && (
            <span className="field-error">{errors.password.message}</span>
          )}
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Loading..." : authMode === "login" ? "Login" : "Sign Up"}
        </button>

        <div className="auth-switch">
          {authMode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button type="button" onClick={switchMode} className="switch-btn">
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button type="button" onClick={switchMode} className="switch-btn">
                Login
              </button>
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default AuthModal;
