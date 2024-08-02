import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AlertMessage from "../components/AlertMessages";
import axios from "axios";

function UserSignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
  });
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validate = () => {
    const validationErrors = {};
    const { name, email, password, confirmPassword, mobile } = formData;

    
    const requiredFields = { name, email, password, confirmPassword, mobile };
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value.trim()) {
        validationErrors[field] = `${field} is required`;
      }
    }

    
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      validationErrors.name = "Name must contain only letters and spaces";
    } else if (name.length < 2 || name.length > 50) {
      validationErrors.name = "Name must be between 2 and 50 characters";
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      validationErrors.email = "Invalid email format";
    }

    
    const mobileRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
    if (!mobileRegex.test(mobile)) {
      validationErrors.mobile = "Invalid mobile number format";
    }

    
    const minLength = 8;
    const maxLength = 50;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength || password.length > maxLength) {
      validationErrors.password = `Password must be between ${minLength} and ${maxLength} characters`;
    } else if (!hasLetter) {
      validationErrors.password = "Password must contain at least one letter";
    } else if (!hasNumber) {
      validationErrors.password = "Password must contain at least one number";
    } else if (!hasSpecialChar) {
      validationErrors.password = "Password must contain at least one special character";
    }

    
    if (confirmPassword !== password) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/user/register",
          formData
        );
        setAlertMessage("You have been successfully registered!");

        setTimeout(() => {
          setAlertMessage("");
          navigate("/login");
        }, 2000);
      } catch (error) {
        if (error.response && error.response.data) {
          const { error: serverError } = error.response.data;
          if (serverError === 'Email already exists') {
            setErrors({ ...errors, email: serverError });
          } else if (serverError === 'Mobile number already exists') {
            setErrors({ ...errors, mobile: serverError });
          } else {
            setAlertMessage("An unexpected error occurred");
          }
        } else {
          setAlertMessage("An unexpected error occurred");
        }
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const ErrorMessage = ({ message }) => (
    <p className="text-xs text-red-500">{message}</p>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {alertMessage && 
        <AlertMessage message={alertMessage} onClose={() => setAlertMessage("")} />
      }
      
      {/* Image Container */}
      <div className="md:w-1/2 md:flex items-center justify-center bg-[#ffffff] overflow-hidden hidden md:block">
        {/* <img src={logo} alt="Logo" className="max-w-full h-auto" /> */}
      </div>
      {/* Signup Card Container */}
      <div className="flex items-center justify-center w-full md:w-1/2 bg-[#D5D8F2] p-4 h-screen md:h-auto">
        <div className="bg-[#ffffff] p-6 rounded-lg shadow-lg flex flex-col w-full max-w-sm mx-auto">
          <h5 className="font-poppins text-xl text-center py-4 text-[#666ee2]">
            Join Us
          </h5>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                value={formData.name}
                type="text"
                name="name"
                placeholder="Enter your name"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-[#666ee2] focus:border-transparent"
              />
              {errors.name && (
                <ErrorMessage message={errors.name} />
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Enter your email"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-[#666ee2] focus:border-transparent"
              />
              {errors.email && (
                <ErrorMessage message={errors.email} />
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Mobile
              </label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                placeholder="Enter your mobile number"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-[#666ee2] focus:border-transparent"
              />
              {errors.mobile && (
                <ErrorMessage message={errors.mobile} />
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  placeholder="Enter your password"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-[#666ee2] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  className="absolute inset-y-0 right-0 px-3 py-1 text-gray-600"
                >
                  {visible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <ErrorMessage message={errors.password} />
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  placeholder="Confirm your password"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-[#666ee2] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  className="absolute inset-y-0 right-0 px-3 py-1 text-gray-600"
                >
                  {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <ErrorMessage message={errors.confirmPassword} />
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#666ee2] text-white rounded-md hover:bg-[#666ee2] transition duration-300"
            >
              Sign Up
            </button>
            <div className="flex justify-center items-center py-2">
              <p className="text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-[#666ee2] hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserSignUp;
