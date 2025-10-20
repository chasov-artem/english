import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "./Modal";
import "./BookingModal.css";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  preferredTime: yup.string().required("Preferred time is required"),
  message: yup.string().required("Message is required"),
});

const BookingModal = ({ isOpen, onClose, teacher }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      // Here you would typically send the booking request to your backend
      console.log("Booking data:", { ...data, teacherId: teacher.id });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Booking request sent successfully!");
      onClose();
      reset();
    } catch (error) {
      setError("Failed to send booking request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setError("");
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Book Trial Lesson">
      <div className="booking-content">
        <div className="teacher-info">
          <img
            src={teacher.avatar_url}
            alt={teacher.name}
            className="teacher-avatar"
          />
          <div>
            <h3>
              {teacher.name} {teacher.surname}
            </h3>
            <p>${teacher.price_per_hour}/hour</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="booking-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className={errors.name ? "error" : ""}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <span className="field-error">{errors.name.message}</span>
            )}
          </div>

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
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              {...register("phone")}
              className={errors.phone ? "error" : ""}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <span className="field-error">{errors.phone.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="preferredTime">Preferred Time</label>
            <select
              id="preferredTime"
              {...register("preferredTime")}
              className={errors.preferredTime ? "error" : ""}
            >
              <option value="">Select preferred time</option>
              <option value="morning">Morning (9 AM - 12 PM)</option>
              <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
              <option value="evening">Evening (5 PM - 9 PM)</option>
            </select>
            {errors.preferredTime && (
              <span className="field-error">
                {errors.preferredTime.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              {...register("message")}
              className={errors.message ? "error" : ""}
              placeholder="Tell us about your learning goals..."
              rows="4"
            />
            {errors.message && (
              <span className="field-error">{errors.message.message}</span>
            )}
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Sending..." : "Send Booking Request"}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default BookingModal;
