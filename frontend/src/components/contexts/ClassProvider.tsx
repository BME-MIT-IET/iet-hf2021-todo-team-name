import React, { useContext } from "react";
import useLocalStorage from "../hooks/useLocalstorage";
import { Class } from "../../types";
import { v4 } from "uuid";

const ClassContext = React.createContext<ContextValue>(undefined);

export type ContextValue =
  | {
      classes: [Class];
      createClass: Function;
      editClass: Function;
      deleteClass: Function;
    }
  | undefined;

export function useClasses() {
  return useContext(ClassContext);
}

export function ClassProvider({ children }: any) {
  const [classes, setClasses] = useLocalStorage<Class[]>("classes", []);

  function createClass(name: String, color: String, icon?: String) {
    const newClass = {
      name,
      color,
      icon,
      id: v4(),
    };
    setClasses((prevClasses: [Class]) => {
      return [...prevClasses, newClass];
    });
  }
  function editClass(newClass: Class) {
    setClasses((prevClasses: [Class]) => {
      let current = prevClasses;

      const index = current.findIndex((item) => item.id === newClass.id);
      if (index === -1) return prevClasses;

      current[index] = newClass;
      return current;
    });
  }

  function deleteClass(id: String) {
    setClasses((prevClasses: [Class]) => {
      const index = prevClasses.findIndex((item) => item.id === id);
      if (index === -1) return prevClasses;
      prevClasses.splice(index, 1);
      return prevClasses;
    });
  }

  const providerValue = { classes, createClass, editClass, deleteClass };

  return (
    <ClassContext.Provider value={providerValue}>
      {children}
    </ClassContext.Provider>
  );
}
