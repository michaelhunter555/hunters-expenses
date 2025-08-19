"use client";

import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Chip } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/hooks/useHttp";
import Link from "next/link";

/** Column definitions */
const columns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
  { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
  {
    field: "date",
    headerName: "Date",
    flex: 1,
    minWidth: 120,
    //valueFormatter: ({ value }) => String(value).split("T")[0],
  },
  {
    field: "isLicensed",
    headerName: "Licensed",
    flex: 0.7,
    renderCell: (params) => (
      <Chip
        label={params.value ? "YES" : "NO"}
        color={params.value ? "success" : "default"}
        size="small"
      />
    ),
  },
  {
    field: "termsApproved",
    headerName: "Agreed Terms",
    flex: 0.7,
    renderCell: (params) => (
      <Chip
        label={params.value ? "YES" : "NO"}
        color={params.value ? "success" : "error"}
        size="small"
      />
    ),
  },
  {
    field: "action",
    headerName: "Action",
    flex: 1,
    renderCell: (params) => (
      <Link href={`application/${params.row._id}`} style={{ textDecoration: "none" }}>
        <Button variant="outlined" size="small">
          View Details
        </Button>
      </Link>
    ),
  },
  
];

export default function ApplicationsDataGrid() {
  const { request } = useApi();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchApplications = async (page: number, limit: number) => {
    const data = await request(
      `admin/get-applications?page=${page}&limit=${limit}&order=1`
    );
    return data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["applications", page, limit],
    queryFn: () => fetchApplications(page, limit),
    placeholderData: (prev) => prev,
  });

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
  rows={data?.applications || []}
  columns={columns}
  getRowId={(row) => row._id}
  loading={isLoading}
  paginationMode="server"
  paginationModel={{ page: page - 1, pageSize: limit }}
  onPaginationModelChange={(model) => {
    setPage(model.page + 1);
  }}
  rowCount={data?.totalApplications || 0}
  autoHeight
  density="compact"
  checkboxSelection
/>

    </div>
  );
}
