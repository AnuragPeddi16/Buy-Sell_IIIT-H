import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../utils/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {login} = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login({ email: email, password: password });

    if (success) router.push("/");
    else setErrorMessage("Invalid email or password");

  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl text-gray-100 font-semibold mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-gray-400">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-1 text-gray-800 bg-gray-200 rounded-md focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-gray-400">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 text-gray-800 bg-gray-200 rounded-md focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

            {errorMessage && (
                <div className="bg-red-800 text-white font-semibold p-2 rounded-md mb-4 text-center">
                    {errorMessage}
                </div>
            )}

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center text-gray-400">
          <span>Don't have an account? </span>
          <a href="/signup" className="text-blue-400 hover:text-blue-300">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;