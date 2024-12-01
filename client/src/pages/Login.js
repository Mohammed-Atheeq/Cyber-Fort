import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import "../CSS/Login.css"

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);
  const [captchaToken, setCaptchaToken] = useState(""); // Store the reCAPTCHA token
  const captchaRef = useRef(null); // Reference to the ReCAPTCHA component
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  let navigate = useNavigate();

  const onChange = (token) => {
    setCaptchaToken(token);
  };

  const login = async () => {
    if (!captchaToken) {
      alert("Please verify the reCAPTCHA.");
      return;
    }

    const data = { username: username, password: password, captchaToken };

    axios
      .post("http://localhost:3001/auth/login", data)
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
          // Reset CAPTCHA on error
          if (captchaRef.current) {
            captchaRef.current.reset(); // Reset the CAPTCHA widget
            setCaptchaToken(""); // Clear the expired token
          }
        } else {
          localStorage.setItem("accessToken", response.data.token);
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
          navigate("/");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 429) {
          setErrorMessage("Too many login attempts. Please try again later.");

          if (captchaRef.current) {
            captchaRef.current.reset();
            setCaptchaToken("");
          }
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="loginContainer">
      <label>Username:</label>
      <input
        type="text"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />

      <ReCAPTCHA
        sitekey="6LdYg40qAAAAAER6JTLxGjJ8I-P5pdpUOvUcPehT"
        onChange={onChange}
        ref={captchaRef} // Reference for resetting
      />

      <button onClick={login} disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}

export default Login;
