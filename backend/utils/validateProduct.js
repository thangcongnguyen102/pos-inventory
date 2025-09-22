function validateProduct(product) {
    return (
      typeof product.name === "string" &&
      product.name.trim() !== "" &&
      typeof product.price === "number" &&
      product.price > 0
    );
  }
  module.exports = validateProduct;
  