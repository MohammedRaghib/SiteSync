import { createContext, useContext, useState } from "react";
import { View, Text, Button } from "react-native";

const CheckInfo = createContext(null);

export function CheckInfoProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({
    id: 0,
    role: "",
  });

  const hasAccess = ({ requiresLogin = true, allowedRoles = [] }) => {
    if (requiresLogin && !loggedIn) return false;
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) return false;
    return true;
  };

  return (
    <CheckInfo.Provider
      value={{ user, setUser, loggedIn, setLoggedIn, hasAccess }}
    >
      {children}
    </CheckInfo.Provider>
  );
}

export function useCheckInfo() {
  return useContext(CheckInfo);
}
