/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { BASE_URL } from "@/lib/config";

import {
  Bell,
  CircleUser,
  Home,
  Menu,
  Package2,
  Search,
  Users,
  Settings,
  Router,
  Server,
  Cable,
  Wifi,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { postAction } from "@/lib/action";

const Sidebar = ({ children, user }) => {
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("refreshToken");
      const payload = {
        token,
      };

      const response = await postAction({
        endpoint: "api/auth/logout",
        data: payload,
      });

      console.log(response.data.status);

      if (response.data.status == 200) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        toast({
          title: "Logout Success",
          description: "You have been logged out.",
          variant: "default",
        });

        setTimeout(() => {
          window.location.reload();
        }, 500);
        // navigate("/login");
      } else {
        toast({
          title: "Logout Failed",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // console.error("Error during logout:", error);
      toast({
        title: "Logout Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">MikroPay v.1</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">MikroPay v.1</span>
              </Link>
              <Link
                to="/dashboard"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2  text-muted-foreground hover:text-foreground"
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="#"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2  text-muted-foreground hover:text-foreground"
              >
                <Users className="h-5 w-5" />
                Customers
              </Link>

              <Collapsible>
                <CollapsibleTrigger className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                  <Server className="h-5 w-5" />
                  Service
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-8">
                  <Link
                    to="/service/limit"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    Limitasi
                  </Link>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                  <Cable className="h-5 w-5" />
                  PPPOE
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-8">
                  <Link
                    to="/pppoe/profile"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/pppoe/pool"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    IP Pool
                  </Link>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                  <Wifi className="h-5 w-5" />
                  Hotspot
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-8">
                  <Link
                    to="/hotspot/user"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    User
                  </Link>
                  <Link
                    to="/hotspot/profile"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    Profile
                  </Link>
                </CollapsibleContent>
              </Collapsible>

              <Link
                to="/router"
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl text-muted-foreground px-3 py-2  hover:text-foreground"
              >
                <Router className="h-5 w-5" />
                Routers
              </Link>

              <Collapsible>
                <CollapsibleTrigger className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                  <Settings className="h-5 w-5" />
                  Setting
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-8">
                  <Link
                    to="/setting/general"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    Umum
                  </Link>
                  <Link
                    to="/setting/tripay"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    Tripay
                  </Link>
                  <Link
                    to={`/template?mode=voucher`}
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    Template Editor
                  </Link>
                  <Link
                    to={`${BASE_URL}download/template-hotspot`}
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    Download Login Page
                  </Link>
                </CollapsibleContent>
              </Collapsible>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">MikroPay v.1</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2  text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2  text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Customers
                </Link>

                <Collapsible>
                  <CollapsibleTrigger className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                    <Server className="h-5 w-5" />
                    Service
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-8">
                    <Link
                      to="#"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      Limitasi
                    </Link>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                    <Cable className="h-5 w-5" />
                    PPPOE
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-8">
                    <Link
                      to="/pppoe/profile"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/pppoe/pool"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      IP Pool
                    </Link>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                    <Wifi className="h-5 w-5" />
                    Hotspot
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-8">
                    <Link
                      to="/hotspot/user"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      User
                    </Link>
                    <Link
                      to="/hotspot/profile"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      Profile
                    </Link>
                  </CollapsibleContent>
                </Collapsible>

                <Link
                  to="/router"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl text-muted-foreground px-3 py-2  hover:text-foreground"
                >
                  <Router className="h-5 w-5" />
                  Routers
                </Link>

                <Collapsible>
                  <CollapsibleTrigger className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                    <Settings className="h-5 w-5" />
                    Setting
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-8">
                    <Link
                      to="/setting/general"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      Umum
                    </Link>
                    <Link
                      to="/setting/tripay"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      Tripay
                    </Link>
                    <Link
                      to={`/template?mode=voucher`}
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      Template Editor
                    </Link>
                    <Link
                      to={`${BASE_URL}download/template-hotspot`}
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl  px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      Download Login Page
                    </Link>
                  </CollapsibleContent>
                </Collapsible>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/dashboard">Dashboard </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/router">Router</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
