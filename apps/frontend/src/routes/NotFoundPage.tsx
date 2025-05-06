import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="flex justify-center items-center flex-col h-full text-center">
            <h1 className="text-4xl mb-4">404 - Oops! Page Not Found</h1>
            <p className="mb-4">Looks like the page you were looking for went on vacation.</p>
            <p className="mb-6">But hey, how about a quick game to ease your search for the lost page?</p>
            <div>
                <Link
                    to="/Dino"
                    className="bg-[var(--color-mgbblue)] text-white px-6 py-3 rounded-lg text-lg hover:bg-[var(--color-mgbyellow)] transition duration-300 mx-2"
                >
                    Play Dino Game
                </Link>
                <span className="mx-2">|</span>
                <Link
                    to="/2048"
                    className="bg-[var(--color-mgbblue)] text-white px-6 py-3 rounded-lg text-lg hover:bg-[var(--color-mgbyellow)] transition duration-300 mx-2"
                >
                    Try 2048
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
