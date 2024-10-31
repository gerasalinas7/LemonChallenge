const mongoose = require('mongoose');

const OperationSchema = new mongoose.Schema({
  transaction_id: String,
  type: String,
  user_id: String,
  created_at: { type: Date, default: Date.now },
  amount: Number,
  currency: String,
  company: String,       
  account_id: String,    
  data: [{
    name: String,
    value: String,
  }],
});

OperationSchema.index({ user_id: 1 });
OperationSchema.index({ company: 1 });
OperationSchema.index({ account_id: 1 });

module.exports = mongoose.model('Operation', OperationSchema);
