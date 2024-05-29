import { useEffect, useState } from "react";

import TitleWithImages from "../components/TitleWithImages";
import "../styles/Title.css";



function perfil() {
    const [userProfile, setUserProfile] = useState(null);
    useEffect(() => {
        // Fetch user profile from session
        const fetchProfile = async () => {
            try {
                const response = await fetch("./api/profile");
                if (response.ok) {
                    const profile = await response.json();
                    setUserProfile(profile);
                } else {
                    // Handle error
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, []);

    return (
        <div style={{ marginLeft: "400px" }}>
            <TitleWithImages title="Perfil" />
            {userProfile && (
                <div>
                    <p>Name: {userProfile.name}</p>
                    <p>Email: {userProfile.email}</p>
                    {/* Render other user information here */}
                </div>
            )}
        </div>
    );
}

export default perfil;