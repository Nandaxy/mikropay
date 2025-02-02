/* eslint-disable react/prop-types */
import { Badge } from "@/components/ui/badge";
import { mikrotikAction } from "../../../lib/action";
import { useEffect, useState } from "react";

const RouterStatus = ({ router, onStatusChange }) => {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await mikrotikAction({
          router,
          method: "GET",
          endpoint: "system/identity",
        });
        // console.log(response);

        if (response.status === 200) {
          setStatus("Online");
          onStatusChange("Online");
        } else if (response.status === 401) {
          setStatus("Unauthorized");
          onStatusChange("Unauthorized");
        } else {
          setStatus("Offline");
          onStatusChange("Offline");
        }
      } catch (error) {
        console.error("Error checking status:", error);
        setStatus("Offline");
        onStatusChange("Offline");
      }
    };

    checkStatus();
  }, [router, onStatusChange]);

  return (
    <div>
      {status === "Checking..." ? (
        <Badge variant="outline">{status}</Badge>
      ) : status === "Online" ? (
        <Badge className="bg-green-500">{status}</Badge>
      ) : (
        <Badge variant="destructive">{status}</Badge>
      )}
    </div>
  );
};

export default RouterStatus;
