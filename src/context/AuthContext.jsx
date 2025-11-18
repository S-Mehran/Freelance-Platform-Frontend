import { createContext, useContext, useState, useEffect } from "react";
import useAxios from "../hooks/useAxios"

const AuthContext = createContext(null)


export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const {response, error, fetchData} = useAxios()
    const [initialized, setInitialized] = useState(false)
    const isAuthenticated = !!user

  useEffect(() => {
    fetchData({ url: "/profile", method: "GET" }).finally(() => setLoading(false));
  }, []);


    useEffect(() => {
        if (response?.message) {
        // Normalize API shape: some endpoints return { message: user }, others return user directly
        setUser(response.message ?? response);
        }
        if (!loading) {
        setInitialized(true);
        }
    }, [response, loading, error]);

//    if (!initialized) return "Loading...";



    return (
        <AuthContext.Provider value={{user, setUser, isAuthenticated, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context
}