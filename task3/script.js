const products = {
  laptop:     { name: "Laptop",       unitPrice: 89999,  icon: "💻" },
  smartphone: { name: "Smartphone",   unitPrice: 45999,  icon: "📱" },
  tablet:     { name: "Tablet",       unitPrice: 32999,  icon: "📟" },
  headphones: { name: "Headphones",   unitPrice: 7999,   icon: "🎧" },
  smartwatch: { name: "Smart Watch",  unitPrice: 18999,  icon: "⌚" }
};

let order = {
  productKey: "laptop",
  quantity: 2,
  customerType: "premium"
};

const DISCOUNT_THRESHOLDS = [
  { minAmount: 100000, regular: 5,  premium: 10, student: 8  },
  { minAmount: 50000,  regular: 3,  premium: 7,  student: 5  },
  { minAmount: 20000,  regular: 0,  premium: 5,  student: 3  }
];

const FREE_DELIVERY_THRESHOLD = 50000;
const STANDARD_DELIVERY = 500;
const EXPRESS_DELIVERY = 200;

function getDiscountRate(subtotal, customerType) {
  for (const tier of DISCOUNT_THRESHOLDS) {
    if (subtotal >= tier.minAmount) {
      return tier[customerType];
    }
  }
  return 0;
}

function calculateOrder(order) {
  const product = products[order.productKey];
  const subtotal = product.unitPrice * order.quantity;
  const discountRate = getDiscountRate(subtotal, order.customerType);
  const discountAmount = Math.round(subtotal * discountRate / 100);
  const afterDiscount = subtotal - discountAmount;

  let deliveryCharge = 0;
  let deliveryNote = "Free delivery applied";

  if (afterDiscount < FREE_DELIVERY_THRESHOLD) {
    deliveryCharge = order.customerType === "premium" ? EXPRESS_DELIVERY : STANDARD_DELIVERY;
    deliveryNote = order.customerType === "premium"
      ? `Express delivery charge (order below Rs. ${FREE_DELIVERY_THRESHOLD.toLocaleString()})`
      : `Standard delivery charge (order below Rs. ${FREE_DELIVERY_THRESHOLD.toLocaleString()})`;
  }

  const finalAmount = afterDiscount + deliveryCharge;

  return {
    product,
    subtotal,
    discountRate,
    discountAmount,
    deliveryCharge,
    deliveryNote,
    finalAmount,
    customerLabel: { regular: "Regular Customer", premium: "Premium Member", student: "Student Customer" }[order.customerType]
  };
}

function formatRs(amount) {
  return "Rs. " + amount.toLocaleString("en-PK");
}

function recalculate() {
  order.productKey = document.getElementById("productSelect").value;
  order.quantity = parseInt(document.getElementById("quantityInput").value) || 1;
  order.customerType = document.getElementById("customerType").value;
  render();
}

function render() {
  const calc = calculateOrder(order);

  document.getElementById("productInfo").innerHTML = `
    <div class="d-flex align-items-center gap-3 mb-3">
      <div class="product-icon">${calc.product.icon}</div>
      <div>
        <h6 class="mb-0">${calc.product.name}</h6>
        <small class="text-muted">${calc.customerLabel}</small>
      </div>
    </div>
    <table class="table table-sm">
      <tr><td>Product</td><td class="text-end"><strong>${calc.product.name}</strong></td></tr>
      <tr><td>Quantity</td><td class="text-end">${order.quantity}</td></tr>
      <tr><td>Unit Price</td><td class="text-end">${formatRs(calc.product.unitPrice)}</td></tr>
    </table>
  `;

  document.getElementById("orderSummary").innerHTML = `
    <div class="summary-row"><span>Subtotal</span><strong>${formatRs(calc.subtotal)}</strong></div>
    <div class="summary-row">
      <span>Discount (${calc.discountRate}%)</span>
      <strong class="text-success">- ${formatRs(calc.discountAmount)}</strong>
    </div>
    <div class="summary-row">
      <span>Delivery</span>
      <strong>${calc.deliveryCharge === 0 ? "Free" : formatRs(calc.deliveryCharge)}</strong>
    </div>
    <small class="text-muted d-block mb-3">${calc.deliveryNote}</small>
    <div class="summary-row pt-2">
      <span class="fw-semibold">Final Amount</span>
      <span class="final-amount">${formatRs(calc.finalAmount)}</span>
    </div>
  `;
}

document.getElementById("productSelect").innerHTML = Object.entries(products).map(([key, p]) =>
  `<option value="${key}" ${key === order.productKey ? 'selected' : ''}>${p.name} — ${formatRs(p.unitPrice)}</option>`
).join("");

document.getElementById("quantityInput").value = order.quantity;
document.getElementById("customerType").value = order.customerType;
render();
