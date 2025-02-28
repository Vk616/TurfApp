import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuth = () => {
  const { user, login, register, logout, loading } = useContext(AuthContext);
  return { user, login, register, logout, loading };
};

export default useAuth;
