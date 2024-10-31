const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transaction_id: String,
  type: {
    type: String,
    enum: ['SWAP', 'DEPOSIT', 'WITHDRAWAL', 'BILL_PAYMENT'],
    required: true,
  },
  user_id: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now },
  additional_data: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model('Transaction', TransactionSchema);
