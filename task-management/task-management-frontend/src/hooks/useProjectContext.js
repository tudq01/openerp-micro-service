import { useContext } from "react";
import ProjectContext from "../context/ProjectContext";

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error(
      "useProjectContext must be used within a ProjectContextProvider"
    );
  }

  return context;
};
