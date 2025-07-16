import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const doLogout = async () => {
            const currentToken = sessionStorage.getItem("authToken");



            if (!currentToken) {
                alert("Du bist noch gar nicht eingeloggt!");
                navigate("/");
                return;
            }

            try {
                const response = await fetch("http://localhost:8080/api/logout", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${currentToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ token: currentToken })
                });

                if (response.ok) {
                    sessionStorage.removeItem("authToken");
                    if (sessionStorage.getItem("username")) {
                        sessionStorage.removeItem("username");
                    }
                    navigate("/");
                } else {
                    alert("Logout fehlgeschlagen!");
                    navigate("/");
                }
            } catch (error) {
                alert("Fehler beim Logout!");
                console.error(error);
                navigate("/");
            }
        };

        doLogout();
    }, [navigate]);

    return null;
};

export default Logout;
