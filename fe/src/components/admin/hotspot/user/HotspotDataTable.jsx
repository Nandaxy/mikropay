import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddUserHotspot from "./add/AddUserHotspot";
import AddUserHotspotBatch from "./add/AddUserHotspotBatch";
import { postAction } from "../../../../lib/action";
import { useToast } from "@/hooks/use-toast";

const statusOptions = [
  { value: "", label: "All" },
  { value: "Available", label: "Available" },
  { value: "In-use", label: "In-use" },
  { value: "Expired", label: "Expired" },
];

const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        onCheckedChange={(isChecked) => {
          table.getRowModel().rows.forEach((row) => {
            row.toggleSelected(isChecked);
          });
        }}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={() => row.toggleSelected()}
      />
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const uptime = row.getValue("uptime");
      const limitUptime = row.getValue("limit-uptime");

      let status = "";
      if (uptime === "0s") {
        status = "Available";
      } else if (uptime === limitUptime) {
        status = "Expired";
      } else {
        status = "In-use";
      }

      return (
        <Badge
          className={
            status === "Available"
              ? "bg-green-500"
              : status === "Expired"
              ? "bg-red-500"
              : "bg-yellow-500"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "password",
    header: "Password",
    cell: ({ row }) => <div>{row.getValue("password")}</div>,
  },
  {
    accessorKey: "profile",
    header: "Profile",
    cell: ({ row }) => <div>{row.getValue("profile")}</div>,
  },
  {
    accessorKey: "uptime",
    header: "Uptime",
    cell: ({ row }) => <div>{row.getValue("uptime")}</div>,
  },
  {
    accessorKey: "limit-uptime",
    header: "Limit Uptime",
    cell: ({ row }) => <div>{row.getValue("limit-uptime")}</div>,
  },
  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }) => <div>{row.getValue("comment")}</div>,
  },
  {
    accessorKey: "disabled",
    header: "Disabled",
    cell: ({ row }) => <div>{row.getValue("disabled")}</div>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const hotspotUser = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(hotspotUser.name)}
            >
              Copy User Name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function HotspotUserTable({
  userHotspot,
  routerData,
  refreshData,
}) {
  const { toast } = useToast();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const [voucherTemplate, setVoucherTemplate] = useState(null);

  // Pagination state
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(100000); // Number of rows per page

  const table = useReactTable({
    data: userHotspot || [], // Default to an empty array if userHotspot is undefined
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  });

  // Updated function to handle generating vouchers
  const handleGenerateVoucher = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedData = selectedRows.map((row) => row.original);

    try {
      const response = await postAction({
        endpoint: "api/admin/hotspot/voucher/generate",
        // eslint-disable-next-line react/prop-types
        data: { users: selectedData, routerId: routerData._id },
      });

      if (response.status === 200) {
        setVoucherTemplate(response.data.template);

        toast({
          title: "Vouchers generated successfully",
          description: "The vouchers have been generated and saved.",
        });

        const newTab = window.open("", "VoucherTemplate");
        newTab.document.open();
        newTab.document.write(response.data.template);
        newTab.document.close();
      } else {
        console.error("Failed to generate vouchers:", response.data.message);
        toast({
          title: "Error generating vouchers",
          description: "An error occurred while generating the vouchers.",
        });
      }
    } catch (error) {
      console.error("Error generating vouchers:", error);
      toast({
        title: "Error generating vouchers",
        description: "An error occurred while generating the vouchers.",
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Function to handle generating vouchers

  // Function to handle deleting batch
  const handleDeleteBatch = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedData = selectedRows.map((row) => row.original);
    console.log("Selected data for batch deletion:", selectedData);
    // Logic to delete users goes here
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4 overflow-x-auto">
        <Input
          placeholder="Cari User..."
          value={table.getColumn("name")?.getFilterValue() || ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="min-w-[100px] max-w-md"
        />
        {/* Filter by status dropdown */}
        <select
          className="ml-2 max-w-sm"
          value={table.getColumn("status")?.getFilterValue() || ""}
          onChange={(event) =>
            table.getColumn("status")?.setFilterValue(event.target.value)
          }
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}> */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="ml-2">+ User</Button>
          </DialogTrigger>
          <DialogContent className="flex flex-col justify-center items-center md:w-fit">
            <AddUserHotspot routerData={routerData} onClose={handleClose} />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml-2">+ User Batch</Button>
          </DialogTrigger>
          <DialogContent className="flex flex-col justify-center items-center md:w-fit">
            <AddUserHotspotBatch routerData={routerData} />
          </DialogContent>
        </Dialog>

        <Button
          className="ml-2"
          onClick={handleGenerateVoucher}
          disabled={table.getSelectedRowModel().rows.length === 0} // Disable button if no rows are selected
        >
          Generate Voucher
        </Button>
        <Button
          className="ml-2"
          onClick={handleDeleteBatch}
          disabled={table.getSelectedRowModel().rows.length === 0} // Disable button if no rows are selected
        >
          Delete Batch
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination controls can be added here */}
      {/* <Pagination
        currentPage={table.getState().pagination.pageIndex + 1}
        totalPages={table.getPageCount()}
        pageSize={table.getState().pagination.pageSize}
        setPageIndex={(index) => table.setPageIndex(index)}
        setPageSize={(size) => table.setPageSize(size)}
      /> */}
    </div>
  );
}
