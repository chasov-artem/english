import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { CgClose } from "react-icons/cg";
import styles from "./BookingModal.module.css";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  preferredTime: yup.string().required("Preferred time is required"),
  message: yup.string().required("Message is required"),
});

const BookingModal = ({ isOpen, onClose, teacher }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      preferredTime: "",
      message: "",
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

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Book Trial Lesson</h2>
          <button className={styles.modalClose} onClick={handleClose}>
            <CgClose />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.bookingContent}>
            <div className={styles.teacherInfo}>
              <img
                src={teacher.avatar_url}
                alt={teacher.name}
                className={styles.teacherAvatar}
              />
              <div>
                <h3>
                  {teacher.name} {teacher.surname}
                </h3>
                <p>${teacher.price_per_hour}/hour</p>
              </div>
            </div>

            <form onSubmit={formik.handleSubmit} className={styles.bookingForm}>
              {error && <div className={styles.errorMessage}>{error}</div>}

              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.name && formik.errors.name
                      ? styles.error
                      : ""
                  }
                  placeholder="Enter your full name"
                />
                {formik.touched.name && formik.errors.name && (
                  <span className={styles.fieldError}>
                    {formik.errors.name}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
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
                  placeholder="Enter your email"
                />
                {formik.touched.email && formik.errors.email && (
                  <span className={styles.fieldError}>
                    {formik.errors.email}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number</label>
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
                  placeholder="Enter your phone number"
                />
                {formik.touched.phone && formik.errors.phone && (
                  <span className={styles.fieldError}>
                    {formik.errors.phone}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="preferredTime">Preferred Time</label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={formik.values.preferredTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.preferredTime && formik.errors.preferredTime
                      ? styles.error
                      : ""
                  }
                >
                  <option value="">Select preferred time</option>
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                  <option value="evening">Evening (5 PM - 9 PM)</option>
                </select>
                {formik.touched.preferredTime &&
                  formik.errors.preferredTime && (
                    <span className={styles.fieldError}>
                      {formik.errors.preferredTime}
                    </span>
                  )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.message && formik.errors.message
                      ? styles.error
                      : ""
                  }
                  placeholder="Tell us about your learning goals..."
                  rows="4"
                />
                {formik.touched.message && formik.errors.message && (
                  <span className={styles.fieldError}>
                    {formik.errors.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? "Sending..." : "Send Booking Request"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
