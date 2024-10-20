/* eslint-disable react/prop-types */
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { Skeleton } from "./Skeleton";

const RevenueCard = ({ loading, transactionsData }) => {
  const paidTransactions = transactionsData.filter(
      (transaction) => transaction.status === "PAID"
  );

  const totalRevenue = paidTransactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
  );

  const today = new Date().toLocaleDateString();
  const thisMonth = new Date().getMonth();
  const todayRevenue = paidTransactions
      .filter(
          (transaction) =>
              new Date(transaction.created_at).toLocaleDateString() === today
      )
      .reduce((acc, transaction) => acc + transaction.amount, 0);

  const thisMonthRevenue = paidTransactions
      .filter(
          (transaction) =>
              new Date(transaction.created_at).getMonth() === thisMonth
      )
      .reduce((acc, transaction) => acc + transaction.amount, 0);

  return (
      <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              {loading ? (
                  <Skeleton height={30} width="100%" />
              ) : (
                  <div className="text-2xl font-bold">
                      Rp. {totalRevenue.toLocaleString()}
                  </div>
              )}
              {loading ? (
                  <Skeleton height={15} width="100%" />
              ) : (
                  <>
                      <p className="text-xs text-muted-foreground">
                          Hari Ini: Rp. {todayRevenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                          Bulan Ini: Rp. {thisMonthRevenue.toLocaleString()}
                      </p>
                  </>
              )}
          </CardContent>
      </Card>
  );
};

export default RevenueCard;
