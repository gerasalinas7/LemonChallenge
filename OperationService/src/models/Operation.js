const mongoose = require('mongoose');

const OperationSchema = new mongoose.Schema({
  transaction_id: String,
  type: String,
  user_id: String,
  created_at: { type: Date, default: Date.now },
  amount: Number,
  currency: String,
  data: [{
    name: String,
    value: String,
  }],
});

module.exports = mongoose.model('Operation', OperationSchema);
