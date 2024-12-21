import { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Categories";
import Income from "@/models/Income";
import Transaction from "@/models/Transaction";

export default async function createIncomeReport(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const income = req.body;
  await dbConnect();

  try {
    const totalNetProfit =
      income.totalAmount -
      (income.cogs +
        income.processingFees * income.totalAmount +
        0.06 * income.totalAmount);

    const newIncome = {
      totalAmount: income.totalAmount,
      dateOfTransaction: new Date(),
      category: income.category,
      cogs: income.cogs,
      grossProfit: Number(income.totalAmount) - Number(income.cogs),
      taxAmount: 0.06,
      processingFees: income.processingFees,
      netProfit: totalNetProfit,
      commment: income.comment,
    };

    const createIncome = new Income(newIncome);
    const transaction = new Transaction({
      type: "income",
      ...newIncome,
    });

    await createIncome.save();
    await transaction.save();

    const category = await Category.findOne({ categoryName: income?.category });
    if (category) {
      category.totalTransactions = category.totalTransactions += 1;
      category.totalRevenue = category.totalRevenue += income?.totalAmount;
      category.lastUpdated = new Date();

      await category.save();
    } else {
      const newCategory = new Category({
        categoryName: income?.category,
        totalTransactions: 1,
        totalRevenue: income?.totalAmount,
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
