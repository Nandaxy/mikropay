import React, { useState, useEffect } from "react";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { postAction, getAction } from "@/lib/action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// eslint-disable-next-line react/prop-types
const AddUserHotspotBatch = ({ routerData }) => {
  const [formData, setFormData] = useState({
    numberOfUsers: "",
    prefix: "",
    character: "",
    usernameLength: "",
    passwordLength: "",
    passwordEqualsUsername: "Tidak",
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

  const handleSelectChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleAddUserHotspot = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await postAction({
        endpoint: "api/admin/hotspot/user/batch/add",
        data: formData,
      });

      if (response.data.status === 201) {
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
            <Label
              htmlFor="numberOfUsers"
              className="text-right whitespace-nowrap"
            >
              Jumlah user
            </Label>
            <Input
              id="numberOfUsers"
              className="col-span-3"
              value={formData.numberOfUsers}
              onChange={handleChange}
              required
              placeholder="2"
              type="number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prefix" className="text-right whitespace-nowrap">
              Prefix
            </Label>
            <Input
              id="prefix"
              className="col-span-3"
              value={formData.prefix}
              onChange={handleChange}
              placeholder="n"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="character" className="text-right whitespace-nowrap">
              Karakter
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange("character", value)}
              required
            >
              <SelectTrigger className="w-[340%]">
                <SelectValue placeholder="Pilih Karakter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="abcd">abcd</SelectItem>
                <SelectItem value="AbCd">AbCd</SelectItem>
                <SelectItem value="ABCD">ABCD</SelectItem>
                <SelectItem value="123">123</SelectItem>
                <SelectItem value="abc123">abc123</SelectItem>
                <SelectItem value="AbCd123">AbCd123</SelectItem>
                <SelectItem value="ABCD123">ABCD123</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="usernameLength"
              className="text-right whitespace-nowrap"
            >
              Panjang Nama
            </Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("usernameLength", value)
              }
              required
            >
              <SelectTrigger className="w-[340%]">
                <SelectValue placeholder="Pilih Panjang" />
              </SelectTrigger>
              <SelectContent>
                {[3, 4, 5, 6, 7].map((length) => (
                  <SelectItem key={length} value={length.toString()}>
                    {length}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="passwordLength"
              className="text-right whitespace-nowrap "
            >
              Panjang Password
            </Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("passwordLength", value)
              }
              disabled={formData.passwordEqualsUsername === "Ya"}
            >
              <SelectTrigger className="w-[340%]">
                <SelectValue placeholder="Pilih Panjang" />
              </SelectTrigger>
              <SelectContent>
                {[3, 4, 5, 6, 7].map((length) => (
                  <SelectItem key={length} value={length.toString()}>
                    {length}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="passwordEqualsUsername" className="text-right">
              Password = username
            </Label>
            <Select
              onValueChange={(value) =>
                handleSelectChange("passwordEqualsUsername", value)
              }
              required
            >
              <SelectTrigger className="w-[340%]">
                <SelectValue placeholder="Tidak" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ya">Ya</SelectItem>
                <SelectItem value="Tidak">Tidak</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profile" className="text-right whitespace-nowrap">
              Profile ID
            </Label>
            <Select
              onValueChange={(value) => handleSelectChange("profile", value)}
              required
            >
              <SelectTrigger className="w-[340%]">
                <SelectValue placeholder="Pilih Profile" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((profile) => (
                  <SelectItem key={profile._id} value={profile._id}>
                    {profile.name} - {profile.rateLimit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="default" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Tambah User Hotspot"
            )}
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
};

export default AddUserHotspotBatch;
