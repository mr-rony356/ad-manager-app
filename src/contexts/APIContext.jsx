import React, { createContext, useContext, useMemo } from "react";
import ApiController from "@utils/API";

// Create a context
const ApiContext = createContext();

// Provider component
export const ApiProvider = ({ children }) => {
  const api = useMemo(() => new ApiController(), []);
  return <ApiContext.Provider value={{ api }}>{children}</ApiContext.Provider>;
};

// Custom hook to use the context
export const useApi = () => useContext(ApiContext);
