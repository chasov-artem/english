import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { loginThunk } from "../../store/authSlice";
import { CgClose } from "react-icons/cg";
import { FiEyeOff } from "react-icons/fi";
import styles from "./LogInModal.module.css";

const validationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LogInModal = ({ isOpen, onClose, onSwitchToSignUp }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setError("");
        setLoading(true);

        const res = await dispatch(
          loginThunk({ email: values.email, password: values.password })
        );
        if (res.error) throw new Error(res.error.message || "Login failed");

        onClose();
        formik.resetForm();
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    onClose();
    setError("");
    formik.resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Log In</h2>
          <button className={styles.modalClose} onClick={handleClose}>
            <CgClose />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.authDescription}>
            Welcome back! Please enter your credentials to access your account
            and continue your search for an teacher.
          </div>

          <form onSubmit={formik.handleSubmit} className={styles.authForm}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.formGroup}>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.email && formik.errors.email
                    ? styles.error
                    : ""
                }
                placeholder="Email"
              />
              {formik.touched.email && formik.errors.email && (
                <span className={styles.fieldError}>{formik.errors.email}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.password && formik.errors.password
                      ? styles.error
                      : ""
                  }
                  placeholder="Password"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FiEyeOff />
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <span className={styles.fieldError}>
                  {formik.errors.password}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? "Loading..." : "Log In"}
            </button>

            <div className={styles.authSwitch}>
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onSwitchToSignUp) onSwitchToSignUp();
                  }}
                  className={styles.switchBtn}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogInModal;
