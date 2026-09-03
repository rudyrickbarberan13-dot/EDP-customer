
function calculateItemAmount(price, quantity) {
    return price * quantity;
}

function calculateDiscount(subtotal) {
    if (subtotal >= 5000) {
        return subtotal * 0.10;
    } else if (subtotal >= 3000) {
        return subtotal * 0.07;
    } else if (subtotal >= 1000) {
        return subtotal * 0.05;
    } else {
        return 0;
    }
}

function getDeliveryFee(option) {
    switch (Number(option)) {
        case 1:
            return 0;
        case 2:
            return 80;
        case 3:
            return 150;
        default:
            return 0;
    }
}

// --- Helper functions ---

function formatPeso(amount) {
    return "₱" + amount.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getDiscountRateLabel(subtotal) {
    if (subtotal >= 5000) return "10%";
    if (subtotal >= 3000) return "7%";
    if (subtotal >= 1000) return "5%";
    return "0%";
}

function getDeliveryTypeLabel(option) {
    switch (Number(option)) {
        case 1: return "Store Pickup";
        case 2: return "Standard Delivery";
        case 3: return "Express Delivery";
        default: return "Store Pickup";
    }
}

// --- Product input generation using a for loop ---

function generateProductInputs() {
    const count = parseInt(document.querySelector("#productCount").value);
    const productsContainer = document.querySelector("#productsContainer");
    productsContainer.innerHTML = "";

    if (isNaN(count) || count <= 0) {
        return;
    }

    for (let i = 0; i < count; i++) {
        const entry = document.createElement("div");
        entry.className = "product-entry";
        entry.innerHTML = `
            <h3>Product ${i + 1}</h3>
            <div class="product-row">
                <div class="form-group">
                    <label for="productName-${i}">Product Name</label>
                    <input type="text" id="productName-${i}" placeholder="e.g. Keyboard">
                </div>
                <div class="form-group">
                    <label for="productPrice-${i}">Price</label>
                    <input type="number" id="productPrice-${i}" placeholder="0.00" min="0" step="0.01">
                </div>
                <div class="form-group">
                    <label for="productQuantity-${i}">Quantity</label>
                    <input type="number" id="productQuantity-${i}" placeholder="1" min="1">
                </div>
            </div>
        `;
        productsContainer.appendChild(entry);
    }
}

// --- Input validation ---

function validateInputs() {
    const name = document.querySelector("#customerName").value.trim();
    const count = parseInt(document.querySelector("#productCount").value);
    const validationMessage = document.querySelector("#validationMessage");

    if (name === "") {
        validationMessage.textContent = "Please enter the customer name.";
        validationMessage.className = "error";
        return false;
    }

    if (isNaN(count) || count <= 0) {
        validationMessage.textContent = "Please enter a valid number of products (at least 1).";
        validationMessage.className = "error";
        return false;
    }

    for (let i = 0; i < count; i++) {
        const productName = document.querySelector(`#productName-${i}`);
        const productPrice = document.querySelector(`#productPrice-${i}`);
        const productQuantity = document.querySelector(`#productQuantity-${i}`);

        if (!productName || !productPrice || !productQuantity) {
            validationMessage.textContent = `Product ${i + 1} input fields are missing.`;
            validationMessage.className = "error";
            return false;
        }

        const pName = productName.value.trim();
        const pPrice = parseFloat(productPrice.value);
        const pQty = parseInt(productQuantity.value);

        if (pName === "") {
            validationMessage.textContent = `Please enter a name for Product ${i + 1}.`;
            validationMessage.className = "error";
            return false;
        }

        if (isNaN(pPrice) || pPrice <= 0) {
            validationMessage.textContent = `Please enter a valid positive price for Product ${i + 1}.`;
            validationMessage.className = "error";
            return false;
        }

        if (isNaN(pQty) || pQty <= 0) {
            validationMessage.textContent = `Please enter a valid positive quantity for Product ${i + 1}.`;
            validationMessage.className = "error";
            return false;
        }
    }

    validationMessage.textContent = "All inputs are valid!";
    validationMessage.className = "success";
    return true;
}

// --- Main checkout calculation (for loop processes each product) ---

function calculateOrder() {
    if (!validateInputs()) {
        document.querySelector("#orderSummary").style.display = "none";
        return;
    }

    const customerName = document.querySelector("#customerName").value.trim();
    const productCount = parseInt(document.querySelector("#productCount").value);
    const deliveryOpt = document.querySelector("#deliveryOption").value;

    let subtotal = 0;
    let productDetails = [];

    // For loop to process each product
    for (let i = 0; i < productCount; i++) {
        const name = document.querySelector(`#productName-${i}`).value.trim();
        const price = parseFloat(document.querySelector(`#productPrice-${i}`).value);
        const quantity = parseInt(document.querySelector(`#productQuantity-${i}`).value);

        const amount = calculateItemAmount(price, quantity);
        subtotal += amount;

        productDetails.push({
            name: name,
            price: price,
            quantity: quantity,
            amount: amount
        });
    }

    const discountAmount = calculateDiscount(subtotal);
    const deliveryFee = getDeliveryFee(deliveryOpt);
    const finalAmount = subtotal - discountAmount + deliveryFee;

    // Build order summary HTML
    let summaryHTML = `<h2>Order Summary</h2>`;
    summaryHTML += `<div class="summary-customer"><strong>Customer:</strong> ${customerName}</div>`;

    // Product items
    for (let i = 0; i < productDetails.length; i++) {
        const item = productDetails[i];
        summaryHTML += `
            <div class="product-item">
                <div>
                    <span class="item-num">${i + 1}.</span>
                    <span class="item-name">${item.name}</span>
                </div>
                <div class="item-details">
                    Price: ${formatPeso(item.price)} &nbsp;|&nbsp; Qty: ${item.quantity}<br>
                    <span class="item-amount">Amount: ${formatPeso(item.amount)}</span>
                </div>
            </div>
        `;
    }

    // Totals
    summaryHTML += `
        <div class="summary-totals">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>${formatPeso(subtotal)}</span>
            </div>
            <div class="summary-row discount">
                <span>Discount Rate:</span>
                <span>${getDiscountRateLabel(subtotal)}</span>
            </div>
            <div class="summary-row discount">
                <span>Discount Amount:</span>
                <span>-${formatPeso(discountAmount)}</span>
            </div>
            <div class="summary-row">
                <span>Delivery Type:</span>
                <span>${getDeliveryTypeLabel(deliveryOpt)}</span>
            </div>
            <div class="summary-row">
                <span>Delivery Fee:</span>
                <span>${formatPeso(deliveryFee)}</span>
            </div>
            <div class="summary-row total">
                <span>Final Amount:</span>
                <span>${formatPeso(finalAmount)}</span>
            </div>
        </div>
    `;

    const orderSummary = document.querySelector("#orderSummary");
    orderSummary.innerHTML = summaryHTML;
    orderSummary.style.display = "block";

    // Optional debugging output
    console.log("=== Checkout Debug ===");
    console.log("Customer:", customerName);
    console.log("Subtotal:", subtotal);
    console.log("Discount:", discountAmount);
    console.log("Delivery Fee:", deliveryFee);
    console.log("Final Amount:", finalAmount);
}

// --- Attach event listeners ---

document.querySelector("#calculateBtn").addEventListener("click", calculateOrder);
document.querySelector("#productCount").addEventListener("input", generateProductInputs);