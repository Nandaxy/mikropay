/* eslint-disable react/prop-types */
import { postAction } from "../lib/action";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Member = ({ user }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("refreshToken");
      const payload = { token };

      const response = await postAction({
        endpoint: "api/auth/logout",
        data: payload,
      });

      if (response.data.status === 200) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        toast({
          title: "Logout Successful",
          description: "You have been logged out.",
          variant: "default",
        });

        window.location.reload();
      } else {
        toast({
          title: "Logout Failed",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  console.log(user);
  const sessionExpirationDate = new Date(user.exp * 1000).toLocaleString();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg transform transition-all duration-500 ease-in-out hover:scale-105">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Welcome, {user.username || "Member"}!
        </h1>
        <p className="text-center text-gray-600 mt-2">
          This is your dashboard. Manage your account and settings here.
        </p>

        <div className="mt-6 flex flex-col items-center space-y-4">
          {/* Profile Details */}
          <div className="w-full bg-gray-100 p-4 rounded-lg shadow-inner">
            <h2 className="text-lg font-semibold text-gray-700">
              Account Details
            </h2>
            <p className="text-gray-600 mt-1">Email: {user.email}</p>
            <p className="text-gray-600 mt-1">Username: {user.username}</p>
            <p className="text-gray-600 mt-1">Role: {user.role}</p>
            <p className="text-gray-600 mt-1">
              Session Expired: {sessionExpirationDate}
            </p>
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Member;
