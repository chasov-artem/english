import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { IoClose } from "react-icons/io5";
import styles from "./BookingModal.module.css";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  reason: yup.string().required("Reason is required"),
});

const BookingModal = ({ isOpen, onClose, teacher }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      reason: "Career and business",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setError("");
        setLoading(true);

        // Here you would typically send the booking request to your backend
        console.log("Booking data:", { ...values, teacherId: teacher.id });

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        alert("Booking request sent successfully!");
        onClose();
        formik.resetForm();
      } catch (error) {
        setError("Failed to send booking request. Please try again.");
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

  const reasons = [
    "Career and business",
    "Lesson for kids",
    "Living abroad",
    "Exams and coursework",
    "Culture, travel or hobby",
  ];

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Book trial lesson</h2>
          <button className={styles.modalClose} onClick={handleClose}>
            <IoClose />
          </button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.modalDescription}>
            Our experienced tutor will assess your current language level,
            discuss your learning goals, and tailor the lesson to your specific
            needs.
          </p>

          <div className={styles.teacherInfo}>
            <img
              src={teacher.avatar_url}
              alt={`${teacher.name} ${teacher.surname}`}
              className={styles.teacherAvatar}
            />
            <div className={styles.teacherDetails}>
              <span className={styles.teacherLabel}>Your teacher</span>
              <span className={styles.teacherName}>
                {teacher.name} {teacher.surname}
              </span>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className={styles.bookingForm}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.reasonSection}>
              <h3 className={styles.reasonTitle}>
                What is your main reason for learning English?
              </h3>
              <div className={styles.radioGroup}>
                {reasons.map((reason) => (
                  <label key={reason} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="reason"
                      value={reason}
                      checked={formik.values.reason === reason}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={styles.radioInput}
                    />
                    <span className={styles.radioText}>{reason}</span>
                  </label>
                ))}
              </div>
              {formik.touched.reason && formik.errors.reason && (
                <span className={styles.fieldError}>
                  {formik.errors.reason}
                </span>
              )}
            </div>

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
                placeholder="Full Name"
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
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.phone && formik.errors.phone
                    ? styles.error
                    : ""
                }
                placeholder="Phone number"
              />
              {formik.touched.phone && formik.errors.phone && (
                <span className={styles.fieldError}>{formik.errors.phone}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? "Sending..." : "Book"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
