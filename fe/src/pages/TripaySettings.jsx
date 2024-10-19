/* eslint-disable react/prop-types */
import Sidebar from "@/components/admin/sidebar.jsx";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { postAction, getAction } from "../lib/action";
import { useToast } from "../hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

const TripaySettings = ({ user }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    merchantCode: "",
    apiKey: "",
    privateKey: "",
    endpoint: "",
  });

 
  useEffect(() => {
    const fetchTripay = async () => {
      try {
        const r = await getAction({endpoint: "api/admin/payment-gateway/tripay"});
        // console.log(r);
        if (r.status === 200) {
          setFormData({
            merchantCode: r.data.merchantCode,
            apiKey: r.data.apiKey,
            privateKey: r.data.privateKey,
            endpoint: r.data.endpoint,
          });
        } else {
          toast({
            title: "Gagal memuat data",
            description: "Tidak dapat mengambil data Tripay",
            variant: "destructive",
          });
        }
      } catch (error) {
        // console.error(error);
        toast({
          title: "Kesalahan",
          description: "Terjadi kesalahan saat mengambil data",
          variant: "destructive",
        });
      }
    };

    fetchTripay();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const r = await postAction({
      endpoint: "api/admin/payment-gateway/tripay/edit",
      data: formData,
    });

    if (r.data.status === 200) {
      toast({
        title: "Sukses",
        description: "Tripay berhasil diatur",
        className: "font-bold bg-green-400",
      });
    } else {
      toast({
        title: "Gagal",
        description: "Tripay gagal diatur",
        variant: "destructive",
      });
    }

    setLoading(false); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <Sidebar user={user}>
      <div className="p-4 w-screen md:w-full pb-20">
        <div className="flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold">Atur Tripay</h1>
        </div>
        <div className="w-full max-w-md mt-10 p-6 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="merchantCode">Kode Merchant</Label>
              <Input
                id="merchantCode"
                name="merchantCode"
                value={formData.merchantCode}
                onChange={handleChange}
                placeholder="Masukkan kode merchant"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                name="apiKey"
                value={formData.apiKey}
                onChange={handleChange}
                placeholder="Masukkan API Key"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="privateKey">Private Key</Label>
              <Input
                id="privateKey"
                name="privateKey"
                value={formData.privateKey}
                onChange={handleChange}
                placeholder="Masukkan Private Key"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="endpoint">URL Endpoint</Label>
              <Input
                id="endpoint"
                name="endpoint"
                value={formData.endpoint}
                onChange={handleChange}
                placeholder="Masukkan URL Endpoint"
                className="mt-1"
                required
              />
            </div>
            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                className="w-full md:w-1/4"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Simpan"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Sidebar>
  );
};

export default TripaySettings;
