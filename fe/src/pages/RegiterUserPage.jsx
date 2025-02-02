import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getAction, postAction } from "../lib/action";
import { Navigate, useNavigate } from "react-router-dom";

const RegisterUserPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [exist, setExist] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await getAction({ endpoint: "status/if/first-time" });
        setExist(response.status);
      } catch (error) {
        console.error(error);
        setExist(false);
      }
    };
    checkStatus();
  }, []);

  if (!exist) {
    return <Navigate to="/login" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Kata sandi tidak cocok");
      return;
    }
    setIsLoading(true);

    try {
      const response = await postAction({
        endpoint: "api/user/first-time",
        data: {
          username,
          password,
        },
      });

      if (response.data.status) {
        toast({
          title: "User berhasil dibuat",
          description: "Mengarahkan ke halaman login dalam 1 detik",
          className: "bg-green-500",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setError(response.data.message);
        toast({
          title: "User gagal dibuat",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Silahkan coba lagi nanti",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-center text-2xl font-bold text-gray-700">
          Buat User Default Untuk Admin
        </h2>
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
              Kata Sandi
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
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Konfirmasi Kata Sandi
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <Button
            type="submit"
            className="w-full px-4 py-2 font-bold rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            disabled={isLoading}
          >
            {isLoading ? "Memuat" : "Buat"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserPage;
