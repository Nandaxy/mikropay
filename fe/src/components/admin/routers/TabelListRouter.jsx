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
import EditRouterForm from "@/components/admin/routers/EditRouterForm";
import RouterStatus from "./RouterStatus";

const TabelListRouter = ({ refreshData }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const { toast } = useToast();
    const [router, setRouter] = useState([]);
    const [currentRouter, setCurrentRouter] = useState(null);

    const fetchData = async () => {
        try {
            const response = await getAction({
                endpoint: "api/admin/routes/list"
            });
            setRouter(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [refreshData]);

    const handleDelete = async routerId => {
        try {
            const del = await postAction({
                endpoint: "api/admin/routes/delete",
                data: {
                    routerId
                }
            });

            if (del.data.status === 200) {
                setRouter(prevRouter =>
                    prevRouter.filter(r => r._id !== routerId)
                );
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
        setCurrentRouter(router);
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
                            Nama Router
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ip Address</TableHead>
                        <TableHead>Port</TableHead>

                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {router.map((routers, index) => (
                        <TableRow key={routers._id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium underline text-blue-500">
                                <Link to={`/router/${routers._id}`}>
                                    {routers.name}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <RouterStatus router={routers} />
                            </TableCell>
                            <TableCell>{routers.ip}</TableCell>
                            <TableCell>{routers.port}</TableCell>

                            <TableCell>
                                <div className="flex items-center space-x-4 justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleEdit(routers)}
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
                                                        handleDelete(
                                                            routers._id
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
                        <DialogTitle>Edit Router</DialogTitle>
                    </DialogHeader>
                    {currentRouter && (
                        <EditRouterForm
                            routerData={currentRouter}
                            onSuccess={handleDialogClose}
                            onRefresh={fetchData}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default TabelListRouter;
