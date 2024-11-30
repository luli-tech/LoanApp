import React, { useState, useEffect } from "react";
import "./userprofile.css";
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
    image: "", // Add image to state
  });

  // Initialize profile data from ActiveUser or localStorage
  useEffect(() => {
    if (ActiveUser) {
      setProfileState({
        name: ActiveUser.name || "",
        age: ActiveUser.age || "",
        gender: ActiveUser.gender || "",
        address: ActiveUser.address || "",
        email: ActiveUser.email || "",
        phone: ActiveUser.phone || "",
        image: ActiveUser.image || "", // Fetch image from ActiveUser if available
      });
    } else {
      const savedImage = localStorage.getItem("profileImage");
      if (savedImage) {
        setProfileState((prevState) => ({
          ...prevState,
          image: savedImage, // Load image from localStorage if available
        }));
      }
    }
  }, [ActiveUser]);

  // Handle profile input changes
  const handleInputChange = (e) => {
    setProfileState({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // Handle saving profile to Redux store
  const handleSaveProfile = () => {
    dispatch(setProfile(profile)); // Dispatch updated profile to Redux
    setIsEditing(false);
  };

  // Handle image upload and convert to base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result; // Convert image to base64
        setProfileState({
          ...profile,
          image: base64Image, // Set the base64 image in profile state
        });
        localStorage.setItem("profileImage", base64Image); // Save base64 image to localStorage
      };
      reader.readAsDataURL(file); // Convert file to base64
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            alt="Profile"
            className="profile-image"
            src={profile.image || "default-image-url.jpg"} // Display the uploaded image or a default image
          />
          <div className="profile-name">
            {isEditing ? (
              <input
                type="text"
                onChange={handleInputChange}
                value={profile.name}
                name="name"
                placeholder="Name"
                className="profile-input"
              />
            ) : (
              <h2>{profile.name}</h2>
            )}
            {isEditing ? (
              <input
                type="number"
                value={profile.age}
                onChange={handleInputChange}
                name="age"
                placeholder="Age"
                className="profile-input"
              />
            ) : (
              <p>Age: {profile.age}</p>
            )}
          </div>
        </div>
        <div className="profile-details">
          {isEditing ? (
            <>
              <input
                type="email"
                onChange={handleInputChange}
                value={profile.email}
                name="email"
                placeholder="Email"
                className="profile-input"
              />
              <input
                type="text"
                value={profile.phone}
                onChange={handleInputChange}
                name="phone"
                placeholder="Phone"
                className="profile-input"
              />
              <input
                type="text"
                value={profile.gender}
                onChange={handleInputChange}
                name="gender"
                placeholder="Gender"
                className="profile-input"
              />
              <input
                type="text"
                value={profile.address}
                onChange={handleInputChange}
                name="address"
                placeholder="Address"
                className="profile-input"
              />
            </>
          ) : (
            <>
              <p>Gender: {profile.gender}</p>
              <p>Email: {profile.email}</p>
              <p>Phone: {profile.phone}</p>
              <p>Address: {profile.address}</p>
            </>
          )}
        </div>
        {isEditing && (
          <div className="upload-image">
            <label htmlFor="image-upload" className="upload-btn">
              Upload Image
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload} // Handle the file upload
            />
          </div>
        )}
        <div className="profile-actions">
          <button onClick={toggleEditMode} className="edit-btn">
            {isEditing ? "Cancel" : "Edit"}
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
