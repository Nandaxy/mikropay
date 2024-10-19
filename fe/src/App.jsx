import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Member from "./pages/Member";
import Header from "./components/layout/Header";
import TripaySettings from "./pages/TripaySettings";
import GeneralSettings from "./pages/GeneralSettings";
import RouterSettings from "./pages/RouterSettings";
import HotspotProfile from "./pages/HotspotProfile";
import RouterDetail from "./pages/RouterDetail";
import { jwtDecode } from "jwt-decode";
import { refreshToken } from "./lib/auth";
import { Toaster } from "@/components/ui/toaster";
import HotspotUser from "./pages/HotspotUser";
import HotspotUserDetail from "./pages/HotspotUserDetail";

const useTokenRefresh = (
  setAccessToken,
  refreshInProgress,
  setRefreshInProgress
) => {
  useEffect(() => {
    const interval = setInterval(async () => {
      const refreshTokenValue = localStorage.getItem("refreshToken");
      if (refreshTokenValue && !refreshInProgress) {
        try {
          setRefreshInProgress(true);
          const { data } = await refreshToken({
            token: refreshTokenValue,
          });
          localStorage.setItem("accessToken", data.accessToken);
          setAccessToken(data.accessToken);
        } catch (error) {
          console.error(error);
        } finally {
          setRefreshInProgress(false);
        }
      }
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, [setAccessToken, refreshInProgress, setRefreshInProgress]);
};

const App = () => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [refreshInProgress, setRefreshInProgress] = useState(false);
  const navigate = useNavigate();

  useTokenRefresh(setAccessToken, refreshInProgress, setRefreshInProgress);

  useEffect(() => {
    const handleTokenRefresh = async () => {
      if (accessToken) {
        const decodedToken = jwtDecode(accessToken);
        if (decodedToken.exp * 1000 < Date.now()) {
          const refreshTokenValue = localStorage.getItem("refreshToken");
          if (refreshTokenValue) {
            try {
              setRefreshInProgress(true);
              const { data } = await refreshToken({
                token: refreshTokenValue,
              });
              localStorage.setItem("accessToken", data.accessToken);
              setAccessToken(data.accessToken);
            } catch (error) {
              console.error(error);
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              navigate("/login");
            } finally {
              setRefreshInProgress(false);
            }
          } else {
            navigate("/login");
          }
        }
      }
    };
    handleTokenRefresh();
  }, [accessToken, navigate]);

  const decodedToken = accessToken ? jwtDecode(accessToken) : null;

  const isTokenExpired = decodedToken
    ? decodedToken.exp * 1000 < Date.now()
    : true;

  const role = decodedToken ? decodedToken.role : null;

  return (
    <div className="min-h-screen">
      <Toaster />
      <Header />
      <Routes>
        <Route
          path="/login"
          element={
            accessToken && !isTokenExpired ? (
              role === "admin" ? (
                <Navigate to="/dashboard" />
              ) : role === "user" ? (
                <Navigate to="/member" />
              ) : (
                <Login setAccessToken={setAccessToken} />
              )
            ) : (
              <Login setAccessToken={setAccessToken} />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            !accessToken || isTokenExpired ? (
              <Navigate to="/login" />
            ) : role === "admin" ? (
              <Dashboard user={decodedToken} />
            ) : role === "user" ? (
              <Navigate to="/member" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/setting/tripay"
          element={
            !accessToken || isTokenExpired ? (
              <Navigate to="/login" />
            ) : role === "admin" ? (
              <TripaySettings user={decodedToken} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/setting/general"
          element={
            !accessToken || isTokenExpired ? (
              <Navigate to="/login" />
            ) : role === "admin" ? (
              <GeneralSettings user={decodedToken} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/router"
          element={
            !accessToken || isTokenExpired ? (
              <Navigate to="/login" />
            ) : role === "admin" ? (
              <RouterSettings user={decodedToken} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/hotspot/profile"
          element={
            !accessToken || isTokenExpired ? (
              <Navigate to="/login" />
            ) : role === "admin" ? (
              <HotspotProfile user={decodedToken} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/hotspot/user"
          element={
            !accessToken || isTokenExpired ? (
              <Navigate to="/login" />
            ) : role === "admin" ? (
              <HotspotUser user={decodedToken} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/hotspot/user/:id"
          element={
            !accessToken || isTokenExpired ? (
              <Navigate to="/login" />
            ) : role === "admin" ? (
              <HotspotUserDetail user={decodedToken} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/router/:id"
          element={
            !accessToken || isTokenExpired ? (
              <Navigate to="/login" />
            ) : role === "admin" ? (
              <RouterDetail user={decodedToken} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/" element={<Navigate to="/login" />} />

        <Route
          path="/member"
          element={
            !accessToken || isTokenExpired ? (
              <Navigate to="/login" />
            ) : role === "user" ? (
              <Member />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-lg mb-4">Page Not Found</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Go back to Home
      </Link>
    </div>
  );
};

export default App;
