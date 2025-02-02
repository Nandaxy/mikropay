/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import RouterStatus from "@/components/admin/routers/RouterStatus";

const CardRouterList = ({ router }) => {
  const [status, setStatus] = useState("Checking...");
  console.log("router", router);
  console.log("status", status);

  const cardContent = (
    <>
      <CardHeader>
        <img
          src="https://cdn.pixabay.com/photo/2020/10/03/15/11/router-5623782_960_720.png"
          alt={`Router ${router.name}`}
          className="w-auto h-40 md:h-28 lg:h-20 object-cover"
        />
        <CardTitle className="text-md">{router.name.slice(0, 20)}</CardTitle>
        <CardDescription>
          <RouterStatus router={router} onStatusChange={setStatus} />
          <span className="text-xs mt-2 block">
            {router.isPaymentGatewayActive
              ? "Payment Gateway Active"
              : "Payment Gateway Inactive"}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-xs">IP: {router.ip}</div>
        <div className="text-xs">Port: {router.port}</div>
      </CardContent>
    </>
  );

  const getCardClassName = () => {
    const baseClasses =
      "shadow-lg transform transition-all duration-300 ease-in-out";
    switch (status) {
      case "Online":
        return `${baseClasses} hover:scale-105 hover:bg-gray-200`;
      case "Offline":
        return `${baseClasses} shadow-none opacity-75 cursor-not-allowed`;
      case "Unauthorized":
        return `${baseClasses} shadow-none opacity-75 cursor-not-allowed`;
      case "Checking...":
        return `${baseClasses}  cursor-wait`;
      default:
        return baseClasses;
    }
  };

  return (
    <Card className={getCardClassName()}>
      {status === "Online" ? (
        <Link to={`/hotspot/user/${router._id}`}>{cardContent}</Link>
      ) : (
        <div className={status === "Checking..." ? "animate-pulse" : ""}>
          {cardContent}
        </div>
      )}
    </Card>
  );
};

export default CardRouterList;
