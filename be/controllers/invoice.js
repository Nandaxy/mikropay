const Transaction = require("../models/Transaction");

exports.getInvoice = async (req, res) => {
    const { id } = req.params;
  try {
    const transactions = await Transaction.find({reference: id});

    if (!transactions) {
      return res.status(404).json({
        success: false,
        message: "Invoices not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Invoices fetched successfully",
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching invoices",
      error: error.message,
    });
  }
};
