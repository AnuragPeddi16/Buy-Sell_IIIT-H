import { useRouter } from 'next/router';
import Link from 'next/link';

function Navlink({ route, label, currentPath}) {

    let isActive = route === currentPath;

    return (
        <li>
            <Link href={route}
                className={`p-4 ${isActive ? 'bg-blue-500 bg-opacity-70 text-white' : 'text-blue-400 hover:text-white hover:bg-gray-600'}
                    'transition-colors rounded`}>
                {label}
            </Link>
        </li>
    );
}

export default function Navbar(props) {
    
    const router = useRouter();

    return (
        <ul className="bg-gray-900 p-4 flex items-center sticky top-0 w-full z-50 shadow-lg">
            <Navlink route="/" label="Home" currentPath={router.pathname} />
            <Navlink route="/store" label="Store" currentPath={router.pathname} />
        </ul>
    );
}
