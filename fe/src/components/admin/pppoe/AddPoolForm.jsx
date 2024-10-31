/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { postAction, getAction } from "../../../lib/action.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AddPoolForm = ({ onSuccess, onRefresh }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [routers, setRouters] = useState([]);

    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem("poolFormData");
        return savedData
            ? JSON.parse(savedData)
            : {
                  name: "",
                  address: "",
                  routerId: ""
              };
    });

    useEffect(() => {
        const fetchRouters = async () => {
            try {
                const response = await getAction({
                    endpoint: "api/admin/routes/list"
                });

                // console.log(response);
                if (response.status === 200) {
                    setRouters(response.data);
                } else {
                    toast({
                        variant: "destructive",
                        description: "Gagal mengambil data router."
                    });
                }
            } catch (error) {
                console.log(error);
                toast({
                    variant: "destructive",
                    description: "Gagal mengambil data router."
                });
            }
        };

        fetchRouters();
    }, [toast]);

    const handleChange = e => {
        const newFormData = {
            ...formData,
            [e.target.id]: e.target.value
        };
        setFormData(newFormData);
        localStorage.setItem("poolFormData", JSON.stringify(newFormData));
    };

    const handlePoolChange = async e => {
        setLoading(true);
        e.preventDefault();
        try {
            const response = await postAction({
                endpoint: "api/admin/pool/add",
                data: formData
            });
            if (response.data.status === 200) {
                onSuccess(); // Close the dialog
                onRefresh(); // Refresh the router list
                toast({
                    description: "Router Berhasil Ditambahkan.",
                    className: "font-bold bg-green-400"
                });
                localStorage.removeItem("poolFormData");
            } else {
                toast({
                    variant: "destructive",
                    description:
                        "Router Gagal Ditambahkan : " + response.data.message
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Router Gagal Ditambahkan."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handlePoolChange}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Nama Pool
                    </Label>
                    <Input
                        id="name"
                        className="col-span-3"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                        Address
                    </Label>
                    <Input
                        id="address"
                        className="col-span-3"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="routerId" className="text-right">
                        Router ID
                    </Label>
                    <select
                        id="routerId"
                        className="col-span-3 border rounded p-2"
                        value={formData.routerId}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>
                            Pilih Router
                        </option>
                        {routers.map(router => (
                            <option key={router._id} value={router._id}>
                                {router.name} - {router.ip}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <DialogFooter>
                {loading ? (
                    <Button disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                    </Button>
                ) : (
                    <Button variant="default" type="submit">
                        Buat Ip Pool
                    </Button>
                )}
            </DialogFooter>
        </form>
    );
};

export default AddPoolForm;
