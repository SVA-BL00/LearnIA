import React, { createContext, useContext, useState, useEffect } from "react";


const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    async function fetchUser() {
        try {
        const response = await fetch("/auth/user");
        const userData = await response.json();
        setUser(userData);
        } catch (error) {
        setError("Error fetching user data");
        } finally {
        setLoading(false);
        }
    }

    fetchUser();
    }, []);

    return (
    <UserContext.Provider value={{ user, loading, error }}>
        {children}
    </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}