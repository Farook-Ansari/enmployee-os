import React, { createContext, useContext, useState } from "react";

const AssistantContext = createContext();

export const useAssistant = () => useContext(AssistantContext);

export const AssistantProvider = ({ children }) => {
  const [pendingMode, setPendingMode] = useState(null); // 'project-ds' | 'filter' | null
  const [pendingVisible, setPendingVisible] = useState(false); // Whether new badge/shows on bell
  const [pendingValue, setPendingValue] = useState(""); // User’s answer in sidecar

  // Called by main chat when it sees AI’s special question
  const setPendingRequest = (mode) => {
    setPendingMode(mode);
    setPendingVisible(true);
  };
  // Called by sidecar on submit
  const clearPendingRequest = () => {
    setPendingMode(null);
    setPendingVisible(false);
    setPendingValue("");
  };

  return (
    <AssistantContext.Provider value={{
      pendingMode,
      pendingVisible,
      setPendingRequest,
      clearPendingRequest,
      pendingValue,
      setPendingValue,
    }}>
      {children}
    </AssistantContext.Provider>
  );
};
