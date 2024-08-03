import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { FaPlusCircle, FaUser } from "react-icons/fa";
import { AuthContext } from "../AuthContext";
import { MdEmail, MdConfirmationNumber, MdPhone } from "react-icons/md";

const AgentProfile = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const { authState } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const agentId = authState.agentId;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/profile/${agentId}`
        );
        setProfileData(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [agentId]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profileData) {
    return <div>Error loading profile data.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#e9ecef]">
      <div className="bg-card shadow-lg rounded-lg overflow-hidden max-w-4xl w-full relative p-10">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 text-center">
            <input
              type="file"
              id="profilePic"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePicChange}
            />
            <label
              htmlFor="profilePic"
              className="cursor-pointer relative inline-block"
            >
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="mx-auto rounded-full w-32 h-32 md:w-40 md:h-40 object-cover shadow-md"
                />
              ) : (
                <div className="mx-auto rounded-full w-32 h-32 md:w-40 md:h-40 flex items-center justify-center bg-[#e9ecef] border-card relative">
                  <FaUser size={48} className="text-normal-button" />
                  <FaPlusCircle
                    size={32}
                    className="text-normal-button absolute bottom-2 right-2"
                  />
                </div>
              )}
            </label>
            <h2 className="mt-4 text-3xl font-bold text-gray-800">
              {profileData.name}
            </h2>
          </div>
          <div className="flex-grow text-center md:text-left space-y-4 md:space-y-6 text-lg">
            <div className="flex items-center justify-center md:justify-start text-gray-600">
              <MdConfirmationNumber
                className="inline-block mr-3 ml-8 text-normal-button"
                size={22}
              />
              <span>{profileData.id}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start text-gray-600">
              <MdPhone
                className="inline-block mr-3 ml-8 text-normal-button"
                size={22}
              />
              <span>{profileData.mobile}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start text-gray-600">
              <MdEmail
                className="inline-block mr-3 ml-8 text-normal-button"
                size={22}
              />
              <span>{profileData.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
