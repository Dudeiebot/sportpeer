import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import "./register.scss";
import { request } from "../../lib/req";

export const Register = () => {
  const [inputs, setInputs] = useState([]);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [verificationMethod, setVerificationMethod] = useState("");
  const [err, setErr] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Event handlers
  const handlePhoneChange = (value, country) => {
    console.log("Phone changed:", value);
    console.log("Country info:", country);

    //remove non numeric value
    const NewPhone = value.replace(/[^\d\s-]/g, "");
    setPhone(NewPhone);
  };

  const handleInputChange = (index, value) => {
    console.log(`Input ${index} changed:`, value);
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handleAddInput = () => {
    console.log("Adding new input...");
    setInputs([...inputs, ""]);
  };

  const handleRemoveInput = (index) => {
    console.log("Removing input at index:", index);
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };

  const handlePasswordChange = (e) => {
    console.log("Password changed:", e.target.value);
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    console.log("Confirm password changed:", e.target.value);
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!");

    setIsLoading(true);
    setErr("");

    try {
      const formData = new FormData(e.target);
      const email = formData.get("email");
      console.log("Email:", email);

      const password = formData.get("password");
      console.log("Password:", password);

      const bio = formData.get("bio");
      console.log("Bio:", bio);

      const phoneNos = formData.get("phone");
      console.log("Phone:", phone);

      const verificationMethod = formData.get("verificationMethod");
      console.log("Verification method:", verificationMethod);

      const sportInterest = inputs.filter((sport) => sport.trim() !== "");
      console.log("Sports:", sportInterest);

      // Example: Assuming `request` is an axios instance or similar for HTTP requests
      const res = await request.post("/auth/register", {
        email,
        password,
        bio,
        phoneNos,
        verificationMethod,
        sportInterest,
      });

      console.log("Registration response:", res);

      navigate("/login");
    } catch (err) {
      if (err.response) {
        console.error("Error response:", err.response.data.message);
        setErr(err.response.data.message);
      } else {
        console.error("Unexpected error:", err.message);
        setErr("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registerapp">
      <div className="container">
        <div className="auth">
          <h1>Create Account 🥳 </h1>
          <form onSubmit={handleSubmit}>
            <input required type="email" placeholder="Email" name="email" />
            <input
              required
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              name="password"
            />
            <input
              required
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              name="confirmPassword"
            />
            {err && <span style={{ color: "red" }}>{err}</span>}

            <textarea
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="4"
              cols="50"
              name="bio"
            />

            {inputs.map((value, index) => (
              <div key={index} className="form-group">
                <input
                  required
                  type="text"
                  value={value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder={`Favorite Sport ${index + 1}`}
                  name={`sport${index + 1}`}
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveInput(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <div className="form-group">
              <button type="button" onClick={handleAddInput}>
                Click to add Favorite Sport
              </button>
            </div>

            <PhoneInput
              country={"eg"}
              enableSearch={true}
              value={phone}
              onChange={(value, country) => handlePhoneChange(value, country)}
              inputProps={{
                required: true,
                placeholder: "Phone Number",
                name: "phone",
              }}
            />

            <select
              value={verificationMethod}
              onChange={(e) => setVerificationMethod(e.target.value)}
              name="verificationMethod"
              required
            >
              <option value="">Select Verification Method</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>
            <button type="submit" disabled={isLoading}>
              Register
            </button>
            {err && <p>{err}</p>}
            <span>
              Have an Account? <Link to="/login">Login</Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};
