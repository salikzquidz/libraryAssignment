import logo from "./logo.svg";
import "./App.css";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import client from "./utils/build-client";
import { useCookies } from "react-cookie";
import Cookies from "js-cookie";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import Layout from "./components/Layout";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [formMessage, setFormMessage] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);

  const handleSubmit = async (e) => {
    setFormMessage("");
    e.preventDefault();
    console.log("Submitting");
    try {
      const response = await client.post(
        "auth/login",
        {
          username,
          password,
        }
        // { withCredentials: true }
      );
      if (response?.data?.username) {
      }
      console.log(response.data);
    } catch (error) {
      console.error(error);
      console.log(error?.response?.data);
      if (error?.response?.status === 401) {
        setFormMessage("Invalid username or password");
      }
    }
  };

  Cookies.set("jwt", "ON");
  useEffect(() => {
    const jwtToken = cookies.jwt;
    if (jwtToken) {
      // validate token
      console.log(jwtToken);
    }
    console.log(Cookies.get("jwt"));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />}></Route>
        <Route path="/login" element={<Home />}></Route>
      </Route>
    </Routes>
    /* <div className="header">Library</div>
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {formMessage}
          <br />
          <button type="submit">Submit</button>
        </form>
      </div> */
  );
}

export default App;
