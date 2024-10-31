/* eslint-disable react/prop-types */
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { postAction, getAction } from "@/lib/action";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";

const AddUserHotspot = ({ routerData, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    comment: "",
    profile: "",
  });
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleAddUserHotspot = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await postAction({
        endpoint: "api/admin/hotspot/user/add",
        data: formData,
      });

      if (response.data.status === 200) {
        // onSuccess();
        // onRefresh();
        onClose();
        toast({
          description: "User Hotspot Berhasil Ditambahkan.",
          className: "font-bold bg-green-400",
        });
      } else {
        toast({
          variant: "destructive",
          description: "User Hotspot Gagal Ditambahkan.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "User Hotspot Gagal Ditambahkan.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getProfiles = async () => {
      const response = await getAction({
        endpoint: `api/admin/hotspot/profile/find?routerId=${routerData._id}`,
      });

      // console.log(response.data);

      if (response.status === 200) {
        setProfiles(response.data);
      } else {
        toast({
          variant: "destructive",
          description: "Profile Hotspot Belum Ada.",
        });
      }
    };

    getProfiles();
  }, [routerData._id, toast]);

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Buat User Hotspot</DialogTitle>
        <DialogDescription>Buat User Hotspot Baru.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleAddUserHotspot}>
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
              placeholder="n"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              className="col-span-3"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="n"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="comment" className="text-right">
              Komentar
            </Label>
            <Input
              id="comment"
              className="col-span-3"
              value={formData.comment}
              onChange={handleChange}
              required
              placeholder="n"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profile" className="text-right">
              Profile
            </Label>
            <select
              id="profile"
              className="col-span-3 border rounded p-2"
              value={formData.profile}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Pilih Profile
              </option>
              {/* <option value="default">Default</option> */}
              {profiles.map((profile) => (
                <option key={profile._id} value={profile._id}>
                  {profile.name} - {profile.rateLimit}
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
    </div>
  );
};

export default AddUserHotspot;
