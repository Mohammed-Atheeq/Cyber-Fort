import React, { useState } from "react";
import axios from "axios";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const changePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Both fields are required.");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword != confirmPassword) {
      setErrorMessage("Password Doesn't Match");
      return;
    }

    setErrorMessage("");

    axios
      .put(
        "http://localhost:3001/auth/changepassword",
        {
          oldPassword: oldPassword,
          newPassword: confirmPassword,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          setOldPassword("");
          setNewPassword("");
          setconfirmPassword("");
          alert("Password changed successfully!");
        }
      })
      .catch((error) => {
        if (error.response) {
          // Server responded with a status other than 2xx
          alert(
            error.response.data.error || "An error occurred on the server."
          );
        } else if (error.request) {
          // Request was made, but no response was received
          alert("No response from the server. Please try again later.");
        } else {
          // Something else happened
          alert("An unexpected error occurred.");
        }
      });
  };

  return (
    <div>
      <h1>Change Your Password</h1>
      <input
        type="password"
        placeholder="Old Password..."
        value={oldPassword}
        onChange={(event) => {
          setOldPassword(event.target.value);
        }}
      />
      <input
        type="password"
        placeholder="New Password..."
        value={newPassword}
        onChange={(event) => {
          setNewPassword(event.target.value);
        }}
      />
      <input
        type="passwword"
        placeholder="Confirm Password..."
        value={confirmPassword}
        onChange={(event) => {
          setconfirmPassword(event.target.value);
        }}
      />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <button onClick={changePassword}> Save Changes</button>
    </div>
  );
}

export default ChangePassword;
