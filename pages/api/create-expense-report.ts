import { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Categories";
import Expense from "@/models/Income";
import Transaction from "@/models/Transaction";

export default async function createExpenseReport(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const expense = req.body;
  await dbConnect();

  try {
    const newExpense = {
      initialAmount: expense.initialAmount,
      amountOwed: expense.initialAmount,
      lastUpdateDate: new Date(),
      category: expense.category,
      totalDeduction: expense.initialAmount,
      startDate: new Date(),
      taxAmount: expense?.taxAmount ? expense.taxAmount : 0,
      commment: expense.comment ? expense.comment : "",
    };

    const expenseAction = new Expense(newExpense);
    const transaction = new Transaction({
      type: "expense",
      dateOfTransaction: new Date(),
      totalAmount: -expense?.initialAmount,
      ...newExpense,
    });

    await expenseAction.save();
    await transaction.save();

    const category = await Category.findOne({ categoryName: expense.category });
    if (category) {
      category.totalTransactions = category.totalTransactions += 1;
      category.totalRevenue = category.totalRevenue -= expense?.initialAmount;
      category.lastUpdated = new Date();
      await category.save();
    } else {
      const newCategory = new Category({
        categoryName: expense?.category,
        totalTransactions: 1,
        totalRevenue: expense?.totalAmount,
        lastUpdated: new Date(),
      });

      await newCategory.save();
    }
    res.status(201).json({
      successMessage: "Successfully created added new transaction",
      ok: true,
    });
  } catch (err) {
    console.log("There was an error updating the database. " + err);
    res.status(500).json({ error: err, ok: false });
  }
}
