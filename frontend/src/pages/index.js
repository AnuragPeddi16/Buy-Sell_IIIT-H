import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const ErrorMessage = ({ message }) => (
  message ? <p className="text-white font-semibold bg-red-800 p-2 rounded-md mb-4">{message}</p> : null
);

const LoadingMessage = () => (
  <div className="flex items-center justify-center h-full">
    <p className="text-xl font-semibold text-gray-300">Loading...</p>
  </div>
);

const ProfileDetails = ({ userDetails }) => (
  <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
    <div className="w-24 h-24 bg-gray-700 rounded-full mb-4 flex items-center justify-center text-gray-400 text-2xl font-bold">
      {userDetails.fname.charAt(0)}{userDetails.lname ? userDetails.lname.charAt(0) : ""}
    </div>
    <h2 className="text-xl font-semibold text-gray-200">{userDetails.fname} {userDetails.lname}</h2>
    <p className="text-gray-400">{userDetails.email}</p>
    <div className="mt-4 text-gray-300 text-sm space-y-2">
      <p><strong>Age:</strong> {userDetails.age.length === 0 ? "idk" : userDetails.age}</p>
      <p><strong>Contact:</strong> {userDetails.contact}</p>
    </div>
  </div>
);

const ProfileForm = ({ formData, handleChange }) => (
  <form>
    {["fname", "lname", "email", "age", "contact"].map((field) => (
      <div className="mb-4" key={field}>
        <label className="block font-medium mb-2">
          {field === "fname" ? "First Name" : field === "lname" ? "Last Name" : field.charAt(0).toUpperCase() + field.slice(1)}
        </label>
        <input
          type={field === "email" ? "email" : "text"}
          name={field}
          value={formData[field] || ""}
          onChange={handleChange}
          className="w-full border border-gray-700 p-2 rounded bg-gray-800 text-gray-200"
        />
      </div>
    ))}
  </form>
);

const ChangePasswordForm = ({ passwords, handleChange, handleSubmit, handleCancel, validationError }) => (
  <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold text-gray-300 mb-4">Change Password</h3>
    {['oldPassword', 'newPassword', 'confirmPassword'].map((field) => (
      <div className="mb-4" key={field}>
        <label className="block font-medium mb-2 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
        <input
          type="password"
          name={field}
          value={passwords[field] || ""}
          onChange={handleChange}
          className="w-full border border-gray-700 p-2 rounded bg-gray-800 text-gray-200"
          required
        />
      </div>
    ))}
    {validationError && <ErrorMessage message={validationError} />}
    <div className="flex justify-between mt-4">
      <button type="submit" className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Update Password</button>
      <button type="button" onClick={handleCancel} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Cancel</button>
    </div>
  </form>
);

export default function Dashboard() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [formData, setFormData] = useState({});
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [saving, setSaving] = useState(false);

  const token = "rererererere";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(process.env.BACKEND_URL + "/api/users/details", {
          headers: { Authorization: "Bearer " + token },
        });
        setUserDetails(response.data);
        setFormData({ ...response.data });
      } catch (err) {
        setError(err.response ? err.response.data : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditToggle = async () => {
    if (isEditing) {
      if (!validateForm()) return;
      await saveUserDetails();
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowPasswordForm(false);
    setFormData({ ...userDetails });
    setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" })
    setValidationError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(iiit\.ac\.in|[a-zA-Z0-9.-]+\.iiit\.ac\.in)$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError("Email should be a valid IIIT-H email");
      return false;
    }
    if (!/^[0-9]+$/.test(formData.contact)) {
      setValidationError("Phone number should contain numeric digits only");
      return false;
    }
    if (formData.contact.length !== 10) {
      setValidationError("Phone Number should be 10 digits long");
      return false;
    }

    setValidationError("");
    return true;
  };

  const saveUserDetails = async () => {
    if (JSON.stringify(formData) === JSON.stringify(userDetails)) return;

    setSaving(true);
    setValidationError("");

    try {
      const response = await axios.put(process.env.BACKEND_URL + "/api/users/details", formData, {
        headers: { Authorization: "Bearer " + token },
      });
      setUserDetails(response.data);
      setFormData(response.data);
      setValidationError("");
    } catch (err) {
      setValidationError(err.response ? err.response.data.message : "Failed to save user details.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setValidationError("New password and confirm password do not match");
      return;
    }
    axios.put(process.env.BACKEND_URL + "/api/users/password", passwords, {
      headers: { Authorization: "Bearer " + token },
    }).then(() => {
      setShowPasswordForm(false);
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setValidationError("");
    }).catch(err => {
      setValidationError(err.response ? err.response.data.message : "Failed to change password.");
    });
  };

  return (
    <div className="min-h-screen bg-gray-800 text-gray-200">
      <Navbar />
      {error ? <ErrorMessage message={error} /> : (
        <main className="p-6 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Welcome to the Dashboard</h2>

          <div className="bg-gray-900 p-6 rounded-lg shadow-md">

            { loading ? (
              <LoadingMessage />
            ) : (
              <>
              {showPasswordForm ? (
                <ChangePasswordForm 
                  passwords={passwords} 
                  handleChange={(e) => setPasswords({ ...passwords, [e.target.name]: e.target.value })} 
                  handleSubmit={handleChangePasswordSubmit}
                  handleCancel={handleCancel} 
                  validationError={validationError} 
                />
              ) : (
                <>
                  {isEditing ? <ProfileForm formData={formData} handleChange={handleChange} /> : <ProfileDetails userDetails={userDetails} />}
                  <ErrorMessage message={validationError} />
                  <div className="flex justify-between mt-6">
                    <button onClick={handleEditToggle} className="bg-blue-500 text-white py-2 px-4 rounded">{saving ? "Saving..." : isEditing ? "Save" : "Edit Profile"}</button>
                    {isEditing ? (
                      <button onClick={handleCancel} className="bg-gray-500 text-white py-2 px-4 rounded">Cancel</button>
                    ) : (
                      <button onClick={() => setShowPasswordForm(true)} className="bg-red-500 text-white py-2 px-4 rounded">Change Password</button>
                    )}
                  </div>
                </>
              )}
              </>
            )}

          </div>
        </main>
      )}
    </div>
  );
}
