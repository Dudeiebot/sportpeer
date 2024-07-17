import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Authcontext";
import "./settings.scss";
import { request } from "../../lib/req";

export const Settings = () => {
  const { currentUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleUsernameClick = () => {
    setShowUsernameForm(!showUsernameForm);
    setShowEmailForm(false);
    setShowPasswordForm(false);
  };

  const handleEmailClick = () => {
    setShowEmailForm(!showEmailForm);
    setShowUsernameForm(false);
    setShowPasswordForm(false);
  };

  const handlePasswordClick = () => {
    setShowPasswordForm(!showPasswordForm);
    setShowUsernameForm(false);
    setShowEmailForm(false);
  };

  const handleUpdateUsername = async (newUsername) => {
    try {
      const res = await request.put(`/user/username/${currentUser.id}`, {
        userName: newUsername,
      });
      updateUser(res.data);
      navigate("/auth/logout");
    } catch (err) {
      console.error("Update username error:", err);
      setError(err.response.data.message);
    }
  };

  const handleUpdateEmail = async (oldEmail, newEmail, otp) => {
    try {
      const res = await request.put(`/user/email/${currentUser.id}`, {
        oldEmail,
        newEmail,
        otp,
      });
      updateUser(res.data);
      navigate("/profile");
    } catch (err) {
      console.error("Update email error:", err);
      setError(err.response.data.message);
    }
  };

  const handleUpdatePassword = async (oldPassword, newPassword, otp) => {
    try {
      const res = await request.put(`/user/pass/${currentUser.id}`, {
        oldPassword,
        newPassword,
        otp,
      });
      updateUser(res.data);
      navigate("/profile");
    } catch (err) {
      console.error("Update password error:", err);
      setError(err.response.data.message);
    }
  };

  const handleLogout = async () => {
    try {
      await request.post("/auth/logout", {}, { withCredentials: true });
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userName = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const otp = formData.get("otp");

    if (showUsernameForm) {
      handleUpdateUsername(userName);
    } else if (showEmailForm) {
      const oldEmail = formData.get("oldEmail");
      handleUpdateEmail(oldEmail, email, otp);
    } else if (showPasswordForm) {
      const oldPassword = formData.get("oldPassword");
      handleUpdatePassword(oldPassword, password, otp);
    }
  };

  return (
    <div className="profileUpdatePage">
      <div className="container">
        <div className="auth">
          <h2> Settings ⚙️ </h2>

          {/* Username section */}
          <h1>
            Current Username: <b>{currentUser.username}</b>
          </h1>
          <button onClick={handleUsernameClick}>
            <h3>Change Username </h3>
          </button>
          {showUsernameForm && (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="New Username"
                name="username"
                required
              />
              <button type="submit">Update</button>
            </form>
          )}

          {/* Email section */}
          <h1>
            Current Email: <b>{currentUser.email}</b>
          </h1>
          <button onClick={handleEmailClick}>
            <h3> Change Email </h3>
          </button>
          {showEmailForm && (
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Old Email"
                name="oldEmail"
                required
              />
              <input
                type="email"
                placeholder="New Email"
                name="email"
                required
              />
              <input type="text" placeholder="Otp" name="otp" required />
              <button type="button" className="otp">
                Generate Otp
              </button>
              <button type="submit">Update</button>
            </form>
          )}

          {/* Password section */}
          <button onClick={handlePasswordClick}>
            <h3> Change Password </h3>
          </button>
          {showPasswordForm && (
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                placeholder="Old Password"
                name="oldPassword"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                name="password"
                required
              />
              <input type="text" placeholder="Otp" name="otp" required />
              <button type="button" className="otp">
                Generate Otp
              </button>
              <button type="submit">Update</button>
            </form>
          )}

          {/* Logout button */}
          <button onClick={handleLogout}>
            <h3>Logout</h3>
          </button>

          {/* Error handling */}
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
};
