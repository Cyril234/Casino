import { useNavigate } from "react-router";

export default async function Logout() {

    const navigate = useNavigate();

    const currentToken = sessionStorage.getItem("authToken");

    if (!currentToken) {
        alert("Du bist noch gar nicht eingeloggt!");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(currentToken)
        });

        if (response.ok) {
            sessionStorage.removeItem("authToken");
            navigate("/");
        }

    } catch (error) {
        alert("Fehler beim Logout!")
    }

    return null;
}