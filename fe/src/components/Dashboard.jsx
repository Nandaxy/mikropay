import * as React from "react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";
import Sidebar from "./admin/sidebar.jsx";
import {
    Activity,
    ArrowUpRight,
    CreditCard,
    DollarSign,
    Users
} from "lucide-react";
import {
    Table,
    TableHeader,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAction } from "@/lib/action";

export const description = "An interactive bar chart";

const chartData = [
    { date: "2024-04-01", desktop: 222, mobile: 150 },
    { date: "2024-04-02", desktop: 97, mobile: 180 },
    { date: "2024-04-03", desktop: 167, mobile: 120 },
    { date: "2024-04-04", desktop: 242, mobile: 260 },
    { date: "2024-04-05", desktop: 373, mobile: 90 },
    { date: "2024-04-06", desktop: 373, mobile: 670 }
    // ... (rest of your chart data)
];

const chartConfig = {
    views: {
        label: "Page Views"
    },
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))"
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))"
    }
};

const Dashboard = ({ user }) => {
    console.log(user);
    const [transactionsData, setTransactionsData] = useState([]);
    useEffect(() => {
        const getTransactionsData = async () => {
            try {
                const response = await getAction({
                    endpoint: "api/admin/transaction?all=true"
                });
                setTransactionsData(response.data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        getTransactionsData();
    }, []);

    console.log(transactionsData);

    return (
        <div>
            <Sidebar user={user}>
                <div className="p-4">
                    <TesDashboard transactionsData={transactionsData} />
                </div>
            </Sidebar>
        </div>
    );
};

const TesDashboard = ({ transactionsData }) => {
    return (
        <main className="flex flex-1 flex-col gap-4 pb-8 md:gap-8 ">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Card x-chunk="dashboard-01-chunk-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Pendapatan
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp. 45,231.89</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card x-chunk="dashboard-01-chunk-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Subscriptions
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground">
                            +180.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card x-chunk="dashboard-01-chunk-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Sales
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12,234</div>
                        <p className="text-xs text-muted-foreground">
                            +19% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card x-chunk="dashboard-01-chunk-3">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Now
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">
                            +201 since last hour
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Transactions</CardTitle>
                            <CardDescription>
                                Recent transactions from your store.
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
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Reference</TableHead>
                                    <TableHead className="hidden xl:table-column">
                                        Type
                                    </TableHead>
                                    <TableHead className="hidden xl:table-column">
                                        Status
                                    </TableHead>
                                    <TableHead className="hidden xl:table-column">
                                        Date
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Amount
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactionsData.length > 0 ? (
                                    transactionsData.map(transaction => (
                                        <TableRow key={transaction._id}>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {transaction.reference}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden xl:table-column">
                                                {transaction.type || "Sale"}
                                            </TableCell>
                                            <TableCell className="hidden xl:table-column">
                                                <Badge
                                                    className="text-xs"
                                                    variant="outline"
                                                >
                                                    {transaction.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                                                {new Date(
                                                    transaction.createdAt
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                Rp.
                                                {transaction.amount.toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan="5"
                                            className="text-center"
                                        >
                                            No transactions found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
};

export default Dashboard;
