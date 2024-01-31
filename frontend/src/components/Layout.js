import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { Store } from "../store/context";
import cookies from "js-cookie";
import axios from "axios";
import client from "../utils/build-client";

export default function Layout({ title, children }) {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const handleLogout = async () => {
    try {
      const response = await client.post("/auth/logout");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="header">
        Welcome To Library{" "}
        {cookies.get("username") !== undefined && (
          <>{cookies.get("username")} !!</>
        )}
        <br />
        {cookies.get("username") !== "" &&
          cookies.get("username") &&
          cookies.get("isAdmin") === "true" && (
            <>
              You are an admin <br />{" "}
              <button onClick={handleLogout}>Logout</button>{" "}
            </>
          )}
        {cookies.get("username") !== "" &&
          cookies.get("username") &&
          cookies.get("isAdmin") === "false" && (
            <>
              You are a guest <br />{" "}
              <button onClick={handleLogout}>Logout</button>{" "}
            </>
          )}
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
