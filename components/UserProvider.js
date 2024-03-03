import { createContext, useContext } from 'react'

const UserContext = createContext();
export const getUser = () => useContext(UserContext);

export const UserProvider = ({ children, user }) => (
  <UserContext.Provider value={user}>{children}</UserContext.Provider>
);
