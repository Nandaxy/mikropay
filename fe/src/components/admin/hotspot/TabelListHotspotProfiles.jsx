/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { getAction } from "../../../lib/action";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { postAction } from "../../../lib/action";
import EditHotspotProfileForm from "./EditHotspotProfileForm";

const TabelListHotspotProfiles = ({ refreshData }) => {
    const { toast } = useToast();
    const [profiles, setProfiles] = useState([]);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [currentProfile, setCurrentProfile] = useState(null);
    const [isDialogOpen, setDialogOpen] = useState(false);

    const fetchData = async () => {
        try {
            const response = await getAction({
                endpoint: "api/admin/hotspot/profile/list"
            });
            setProfiles(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [refreshData]);

    console.log(profiles);

    const handleDelete = async profileId => {
        try {
            const del = await postAction({
                endpoint: "api/admin/hotspot/profile/delete",
                data: { profileId }
            });

            console.log(del.data);

            if (del.data.status === 200) {
                setProfiles(prevProfiles =>
                    prevProfiles.filter(p => p._id !== profileId)
                );
                toast({
                    description: "Profile Hotspot Berhasil Dihapus.",
                    className: "font-bold bg-green-400"
                });
                handleDialogClose();
            } else {
                toast({
                    variant: "destructive",
                    description: "Profile Hotspot Gagal Dihapus."
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Profile Hotspot Gagal Dihapus."
            });
        }
    };

    const handleEdit = profile => {
        setCurrentProfile(profile);
        setEditDialogOpen(true);
    };

    const handleDialogClose = () => {
        setEditDialogOpen(false);
    };

    return (
        <>
            <Table className="overflow-x-auto">
                <TableHeader>
                    <TableRow className="whitespace-nowrap">
                        <TableHead className="w-10">No</TableHead>
                        <TableHead className="w-10">Nama</TableHead>
                        <TableHead>Profile</TableHead>
                        <TableHead>Router</TableHead>
                        <TableHead>Expired</TableHead>
                        <TableHead>Shared Users</TableHead>
                        <TableHead>Rate Limit</TableHead>
                        <TableHead>Harga</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {profiles.map((profile, index) => (
                        <TableRow key={profile._id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{profile.name}</TableCell>
                            <TableCell>{profile.profile}</TableCell>
                            <TableCell className="whitespace-nowrap">
                                {profile.router?.name
                                    ? profile.router?.name
                                    : "null (Router Dihapus)"}
                            </TableCell>
                            <TableCell>{profile.sessionTimeout}</TableCell>
                            <TableCell>{profile.sharedUsers}</TableCell>
                            <TableCell>{profile.rateLimit}</TableCell>
                            <TableCell>{profile.price}</TableCell>
                            <TableCell>
                                <div className="flex items-center space-x-4 justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleEdit(profile)}
                                    >
                                        Edit
                                    </Button>

                                    <Dialog
                                        open={isDialogOpen}
                                        onOpenChange={setDialogOpen}
                                    >
                                        <DialogTrigger asChild>
                                            <Button
                                                className="px-4 py-2 text-md"
                                                variant="destructive"
                                            >
                                                Hapus
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="flex flex-col justify-center items-center md:w-fit">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Hapus Profile
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Apakah Anda Yakin Menghapus
                                                    Profile Ini?
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex w-full space-x-4 justify-center md:justify-end">
                                                <DialogClose asChild>
                                                    <Button variant="outline">
                                                        Batal
                                                    </Button>
                                                </DialogClose>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() =>
                                                        handleDelete(
                                                            profile._id
                                                        )
                                                    }
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={isEditDialogOpen} onOpenChange={handleDialogClose}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Profile Hotspot</DialogTitle>
                    </DialogHeader>
                    {currentProfile && (
                        <EditHotspotProfileForm
                            profileData={currentProfile}
                            onSuccess={handleDialogClose}
                            onRefresh={fetchData}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default TabelListHotspotProfiles;
