import React from 'react';
const UserContext = React.createContext({token:'', auth: false });

// @function  UserProvider
// Create function to provide UserContext
const UserProvider = ({ children }) => {
  const [user, setUser] = React.useState({token:'', auth: false });

  const loginContext = (token) => {
    setUser((user) => ({
      token:token,
      
      auth: true,
    }));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    localStorage.clear();
    localStorage.removeItem("token");
    
    setUser((user) => ({
      token:'',
      auth: false,
    }));
  };

  return (
    <UserContext.Provider value={{ user, loginContext, logout }}>
      {children}
    </UserContext.Provider>
  );
};



export {UserContext,UserProvider};