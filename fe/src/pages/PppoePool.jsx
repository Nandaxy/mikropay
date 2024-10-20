/* eslint-disable react/prop-types */
import { useState } from "react";
import Sidebar from "@/components/admin/sidebar.jsx";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddPoolForm from "../components/admin/pppoe/AddPoolForm.jsx";
import TabelListPool from "../components/admin/pppoe/TabelListPool.jsx";

const PppoePool = ({ user }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [refreshData, setRefreshData] = useState(false);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleRefresh = () => {
    setRefreshData((prev) => !prev);
  };

  return (
    <>
      <Sidebar user={user}>
        <div className="p-4 w-screen md:w-full pb-20">
          <div className="flex items-center justify-between px-4">
            <h1 className="text-2xl font-bold">IP POOL</h1>

            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Tambah Pool</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Tambah Pool</DialogTitle>
                </DialogHeader>

                <AddPoolForm
                  onSuccess={handleDialogClose}
                  onRefresh={handleRefresh}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-10 px-4 relative w-[100%] overflow-auto">
            <TabelListPool   refreshData={refreshData} />
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default PppoePool;
