import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoClose } from "react-icons/io5";
import styles from "./BookingModal.module.css";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  reason: yup.string().required("Reason is required"),
});

const LEARNING_REASONS = [
  "Career and business",
  "Lesson for kids",
  "Living abroad",
  "Exams and coursework",
  "Culture, travel or hobby",
];

const BookingModal = ({ isOpen, onClose, teacher }) => {
  const [error, setError] = useState("");

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
      phone: "",
      reason: LEARNING_REASONS[0],
    },
  });

  const submitHandler = async (values) => {
    try {
      setError("");

      if (teacher?.id) {
        console.log("Booking data:", { ...values, teacherId: teacher.id });
      }

      // Simulate API call to backend booking endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Booking request sent successfully!");
      onClose();
      reset();
    } catch (submitError) {
      console.error("Booking error:", submitError);
      setError("Failed to send booking request. Please try again.");
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
      reset({
        name: "",
        email: "",
        phone: "",
        reason: LEARNING_REASONS[0],
      });
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    onClose();
    setError("");
    reset({
      name: "",
      email: "",
      phone: "",
      reason: LEARNING_REASONS[0],
    });
  };

  if (!isOpen) return null;

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

          <form
            onSubmit={handleSubmit(submitHandler)}
            className={styles.bookingForm}
          >
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.reasonSection}>
              <h3 className={styles.reasonTitle}>
                What is your main reason for learning English?
              </h3>
              <div className={styles.radioGroup}>
                {LEARNING_REASONS.map((reason) => (
                  <label key={reason} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="reason"
                      value={reason}
                      {...register("reason")}
                      className={styles.radioInput}
                    />
                    <span className={styles.radioText}>{reason}</span>
                  </label>
                ))}
              </div>
              {(touchedFields.reason || isSubmitted) && errors.reason && (
                <span className={styles.fieldError}>
                  {errors.reason.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <input
                type="text"
                id="name"
                {...register("name")}
                className={errors.name ? styles.inputError : ""}
                placeholder="Full Name"
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
              <input
                type="tel"
                id="phone"
                {...register("phone")}
                className={errors.phone ? styles.inputError : ""}
                placeholder="Phone number"
              />
              {(touchedFields.phone || isSubmitted) && errors.phone && (
                <span className={styles.fieldError}>{errors.phone.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitBtn}
            >
              {isSubmitting ? "Sending..." : "Book"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
