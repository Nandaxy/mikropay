/* eslint-disable react/prop-types */
import { useState } from "react";
import { postAction } from "../../../lib/action.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AddRouterForm = ({ onSuccess, onRefresh }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("routerFormData");
    return savedData
      ? JSON.parse(savedData)
      : {
          name: "",
          ip: "",
          port: "",
          username: "",
          password: "",
          dnsMikrotik: "",
        };
  });

  const handleChange = (e) => {
    const newFormData = {
      ...formData,
      [e.target.id]: e.target.value,
    };
    setFormData(newFormData);
    localStorage.setItem("routerFormData", JSON.stringify(newFormData));
  };

  const handleAddRouter = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await postAction({
        endpoint: "api/admin/routes/add",
        data: formData,
      });
      if (response.status === 200) {
        onSuccess(); // Close the dialog
        onRefresh(); // Refresh the router list
        toast({
          description: "Router Berhasil Ditambahkan.",
          className: "font-bold bg-green-400",
        });
        localStorage.removeItem("routerFormData");
      } else {
        toast({
          variant: "destructive",
          description: "Router Gagal Ditambahkan.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Router Gagal Ditambahkan.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddRouter}>
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
            Tambah Router
          </Button>
        )}
      </DialogFooter>
    </form>
  );
};

export default AddRouterForm;
