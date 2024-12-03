import React, { useState, useEffect } from "react";
import "./userProfile.css";
import { useSelector, useDispatch } from "react-redux";
import { setProfile } from "./store";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { ActiveUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfileState] = useState({
    name: "",
    age: "",
    gender: "",
    address: "",
    email: "",
    phone: "",
    image: "",
  });

  // Initialize profile data
  useEffect(() => {
    if (ActiveUser) {
      setProfileState({
        name: ActiveUser.name || "",
        age: ActiveUser.age || "",
        gender: ActiveUser.gender || "",
        address: ActiveUser.address || "",
        email: ActiveUser.email || "",
        phone: ActiveUser.phone || "",
        image: ActiveUser.image || "",
      });
    }
  }, [ActiveUser]);

  // Handle input changes
  const handleInputChange = (e) => {
    setProfileState({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // Handle profile save
  const handleSaveProfile = () => {
    const { name, age, email, phone } = profile;

    // Basic input validation
    if (!name || !email || !phone || isNaN(age) || age <= 0) {
      alert("Please fill in all required fields with valid data.");
      return;
    }

    dispatch(setProfile(profile));
    setIsEditing(false);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileState({ ...profile, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header">
          <img
            src={profile.image || "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-image"
          />
          <div className="profile-info">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                placeholder="Enter your name"
                className="profile-input"
                onChange={handleInputChange}
              />
            ) : (
              <h2>{profile.name || "Your Name"}</h2>
            )}
            {isEditing ? (
              <input
                type="number"
                name="age"
                value={profile.age}
                placeholder="Enter your age"
                className="profile-input"
                onChange={handleInputChange}
              />
            ) : (
              <p>Age: {profile.age || "Not Specified"}</p>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          <h3>Contact Information</h3>
          {isEditing ? (
            <>
              <input
                type="email"
                name="email"
                value={profile.email}
                placeholder="Enter your email"
                className="profile-input"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="phone"
                value={profile.phone}
                placeholder="Enter your phone number"
                className="profile-input"
                onChange={handleInputChange}
              />
            </>
          ) : (
            <>
              <p>Email: {profile.email || "Not Specified"}</p>
              <p>Phone: {profile.phone || "Not Specified"}</p>
            </>
          )}

          <h3>Additional Details</h3>
          {isEditing ? (
            <>
              <input
                type="text"
                name="gender"
                value={profile.gender}
                placeholder="Enter your gender"
                className="profile-input"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="address"
                value={profile.address}
                placeholder="Enter your address"
                className="profile-input"
                onChange={handleInputChange}
              />
            </>
          ) : (
            <>
              <p>Gender: {profile.gender || "Not Specified"}</p>
              <p>Address: {profile.address || "Not Specified"}</p>
            </>
          )}
        </div>

        {/* Upload Image */}
        {isEditing && (
          <div className="upload-section">
            <label htmlFor="image-upload" className="upload-btn">
              Upload New Profile Picture
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="profile-actions">
          <button onClick={toggleEditMode} className="edit-btn">
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
          {isEditing && (
            <button onClick={handleSaveProfile} className="save-btn">
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
