import { createContext, useContext, useState } from "react";
import { View, Text, Button } from "react-native";

const CheckInfo = createContext(null);

export function CheckInfoProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({
    id: 0,
    role: "",
  });

  return (
    <CheckInfo.Provider value={{ user, setUser, loggedIn, setLoggedIn }}>
      {children}
    </CheckInfo.Provider>
  );
}

export function useCheckInfo() {
  return useContext(CheckInfo);
}
