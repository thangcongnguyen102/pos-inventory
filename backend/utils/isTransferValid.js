function isTransferValid(stock, transferQty) {
    return stock >= transferQty && transferQty > 0;
  }
  module.exports = isTransferValid;
  