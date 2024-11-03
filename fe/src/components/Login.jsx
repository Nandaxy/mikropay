import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../lib/auth";
import { getAction } from "../lib/action";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

// eslint-disable-next-line react/prop-types
const Login = ({ setAccessToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [dbStatus, setDbStatus] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkDbStatus = async () => {
      try {
        const response = await getAction({ endpoint: "status" });

        setDbStatus(response.status);
      } catch (err) {
        setDbStatus(false);
      }
    };
    checkDbStatus();
  }, []);

  const handleSubmit = async (e) => {
    if (!username || !password) {
      setError("Please enter your username and password.");
      return;
    }
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const { data } = await login({ username, password });
      console.log(data);

      if (data.status === 200) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        setAccessToken(data.accessToken);
        toast({
          title: "Login Berhasil",
          description: "Mengarahkan ke dashboard dalam 1 detik",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setError("Username atau password salah. Silahkan coba lagi.");
      }
    } catch (error) {
      setError("Username atau password salah. Silahkan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const DbDownComponent = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Oops!</h1>
      <p className="text-lg text-red-500 px-6 text-center">
        Our database is currently down. Please try again later.
      </p>
      <p className="text-lg text-red-500">
        The application may not run properly
      </p>
    </div>
  );

  if (!dbStatus) {
    return <DbDownComponent />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-center text-2xl font-bold text-gray-700">Login</h2>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          {!isLoading ? (
            <Button
              type="submit"
              className="w-full px-4 py-2 font-bold rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            >
              Sign In
            </Button>
          ) : (
            <Button
              disabled
              className="w-full px-4 py-2 font-bold rounded-md"
            >
              Loading
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
