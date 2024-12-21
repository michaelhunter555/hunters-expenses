import React, { useState } from "react";

import { useTransaction } from "@/hooks/useTransaction";
import { Transactions } from "@/types";
import Chip from "@mui/material/Chip";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";

function renderTransactionType(status: "income" | "expense") {
  const colors: { [index: string]: "success" | "default" } = {
    income: "success",
    expense: "default",
  };

  return <Chip label={status} color={colors[status]} size="small" />;
}

export const columns: GridColDef[] = [
  {
    field: "type",
    headerName: "Transaction",
    flex: 0.5,
    minWidth: 80,
    renderCell: (params) => renderTransactionType(params.value as any),
  },
  {
    field: "category",
    headerName: "Category",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "totalAmount",
    headerName: "Total Amount",
    flex: 1,
    minWidth: 100,
  },
  {
    field: "date",
    headerName: "Date",
    flex: 1,
    minWidth: 120,
  },
];

const localizeDate = (day: string) => {
  const date = new Date(day);
  return date.toLocaleString();
};

export default function TransactionGrid() {
  const { getTransactions } = useTransaction();
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const {
    data: transactions,
    isLoading: transactionsLoading,
    refetch: refetchTransaction,
  } = useQuery({
    queryKey: [
      "transactions",
      paginationModel.page + 1,
      paginationModel.pageSize,
    ],
    queryFn: () =>
      getTransactions(paginationModel.page + 1, paginationModel.pageSize),
    staleTime: 2 * 60 * 60 * 1000,
  });

  const rows: GridRowsProp =
    transactions?.transactions?.map((val: Transactions) => ({
      id: val?._id,
      type: val?.type,
      category: val?.category,
      totalAmount: `$${val?.totalAmount?.toFixed(2)}`,
      date: localizeDate(String(val?.dateOfTransaction)),
    })) || [];

  return (
    <DataGrid
      checkboxSelection
      rows={rows}
      columns={columns}
      rowCount={transactions?.transactions?.length}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      pageSizeOptions={[10, 20, 50]}
      disableColumnResize
      density="compact"
      paginationMode="server"
      slotProps={{
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: "outlined",
              size: "small",
            },
            columnInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            operatorInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: "outlined",
                size: "small",
              },
            },
          },
        },
      }}
    />
  );
}
