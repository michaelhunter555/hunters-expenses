import React, { useEffect, useState } from "react";

import { useTransaction } from "@/hooks/useTransaction";
import { Transactions } from "@/types";
import {
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";

const TransactionsTable = () => {
  const { getTransactions } = useTransaction();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [totalPages, setTotalPages] = useState(1);

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions", page, limit],
    queryFn: () => getTransactions(page, limit),
    staleTime: 2 * 60 * 60 * 1000,
  });

  console.log("TransationArr: ", transactions?.transactions?.length);

  useEffect(() => {
    if (
      transactions?.totalTransactions &&
      totalPages !== transactions?.totalTransactions
    ) {
      setTotalPages(transactions?.totalTransactions);
    }
  }, [transactions?.totalTransactions, totalPages]);

  const handlePageChange = (val: number) => {
    setPage(val);
  };

  return (
    <>
      {transactions?.transactions.length === 0 && !transactionsLoading && (
        <Stack direction="column">
          <Typography variant="h3" color="text.secondary">
            You don't have any transactions yet.
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Add a transaction and a table will populate your data.
          </Typography>
        </Stack>
      )}
      {transactions?.transactions &&
        !transactionsLoading &&
        transactions?.transactions?.length > 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions?.transactions?.map(
                  (transaction: Transactions, i: number) => (
                    <TableRow key={transactions?._id}>
                      <TableCell>{transaction?.type}</TableCell>
                      <TableCell>{transaction?.category}</TableCell>
                      <TableCell>{transaction?.totalAmount}</TableCell>
                      <TableCell>
                        {String(transaction?.dateOfTransaction)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
            <Pagination
              page={transactions?.page}
              count={totalPages}
              onChange={(event, page) => handlePageChange(page)}
            />
          </TableContainer>
        )}
    </>
  );
};

export default TransactionsTable;
