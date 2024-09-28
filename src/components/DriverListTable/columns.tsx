import { ColumnDef } from "@tanstack/react-table";

export type Activity = {
  id: string;
  ID: string;
  name: string;
  date: string;
  email: number;
  status: "Pending" | "Approved" | "Rejected";
};

export const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: "ID",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Driver's Name",
  },  
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "email",
    header: "Driver's Email",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "action",
    header: "Action",
  },
];