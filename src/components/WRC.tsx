"use client";

import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface WRCLeader {
  rank: string;
  name: string;
  image: string;
  stats: {
    "wRC+": string;
    Team: string;
  };
}

const WRC: React.FC = () => {
  const [data, setData] = useState<WRCLeader[]>([]);

  useEffect(() => {
    // Fetch the JSON data from the public folder
    fetch("/wrc_plus_leaders_2024.json")
      .then((response) => response.json())
      .then((data) => setData(data.slice(0, 5))) 
      .catch((error) => console.error("Error loading wRC+ leaders data:", error));
  }, []);

  const columns: ColumnDef<WRCLeader>[] = [
    {
      accessorKey: "rank",
      header: "Rank",
    },
    {
      accessorKey: "stats.Team",
      header: "Team",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "image",
      header: "Profile Picture",
      cell: ({ row }) => (
        <img
          src={row.original.image}
          alt={row.original.name}
          className="w-10 h-10 object-contain rounded-full"
        />
      ),
    },
    {
      accessorKey: "stats.wRC+",
      header: "wRC+",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-auto">
      <div
        className="rounded-md border"
        style={{
          minWidth: "600px", // Ensure the popover has enough space for all columns
          tableLayout: "auto",
        }}
      >
        <Table className="table-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
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
                  No data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WRC;
