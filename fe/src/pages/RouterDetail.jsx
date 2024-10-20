import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAction, postAction } from "../lib/action.js"; // Adjust according to your action functions
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

import Sidebar from "../components/admin/sidebar.jsx";

const RouterDetail = ({ user }) => {
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [router, setRouter] = useState(null);
  const [error, setError] = useState(null);
  const [paymentActive, setPaymentActive] = useState(false);
  const [paymentGateway, setPaymentGateway] = useState(""); // State for selected payment gateway ID
  const [paymentGateways, setPaymentGateways] = useState([]); // State for payment gateway options
  const [saving, setSaving] = useState(false); // State for saving process

  // Fetch router details by id
  useEffect(() => {
    const fetchRouterDetails = async () => {
      setLoading(true);
      try {
        const response = await getAction({
          endpoint: `api/admin/routes/find/${id}`, // Adjust the endpoint
        });

        if (response.status === 200) {
          console.log("Router details fetched:", response.data); // Debugging line
          setRouter(response.data);
          setPaymentActive(response.data.isPaymentGatewayActive);
          setPaymentGateway(response.data.paymentGateway || "");
        } else {
          setError("Failed to fetch router details.");
        }
      } catch (error) {
        console.error("Error fetching router details:", error); // Debugging line
        setError("Failed to fetch router details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRouterDetails();
  }, [id]);

  // Fetch available payment gateways (adjust this endpoint based on your backend)
  useEffect(() => {
    const fetchPaymentGateways = async () => {
      try {
        const response = await getAction({
          endpoint: "api/admin/payment-gateway", // Endpoint to fetch payment gateways
        });

        if (response.status === 200) {
          setPaymentGateways(response.data);
        } else {
          setError("Failed to fetch payment gateways.");
        }
      } catch (error) {
        console.error("Error fetching payment gateways:", error); // Debugging line
        setError("Failed to fetch payment gateways.");
      }
    };

    fetchPaymentGateways();
  }, []);

  // Handle toggle of payment gateway
  const handleTogglePayment = () => {
    setPaymentActive((prev) => !prev);
    if (!paymentActive) {
      toast({
        description: "Payment gateway activated.",
      });
    } else {
      setPaymentGateway(""); // Reset payment gateway when deactivated
      toast({
        description: "Payment gateway deactivated.",
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); // Set saving to true when the form is submitted
    try {
      const response = await postAction({
        endpoint: "api/admin/routes/edit",
        data: {
          routerId: id,
          isPaymentGatewayActive: paymentActive,
          paymentGateway: paymentActive ? paymentGateway : "", // Only send if active
        },
      });

      if (response.status === 200) {
        toast({
          description: "Router updated successfully.",
        });
        setRouter(response.data);
      } else {
        toast({
          description: response.message || "Failed to update router.",
        });
      }
    } catch (error) {
      toast({
        description: "Server error while updating router.",
      });
    } finally {
      setSaving(false); // Reset saving state after the operation
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!router) {
    return (
      <div className="text-center text-yellow-500">
        No router details found.
      </div>
    );
  }

  return (
    <div>
      <Sidebar user={user}>
        <div className="p-4 w-screen md:w-full pb-20">
          <div className="flex items-center justify-between px-6">
            <h1 className="text-2xl font-bold">Router Details</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {/* Card Info Router */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Router Information</h2>
              <p>
                <strong>Name:</strong> {router?.name}
              </p>
              <p>
                <strong>IP Address:</strong> {router?.ip}
              </p>
              <p>
                <strong>Port:</strong> {router?.port}
              </p>
              <p>
                <strong>Username:</strong> {router?.username}
              </p>

              {router?.isPaymentGatewayActive && (
                <>
                  {" "}
                  <p>
                    <strong>Pembelian Online:</strong> domainAnda.com/order/voucher/
                    {router?.slug}
                  </p>
                  <p>
                    <strong>Slug API</strong> domainAnda.com/bayar/
                    {router?.slug}
                  </p>
                </>
              )}
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Payment Gateway Settings
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="flex items-center mb-4">
                  <label className="mr-3">Aktifkan Payment Gateway</label>
                  <Switch
                    checked={paymentActive}
                    onCheckedChange={handleTogglePayment}
                    className="ml-auto"
                  />
                </div>
                {paymentActive && (
                  <div>
                    <label className="block mb-2">Select Payment Gateway</label>
                    <select
                      value={paymentGateway}
                      onChange={(e) => setPaymentGateway(e.target.value)}
                      className="w-full border rounded-md p-2"
                      required
                    >
                      <option value="" disabled>
                        Select Payment Gateway
                      </option>
                      {paymentGateways.map((gateway) => (
                        <option key={gateway._id} value={gateway._id}>
                          {gateway.code}{" "}
                        </option>
                      ))}
                    </select>

                    <p className="mt-4">Slug</p>
                    <Input value={router.slug} disabled />
                  </div>
                )}
                <Button type="submit" className="mt-4" disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default RouterDetail;
