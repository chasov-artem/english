import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
      name: "",
      email: "",
      password: "",
    },
  });

  const submitHandler = async (values) => {
    try {
      setError("");

      const res = await dispatch(
        signupThunk({ email: values.email, password: values.password })
      );

      if (res.error) {
        const message = res.payload || res.error.message || "Signup failed";
        throw new Error(message);
      }

      onClose();
      reset();
    } catch (submitError) {
      setError(submitError.message || "Signup failed");
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

          <form
            onSubmit={handleSubmit(submitHandler)}
            className={styles.authForm}
          >
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.formGroup}>
              <input
                type="text"
                id="name"
                {...register("name")}
                className={errors.name ? styles.inputError : ""}
                placeholder="Name"
              />
              {(touchedFields.name || isSubmitted) && errors.name && (
                <span className={styles.fieldError}>{errors.name.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <input
                type="email"
                id="email"
                {...register("email")}
                className={errors.email ? styles.inputError : ""}
                placeholder="Email"
              />
              {(touchedFields.email || isSubmitted) && errors.email && (
                <span className={styles.fieldError}>{errors.email.message}</span>
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
              {(touchedFields.password || isSubmitted) && errors.password && (
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
              {isSubmitting ? "Loading..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;
