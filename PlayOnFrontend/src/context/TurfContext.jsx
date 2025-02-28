import React, { createContext, useState, useEffect } from "react";
import { getAllTurfs } from "../api/turfApi";

export const TurfContext = createContext();

export const TurfProvider = ({ children }) => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const data = await getAllTurfs();
        setTurfs(data);
      } catch (error) {
        console.error("Error fetching turfs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTurfs();
  }, []);

  return (
    <TurfContext.Provider value={{ turfs, loading }}>
      {children}
    </TurfContext.Provider>
  );
};
