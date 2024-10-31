/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/sidebar.jsx";
import { getAction } from "../lib/action";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import RouterStatus from "../components/admin/routers/RouterStatus";

const HotspotUser = ({ user }) => {
  const [routerList, setRouterList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAction({
          endpoint: "api/admin/routes/list",
        });
        setRouterList(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <Sidebar user={user}>
      <div className="p-4 w-screen md:w-full pb-20">
        <div className="px-4">
          <h1 className="text-2xl font-bold">User Hotspot</h1>
          <div className="mt-10">
            <h1 className="text-2xl font-bold">Pilih Router:</h1>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4">
          {routerList.map((router) => (
            <Card
              key={router._id}
              className="shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-200"
            >
              <Link to={`/hotspot/user/${router._id}`}>
                <CardHeader>
                  <img
                    src={`https://cdn.pixabay.com/photo/2020/10/03/15/11/router-5623782_960_720.png`}
                    alt={`Router ${router.name}`}
                    className="w-auto h-40 md:h-28 lg:h-20 object-cover"
                  />
                  <CardTitle className="text-md">
                    {router.name.slice(0, 20)}.
                  </CardTitle>
                  <CardDescription>
                    <RouterStatus router={router} />
                    <span className="text-xs mt-2">
                      {router.isPaymentGatewayActive
                        ? "Payment Gateway Active"
                        : "Payment Gateway Inactive"}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs">IP: {router.ip}</p>
                  <p className="text-xs">Port: {router.port}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </Sidebar>
  );
};

export default HotspotUser;
