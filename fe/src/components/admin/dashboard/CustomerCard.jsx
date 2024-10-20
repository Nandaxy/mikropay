import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { Skeleton } from "./Skeleton";

// eslint-disable-next-line react/prop-types
const CustomerCard = ({ loading }) => {
  return (
    <Card x-chunk="dashboard-01-chunk-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Pelanggan</CardTitle>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
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

export default CustomerCard;
