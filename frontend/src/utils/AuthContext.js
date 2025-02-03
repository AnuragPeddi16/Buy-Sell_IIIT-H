import { createContext, useContext, useEffect, useState } from "react";
import axios from "./axiosConfig";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const isLoggedIn = !!user;

    useEffect(() => {
        async function fetchUser() {
            try {       
                const res = await axios.get("api/users/details");
                if (res.ok) setUser(res.data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    const login = async (credentials) => {

        try {
            const res = await axios.post("/api/users/login", credentials);

            console.log(res.data.user);

            setUser(res.data.user);
            return true;
        } catch (error) {
            return false;
        }
    };

    const signup = async (userDetails) => {

        try {
            const res = await axios.post("/api/users/signup", userDetails)

            setUser(res.data.user);
            return true;
        } catch (error) {
            return false;
        }
    };

    const logout = async () => {
        try {
            await axios.post("/api/users/logout");
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout, signup, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
  return useContext(AuthContext);
}
