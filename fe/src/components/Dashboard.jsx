/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import Sidebar from "./admin/sidebar.jsx";
import RevenueCard from "./admin/dashboard/RevenueCard";
import SalesCard from "./admin/dashboard/SalesCard";
import CustomerCard from "./admin/dashboard/CustomerCard";
import ActiveUserCard from "./admin/dashboard/ActiveUserCard";
import TransactionTable from "./admin/dashboard/TransactionTable";
import { getAction } from "@/lib/action";

const Dashboard = ({ user }) => {
  const [transactionsData, setTransactionsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTransactionsData = async () => {
      try {
        const response = await getAction({
          endpoint: "api/admin/transaction?all=true",
        });
        setTransactionsData(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    getTransactionsData();
  }, []);

  return (
    <div>
      <Sidebar user={user}>
        <div className="p-4">
          <main className="flex flex-1 flex-col gap-4 pb-8 md:gap-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              <RevenueCard
                loading={loading}
                transactionsData={transactionsData}
              />
              <SalesCard
                loading={loading}
                transactionsData={transactionsData}
              />
              <CustomerCard loading={loading} />
              <ActiveUserCard loading={loading} />
            </div>
            <TransactionTable
              loading={loading}
              transactionsData={transactionsData}
            />
          </main>
        </div>
      </Sidebar>
    </div>
  );
};

export default Dashboard;
