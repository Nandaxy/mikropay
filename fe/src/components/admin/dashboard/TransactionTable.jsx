/* eslint-disable react/prop-types */
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import { TableSkeleton } from "./Skeleton";

const TransactionTable = ({ loading, transactionsData }) => {
  return (
    <div className="w-[90vw] md:w-full overflow-x-auto">
      <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Transaksi</CardTitle>
            <CardDescription>
              Berikut Adalah 10 Data Dari Transaksi Terakhir
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="#">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomor Invoice</TableHead>
                  <TableHead>Kode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead className="text-right">Harga</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableSkeleton rows={10} columns={5} />
                ) : transactionsData.length > 0 ? (
                  transactionsData.slice(0, 10).map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>{transaction.reference}</TableCell>
                      <TableCell>
                        {transaction.merchant_ref || "Sale"}
                      </TableCell>
                      <TableCell>
                        {transaction.status === "PAID" ? (
                          <Badge className="text-xs text-white bg-green-500">
                            {transaction.status}
                          </Badge>
                        ) : (
                          <Badge className="text-xs" variant="destructive">
                            {transaction.status}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        Rp. {transaction.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="5" className="text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionTable;
