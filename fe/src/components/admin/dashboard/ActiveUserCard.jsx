/* eslint-disable react/prop-types */
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Activity } from "lucide-react";
import { Skeleton } from "./Skeleton";
  
  const ActiveUserCard = ({ loading }) => {
    return (
      <Card x-chunk="dashboard-01-chunk-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">User Active</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton height={30} width="100%" />
          ) : (
            <>
            <div className="text-2xl font-bold">999</div>
            <p className="text-xs text-muted-foreground">*Data Masih Dummy</p>
            </>
          )}
        </CardContent>
      </Card>
    );
  };
  
  export default ActiveUserCard;
  