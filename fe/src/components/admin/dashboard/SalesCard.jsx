/* eslint-disable react/prop-types */
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { CreditCard } from "lucide-react";
import { Skeleton } from "./Skeleton";
  
  const SalesCard = ({ loading, transactionsData }) => {
    const paidTransactions = transactionsData.filter(
      (transaction) => transaction.status === "PAID"
    );
  
    const totalTransactions = transactionsData.length;
    const totalPaidTransactions = paidTransactions.length;
    const totalUnpaidTransactions = totalTransactions - totalPaidTransactions;
  
    return (
      <Card x-chunk="dashboard-01-chunk-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Penjualan</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton height={30} width="100%" />
          ) : (
            <>
              <div className="text-2xl font-bold">+{totalTransactions}</div>
              <p className="text-xs text-muted-foreground">
                Terbayar : {totalPaidTransactions}
              </p>
              <p className="text-xs text-muted-foreground">
                Belum Terbayar : {totalUnpaidTransactions}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    );
  };
  
  export default SalesCard;
  