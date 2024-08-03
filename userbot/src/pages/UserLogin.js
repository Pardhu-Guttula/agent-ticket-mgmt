import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";

function UserLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

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
    const { email, password } = formData;

    if (!email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "Email is invalid";
    }
    if (!password.trim()) {
      validationErrors.password = "Password is required";
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/user/login`,
          formData
        );
        login(response.data);
        navigate("/useragentchat");
      } catch (error) {
        console.error("There was an error logging in!", error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="md:w-1/2 md:flex items-center justify-center bg-[#ffffff] overflow-hidden hidden md:block"></div>
      <div className="flex items-center justify-center w-full md:w-1/2 bg-[#D5D8F2] p-4 h-screen md:h-auto">
        <div className="bg-[#ffffff] p-6 rounded-lg shadow-lg flex flex-col w-full max-w-sm mx-auto">
          <h5 className="font-poppins text-xl text-center py-4 text-[#666ee2]">
            Login
          </h5>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4">
              <div className="flex border border-[#a5a5a597] bg-white rounded">
                <input
                  value={formData.email}
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  onChange={handleChange}
                  className="w-full h-full rounded px-4 py-2 focus:outline-none"
                />
              </div>
              {errors.email && (
                <h6 className="text-left text-xs mb-3 text-red-500">
                  {errors.email}
                </h6>
              )}
              <div className="flex border border-[#a5a5a597] bg-white rounded relative">
                <input
                  value={formData.password}
                  type={visible ? "text" : "password"}
                  name="password"
                  placeholder="Enter Password"
                  onChange={handleChange}
                  className="w-full h-full rounded px-4 py-2 focus:outline-none"
                />
                <div
                  onClick={() => setVisible(!visible)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                >
                  {visible ? (
                    <FaEye className="text-gray-400 text-lg" />
                  ) : (
                    <FaEyeSlash className="text-gray-400 text-lg" />
                  )}
                </div>
              </div>
              {errors.password && (
                <h6 className="text-left text-xs mb-3 text-red-500">
                  {errors.password}
                </h6>
              )}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#666ee2] text-white rounded-md hover:bg-[#5058e5] transition duration-300"
              >
                Login
              </button>
            </div>
          </form>
          <p className="text-sm text-center mt-4">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#666ee2] font-medium hover:underline"
            >
              SignUp
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
