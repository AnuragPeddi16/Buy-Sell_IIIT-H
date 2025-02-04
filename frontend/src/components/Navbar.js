import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../utils/AuthContext";

function Navlink({ route, label, currentPath }) {
    let isActive = route === currentPath;

    return (
        <li>
            <Link
                href={route}
                className={`p-4 ${isActive ? 'bg-blue-500 bg-opacity-70 text-white' : 'text-blue-400 hover:text-white hover:bg-gray-600'}
                    transition-colors rounded`}
            >
                {label}
            </Link>
        </li>
    );
}

export default function Navbar() {
    const router = useRouter();
    const { isLoggedIn, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <nav className="bg-gray-900 p-3 flex justify-between items-center sticky top-0 w-full z-50 shadow-lg">
            
            <ul className="flex items-center space-x-4">
                <Navlink route="/" label="Home" currentPath={router.pathname} />
                <Navlink route="/store" label="Store" currentPath={router.pathname} />
                <Navlink route="/orders" label="Orders" currentPath={router.pathname} />
                <Navlink route="/deliver" label="Deliver" currentPath={router.pathname} />
                <Navlink route="/cart" label="Cart" currentPath={router.pathname} />
            </ul>

            {isLoggedIn && (
                <button
                    onClick={handleLogout}
                    className="text-white bg-red-600 px-3 py-2 rounded-md hover:bg-red-500 transition"
                >
                    Logout
                </button>
            )}
        </nav>
    );
}
