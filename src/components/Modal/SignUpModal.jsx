import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { signupThunk } from "../../store/authSlice";
import { CgClose } from "react-icons/cg";
import { FiEyeOff } from "react-icons/fi";
import styles from "./SignUpModal.module.css";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const SignUpModal = ({ isOpen, onClose }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setError("");
        setLoading(true);

        const res = await dispatch(
          signupThunk({ email: values.email, password: values.password })
        );
        if (res.error) throw new Error(res.error.message || "Signup failed");

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
          <h2 className={styles.modalTitle}>Registration</h2>
          <button className={styles.modalClose} onClick={handleClose}>
            <CgClose />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.authDescription}>
            Thank you for your interest in our platform! In order to register,
            we need some information. Please provide us with the following
            information
          </div>

          <form onSubmit={formik.handleSubmit} className={styles.authForm}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.formGroup}>
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.name && formik.errors.name ? styles.error : ""
                }
                placeholder="Name"
              />
              {formik.touched.name && formik.errors.name && (
                <span className={styles.fieldError}>{formik.errors.name}</span>
              )}
            </div>

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
              {loading ? "Loading..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;
