/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/sidebar.jsx";
import { getAction } from "../lib/action";
import CardRouterList from "../components/admin/hotspot/user/CardRouterList";

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
            <CardRouterList key={router._id} router={router} />
          ))}
        </div>
      </div>
    </Sidebar>
  );
};

export default HotspotUser;
