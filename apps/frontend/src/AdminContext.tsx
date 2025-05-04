import { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const AdminContext = createContext(false);

//global hook to access Admin Status
export const useAdmin = () => useContext(AdminContext);

//checks Admin Status
export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user) {
            // Assuming user roles are stored in user['https://your-app.com/roles']
            const roles = user["https://your-app.com/roles"] || [];
            setIsAdmin(roles.includes("Admin"));
        }
    }, [isAuthenticated, user]);

    if (isLoading) {
        return <div>Loading...</div>; // Or a loading spinner
    }

    return <AdminContext.Provider value={isAdmin}>{children}</AdminContext.Provider>;
};
