import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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

const LogInModal = ({ isOpen, onClose }) => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isSubmitted, isSubmitting },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitHandler = async (values) => {
    try {
      setError("");

      const res = await dispatch(loginThunk(values));

      if (res.error) {
        const message =
          res.payload || res.error.message || "Login failed";
        throw new Error(message);
      }

      onClose();
      reset();
    } catch (submitError) {
      setError(submitError.message || "Login failed");
    }
  };

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

  useEffect(() => {
    if (isOpen) {
      setError("");
      reset();
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    onClose();
    setError("");
    reset();
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

          <form
            onSubmit={handleSubmit(submitHandler)}
            className={styles.authForm}
          >
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.formGroup}>
              <input
                type="email"
                id="email"
                {...register("email")}
                className={errors.email ? styles.inputError : ""}
                placeholder="Email"
              />
              {(touchedFields.email || isSubmitted) && errors.email && (
                <span className={styles.fieldError}>
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password")}
                  className={errors.password ? styles.inputError : ""}
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
              {(touchedFields.password || isSubmitted) &&
                errors.password && (
                <span className={styles.fieldError}>
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitBtn}
            >
              {isSubmitting ? "Loading..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogInModal;
