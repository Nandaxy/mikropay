/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
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
import { Link } from "react-router-dom";
import { postAction } from "../../../lib/action";

import EditPoolForm from "./EditPoolForm";

const TabelListPool = ({ refreshData }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const { toast } = useToast();
    const [pool, setPool] = useState([]);
    const [currentPool, setCurrentPool] = useState(null);
    const [routers, setRouters] = useState([]);

    const fetchData = async () => {
        try {
            const response = await getAction({
                endpoint: "api/admin/pool/list"
            });
            setPool(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [refreshData]);

    const handleDelete = async poolId => {
        try {
            const del = await postAction({
                endpoint: "api/admin/pool/delete",
                data: {
                    poolId
                }
            });

            if (del.data.status === 200) {
                setPool(prevRouter => prevRouter.filter(r => r._id !== poolId));
                toast({
                    description: "Router Berhasil Dihapus.",
                    className: "font-bold bg-green-400"
                });
                handleDialogClose();

                fetchData();
            } else {
                toast({
                    variant: "destructive",
                    description: "Router Gagal Dihapus."
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                description: "Router Gagal Dihapus."
            });
        }
    };

    const handleEdit = router => {
        setCurrentPool(router);
        setEditDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditDialogOpen(false);
    };

    return (
        <>
            <Table className="overflow-x-auto">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-10">No</TableHead>
                        <TableHead className="whitespace-nowrap">
                            Nama Pool
                        </TableHead>
                        <TableHead className="whitespace-nowrap">
                            Router
                        </TableHead>
                        <TableHead> Address</TableHead>

                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pool.map((pools, index) => (
                        <TableRow key={pools._id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">
                                {pools.name}
                            </TableCell>

                            <TableCell>{pools.address}</TableCell>
                            <TableCell>{pools.address}</TableCell>

                            <TableCell>
                                <div className="flex items-center space-x-4 justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleEdit(pools)}
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
                                                    Hapus Router
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Apakah Anda Yakin Menghapus
                                                    Roter Ini?
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
                                                        handleDelete(pools._id)
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
                        <DialogTitle>Edit Router</DialogTitle>
                    </DialogHeader>
                    {currentPool && (
                        <EditPoolForm
                            poolData={currentPool}
                            onSuccess={handleDialogClose}
                            onRefresh={fetchData}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default TabelListPool;
