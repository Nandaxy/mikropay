/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HotspotUserTable from "./HotspotDataTable";
import { useEffect, useState } from "react";
import { mikrotikAction } from "../../../../lib/action";

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
      setUserHotspot(response.data);
      //   console.log(response.data);
    };

    getUserHotspot();
  }, [routerData]);

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <Tabs defaultValue="user" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="user">Users</TabsTrigger>
          <TabsTrigger value="active">User Active</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <h1>Tes User</h1>
          <HotspotUserTable userHotspot={userHotspot} />
        </TabsContent>
        <TabsContent value="active">
          <h1>Tes Active</h1>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HotspotUserMain;
