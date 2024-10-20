/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { postAction } from "../../../lib/action.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const EditPoolForm = ({ poolData, onSuccess, onRefresh }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ ...poolData });

  useEffect(() => {
    setFormData({ ...poolData });
  }, [poolData]);

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
        endpoint: `api/admin/pool/edit`,
        
        data: {
            poolId: formData._id,
          ...formData,
        },
      });

    //   console.log("response", response);
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

export default EditPoolForm;
