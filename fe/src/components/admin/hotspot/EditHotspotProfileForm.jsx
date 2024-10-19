/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { postAction, getAction } from "../../../lib/action.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const EditHotspotProfileForm = ({ profileData, onSuccess, onRefresh }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [routers, setRouters] = useState([]);
    const [formData, setFormData] = useState({
        name: profileData.name || "",
        profile: profileData.profile || "",
        sessionTimeout: profileData.sessionTimeout || "",
        sharedUsers: profileData.sharedUsers || "",
        rateLimit: profileData.rateLimit || "",
        price: profileData.price || "",
        routerId: profileData.router._id || "",
        profileId: profileData._id || ""
    });

    // Fetch routers data on component mount
    useEffect(() => {
        const fetchRouters = async () => {
            try {
                const response = await getAction({
                    endpoint: "api/admin/routes/list"
                });

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

    const handleEditHotspotProfile = async e => {
        setLoading(true);
        e.preventDefault();
        try {
            console.log(formData);
            const response = await postAction({
                endpoint: "api/admin/hotspot/profile/edit",
                data: formData
            });

            if (response.status === 200) {
                onSuccess();
                onRefresh();
                toast({
                    description: "Profile Hotspot Berhasil Diperbarui.",
                    className: "font-bold bg-green-400"
                });
            } else {
                toast({
                    variant: "destructive",
                    description: "Profile Hotspot Gagal Diperbarui."
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Profile Hotspot Gagal Diperbarui."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleEditHotspotProfile}>
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
                        Perbarui Profile
                    </Button>
                )}
            </DialogFooter>
        </form>
    );
};

export default EditHotspotProfileForm;
