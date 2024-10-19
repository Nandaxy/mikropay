/* eslint-disable react/prop-types */
import { useState } from "react";
import Sidebar from "@/components/admin/sidebar.jsx";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import AddHotspotProfileForm from "../components/admin/hotspot/AddHotspotProfileForm";
import TabelListHotspotProfiles from "../components/admin/hotspot/TabelListHotspotProfiles";

const HotspotProfile = ({ user }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [refreshData, setRefreshData] = useState(false);

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleRefresh = () => {
        setRefreshData(prev => !prev);
    };

    return (
        <>
            <Sidebar user={user}>
                <div className="p-4 w-screen md:w-full pb-20">
                    <div className="flex items-center justify-between px-4">
                        <h1 className="text-2xl font-bold">Hotspot Profile</h1>

                        <Dialog
                            open={isDialogOpen}
                            onOpenChange={setDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button variant="outline">Buat Profile</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        Tambah Hotspot Profile
                                    </DialogTitle>
                                </DialogHeader>

                                <AddHotspotProfileForm
                                    onSuccess={handleDialogClose}
                                    onRefresh={handleRefresh}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="mt-10 px-4 relative w-[100%] overflow-auto">
                        <TabelListHotspotProfiles refreshData={refreshData} />
                    </div>
                </div>
            </Sidebar>
        </>
    );
};

export default HotspotProfile;
