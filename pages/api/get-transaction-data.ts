import { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";

export default async function getTransaction(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { page, limit } = req.query;
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;

  await dbConnect();

  try {
    const transactions = await Transaction.find({})
      .sort({ dateOfTransaction: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const totalTransactions = await Transaction.countDocuments({});
    res.status(200).json({
      transactions,
      currentPage: page,
      totalPages: Math.ceil(totalTransactions / limitNum),
      totalTransactions,
      ok: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err, ok: false });
  }
}
