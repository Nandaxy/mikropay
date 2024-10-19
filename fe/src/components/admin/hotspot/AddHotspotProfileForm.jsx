/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { postAction, getAction } from "../../../lib/action.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AddHotspotProfileForm = ({ onSuccess, onRefresh }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [routers, setRouters] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        profile: "",
        sessionTimeout: "",
        sharedUsers: "",
        rateLimit: "",
        price: "",
        routerId: ""
    });

    useEffect(() => {
        const fetchRouters = async () => {
            try {
                const response = await getAction({
                    endpoint: "api/admin/routes/list"
                });

                console.log(response);
                if (response.status === 200) {
                    setRouters(response.data);
                } else {
                    toast({
                        variant: "destructive",
                        description: "Gagal mengambil data router."
                    });
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    description: "Gagal mengambil data router."
                });
            }
        };

        fetchRouters();
    }, [toast]);

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleAddHotspotProfile = async e => {
        setLoading(true);
        e.preventDefault();
        try {
            const response = await postAction({
                endpoint: "api/admin/hotspot/profile/add",
                data: formData
            });

            if (response.data.status === 201) {
                onSuccess();
                onRefresh();
                toast({
                    description: "Profile Hotspot Berhasil Ditambahkan.",
                    className: "font-bold bg-green-400"
                });
            } else {
                toast({
                    variant: "destructive",
                    description: "Profile Hotspot Gagal Ditambahkan."
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Profile Hotspot Gagal Ditambahkan."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleAddHotspotProfile}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Nama 
                    </Label>
                    <Input
                        id="name"
                        className="col-span-3"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Vocher 3rb"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="profile" className="text-right">
                        Profile
                    </Label>
                    <Input
                        id="profile"
                        className="col-span-3"
                        value={formData.profile}
                        onChange={handleChange}
                        required
                        placeholder="3K"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sessionTimeout" className="text-right">
                        Expired
                    </Label>
                    <Input
                        id="sessionTimeout"
                        className="col-span-3"
                        value={formData.sessionTimeout}
                        onChange={handleChange}
                        required
                        placeholder="1d"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sharedUsers" className="text-right">
                        Shared Users
                    </Label>
                    <Input
                        id="sharedUsers"
                        className="col-span-3"
                        value={formData.sharedUsers}
                        onChange={handleChange}
                        required
                        placeholder="1"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rateLimit" className="text-right">
                        Rate Limit
                    </Label>
                    <Input
                        id="rateLimit"
                        className="col-span-3"
                        value={formData.rateLimit}
                        onChange={handleChange}
                        required
                        placeholder="3M/2M"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                        Harga
                    </Label>
                    <Input
                        id="price"
                        className="col-span-3"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        placeholder="3000"
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
                        Tambah Profile
                    </Button>
                )}
            </DialogFooter>
        </form>
    );
};

export default AddHotspotProfileForm;
