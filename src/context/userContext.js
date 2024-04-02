"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [user, setUser] = useState("");

  useEffect(() => {
    const initialUser = localStorage.getItem("user");
    setUser(JSON.parse(initialUser));
  }, []);

  const SaveUser = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
  };

  const LogOutUser = () => {
    localStorage.removeItem("user");
  };

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        SaveUser,
        LogOutUser,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
