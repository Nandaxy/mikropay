import React, { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HotspotUserTable from "./HotspotDataTable";
import { mikrotikAction } from "../../../../lib/action";

// eslint-disable-next-line react/prop-types
const HotspotUserMain = ({ routerData }) => {
  const [userHotspot, setUserHotspot] = useState([]);
  const [activeHotspot, setActiveHotspot] = useState([]);

  useEffect(() => {
    const getUserHotspot = async () => {
      const response = await mikrotikAction({
        router: routerData,
        method: "GET",
        endpoint: "ip/hotspot/user",
      });
      const filteredData = response.data?.filter(user => user.name !== "default-trial");
      setUserHotspot(filteredData);
    };

    const getActiveHotspot = async () => {
      const response = await mikrotikAction({
        router: routerData,
        method: "GET",
        endpoint: "ip/hotspot/active",
      });
      const filteredData = response.data?.filter(user => user.name !== "default-trial");
      setActiveHotspot(filteredData);
    };

    getUserHotspot();
    getActiveHotspot();
  }, [routerData]);

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <Tabs defaultValue="user" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="user">Users</TabsTrigger>
          <TabsTrigger value="active">User Active</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <HotspotUserTable userHotspot={userHotspot} routerData={routerData} />
        </TabsContent>
        <TabsContent value="active">
          <HotspotUserTable userHotspot={activeHotspot} routerData={routerData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HotspotUserMain;