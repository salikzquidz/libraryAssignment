import React, { useContext, useEffect, useState } from "react";
import "./index.css";
import client from "../../utils/build-client";
import { redirect } from "react-router-dom";
import { Store } from "../../store/context";
import cookies from "js-cookie";
import { Books } from "../Books";

export const Home = () => {
  const { state, dispatch } = useContext(Store);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameRegister, setUsernameRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  // Handler function for checkbox change
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle the checkbox state
  };

  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [errormessage, setErrormessage] = useState("");
  // if the user is logged in set render to the library page

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrormessage("");
    try {
      const response = await client.post("auth/login", {
        username,
        password,
      });
      if (response?.data?.userInfo) {
        console.log(response.data);

        cookies.set("username", username);
        if (response.data?.userInfo?.isAdmin) {
          cookies.set("isAdmin", "true");
        } else {
          cookies.set("isAdmin", "false");
        }
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        setErrormessage("Invalid Username Or Password");
      }
    }
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await client.post("auth/register", {
        username: usernameRegister,
        password: passwordRegister,
        isAdmin: isChecked,
      });
      console.log(response.data);
      setErrormessage("");
      window.location.reload();
    } catch (error) {
      console.error(error.message);
      if (error.response?.status === 401) {
        setErrormessage("Invalid input");
      }
      if (error.response?.status === 500) {
        setErrormessage(
          "Internal Server Error or Username already has been used"
        );
      }
    }
  };

  useEffect(() => {
    async function getCurrentUser() {
      const response = await client.get("check");
      console.log(response?.data);

      if (response?.data?.userInfo) {
        setUserInfo(response?.data?.userInfo);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }

    getCurrentUser();
    setIsLoading(false);
  }, []);

  return (
    <div className="home">
      {isLoading ? (
        <>Loading..</>
      ) : (
        <>
          {isLoggedIn ? (
            <>
              <Books />
            </>
          ) : (
            <>
              {!showRegisterForm && (
                <form action="" onSubmit={handleSubmit}>
                  <label>
                    Username :
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </label>
                  <br />
                  <label>
                    Password :
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                  <br />
                  {errormessage}
                  <br />
                  <button type="submit">Submit</button>
                  <br />
                  Don't have an account?{" "}
                  <button
                    onClick={() => setShowRegisterForm(true)}
                    type="submit"
                  >
                    Register now
                  </button>
                </form>
              )}
              {showRegisterForm && (
                <form onSubmit={handleSubmitRegister}>
                  <label>
                    Username :
                    <input
                      type="text"
                      value={usernameRegister}
                      onChange={(e) => setUsernameRegister(e.target.value)}
                      required
                    />
                  </label>
                  <br />
                  <label>
                    Password :
                    <input
                      type="password"
                      value={passwordRegister}
                      onChange={(e) => setPasswordRegister(e.target.value)}
                      required
                    />
                  </label>
                  <br />
                  <label>
                    isAdmin :
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                  </label>
                  <br />
                  {errormessage}
                  <br />
                  <button type="submit">Submit</button>
                  <br />
                  Already have an account?{" "}
                  <button
                    onClick={() => setShowRegisterForm(false)}
                    type="submit"
                  >
                    Login now
                  </button>
                </form>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
