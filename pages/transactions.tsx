import React, { useState } from "react";

import TransactionGrid from "@/components/DataTable/TransactionDataGrid";
import ExpenseForm from "@/components/Forms/ExpensesForm";
import IncomeForm from "@/components/Forms/IncomeForm";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const Transactions = () => {
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "income"
  );

  const handleTransactionType = (type: "income" | "expense") => {
    setTransactionType(type);
  };

  return (
    <Container maxWidth="lg">
      <Grid container direction="row" spacing={2}>
        <Grid size={4}>
          <Stack direction="row" spacing={2}>
            <Chip
              component="button"
              onClick={() => handleTransactionType("income")}
              label="income"
              clickable
              color={transactionType === "income" ? "primary" : "default"}
            />
            <Chip
              component="button"
              onClick={() => handleTransactionType("expense")}
              label="expense"
              clickable
              color={transactionType === "expense" ? "error" : "default"}
            />
          </Stack>
          <Stack direction="column" spacing={2}>
            {/* 2 form types for expense or income */}
            <Typography variant="subtitle2" color="text.secondary">
              {" "}
              Add new {transactionType} here
            </Typography>
            {transactionType === "income" ? <IncomeForm /> : <ExpenseForm />}
          </Stack>
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid size={7}>
          <TransactionGrid />
        </Grid>
      </Grid>
    </Container>
  );
};
export default Transactions;
