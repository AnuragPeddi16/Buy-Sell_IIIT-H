import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "./AuthContext";
import Navbar from "../components/Navbar";

export default function withAuth(Component) {
    return function ProtectedRoute(props) {
        const { isLoggedIn, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading && !isLoggedIn) {
                router.push("/login");
            }
        }, [isLoggedIn, loading]);

        return loading ? (
            <div className="min-h-screen bg-gray-800 text-gray-200">
                
                <Navbar />
                <div className="flex items-center justify-center h-full">
                    <p className="text-xl font-semibold text-gray-300">Loading...</p>
                </div>
                
            </div>
        ) : (
            isLoggedIn ? <Component {...props} /> : null
        );
    };
}
