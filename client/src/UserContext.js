import { createContext, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userInfo, setUserIndo] = useState({});
  return (
    <UserContext.Provider value={{ userInfo, setUserIndo }}>
      {children}
    </UserContext.Provider>
  );
}
