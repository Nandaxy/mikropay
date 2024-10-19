/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { postAction } from "../../../lib/action.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const EditRouterForm = ({ routerData, onSuccess, onRefresh }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ ...routerData }); 

  useEffect(() => {
    setFormData({ ...routerData }); 
  }, [routerData]);

  const handleChange = (e) => {
    const newFormData = {
      ...formData,
      [e.target.id]: e.target.value,
    };
    setFormData(newFormData);
  };

  const handleEditRouter = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await postAction({
        endpoint: "api/admin/routes/edit",
        data: {
          routerId: routerData._id,
          ...formData,
        },
      });

      console.log("response", response);
      if (response.data.status === 200) {
        onSuccess();
        onRefresh();
        toast({
          title: "Sukses",
          description: "Router Berhasil Diperbarui.",
          className: "font-bold bg-green-400",
        });
      } else {

        toast({
          title: "Gagal",
          variant: "destructive",
          description: `Error: ${response.data.message}`,
        });
      }
    } catch (error) {
      toast({
        title: "Gagal",
        variant: "destructive",
        description: "Router Gagal Diperbarui.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleEditRouter}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Nama Router
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
          <Label htmlFor="ip" className="text-right">
            IP Address
          </Label>
          <Input
            id="ip"
            className="col-span-3"
            value={formData.ip}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="port" className="text-right">
            Port
          </Label>
          <Input
            id="port"
            type="number"
            className="col-span-3"
            value={formData.port}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Username
          </Label>
          <Input
            id="username"
            className="col-span-3"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="text-right">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            className="col-span-3"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="dnsMikrotik" className="text-right">
            DNS Mikrotik
          </Label>
          <Input
            id="dnsMikrotik"
            className="col-span-3"
            value={formData.dnsMikrotik}
            onChange={handleChange}
            placeholder="Opsional"
          />
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
            Simpan Perubahan
          </Button>
        )}
      </DialogFooter>
    </form>
  );
};

export default EditRouterForm;
