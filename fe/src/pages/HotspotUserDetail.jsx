/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/sidebar.jsx";
import { getAction } from "../lib/action";

import { useParams } from "react-router-dom";
import HotspotUserMain from "../components/admin/hotspot/user/HotspotUserMain";

const HotspotUserDetail = ({ user }) => {
  const [routerData, setRouterData] = useState([]);
  const [isNotFound, setIsNotFound] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAction({
          endpoint: "api/admin/routes/find/" + id,
        });
        setRouterData(response.data);
      } catch (error) {
        setIsNotFound(true);
      }
    };

    fetchData();
  }, [id]);

  // console.log(routerData);

  if (isNotFound) {
    return (
      <h1 className="text-center text-red-500">
        Error : Router Tidak ada di Database
      </h1>
    );
  }

  return (
    <Sidebar user={user}>
      <div className="p-4 w-screen md:w-full pb-20">
        <div className="px-4">
          <h1 className="text-2xl font-bold">
            User Hotspot {routerData?.name}
          </h1>
          <div className="mt-10">
            <HotspotUserMain routerData={routerData} />
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4"></div>
      </div>
    </Sidebar>
  );
};

export default HotspotUserDetail;
