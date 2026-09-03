// ==========================================
// REQUIRED FUNCTIONS
// ==========================================

// Calculate the amount of one product
function calculateItemAmount(price, quantity) {
    return price * quantity;
}


// Calculate the discount based on subtotal
function calculateDiscount(subtotal) {

    if (subtotal >= 5000) {
        return subtotal * 0.10;
    }

    else if (subtotal >= 3000) {
        return subtotal * 0.07;
    }

    else if (subtotal >= 1000) {
        return subtotal * 0.05;
    }

    else {
        return 0;
    }
}


// Get the delivery fee
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


// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Format amount as Philippine Peso
function formatPeso(amount) {

    return "₱" + amount.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


// Get discount rate
function getDiscountRateLabel(subtotal) {

    if (subtotal >= 5000) {
        return "10%";
    }

    else if (subtotal >= 3000) {
        return "7%";
    }

    else if (subtotal >= 1000) {
        return "5%";
    }

    else {
        return "0%";
    }
}


// Get delivery name
function getDeliveryTypeLabel(option) {

    switch (Number(option)) {

        case 1:
            return "Store Pickup";

        case 2:
            return "Standard Delivery";

        case 3:
            return "Express Delivery";

        default:
            return "Unknown";
    }
}


// ==========================================
// GENERATE PRODUCT INPUTS
// ==========================================

function generateProductInputs() {

    const productCountInput =
        document.querySelector("#productCount");

    const productsContainer =
        document.querySelector("#productsContainer");

    const count =
        parseInt(productCountInput.value);

    productsContainer.innerHTML = "";

    if (isNaN(count) || count <= 0) {
        return;
    }


    // Required FOR LOOP
    for (let i = 0; i < count; i++) {

        const productEntry =
            document.createElement("div");

        productEntry.className = "product-entry";

        productEntry.innerHTML = `

            <h3>Product ${i + 1}</h3>

            <div class="product-row">

                <div class="form-group">
                    <label for="productName-${i}">
                        Product Name
                    </label>

                    <input
                        type="text"
                        id="productName-${i}"
                        placeholder="e.g. Keyboard"
                    >
                </div>


                <div class="form-group">
                    <label for="productPrice-${i}">
                        Price
                    </label>

                    <input
                        type="number"
                        id="productPrice-${i}"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                    >
                </div>


                <div class="form-group">
                    <label for="productQuantity-${i}">
                        Quantity
                    </label>

                    <input
                        type="number"
                        id="productQuantity-${i}"
                        placeholder="1"
                        min="1"
                    >
                </div>

            </div>
        `;

        productsContainer.appendChild(productEntry);
    }
}


// ==========================================
// VALIDATE INPUTS
// ==========================================

function validateInputs() {

    const customerName =
        document.querySelector("#customerName").value.trim();

    const productCount =
        parseInt(document.querySelector("#productCount").value);

    const validationMessage =
        document.querySelector("#validationMessage");


    // Validate customer name
    if (customerName === "") {

        validationMessage.textContent =
            "Please enter the customer name.";

        validationMessage.className = "error";

        return false;
    }


    // Validate product count
    if (
        isNaN(productCount) ||
        productCount <= 0
    ) {

        validationMessage.textContent =
            "Please enter a valid number of products (at least 1).";

        validationMessage.className = "error";

        return false;
    }


    // Validate every product
    for (let i = 0; i < productCount; i++) {

        const productName =
            document.querySelector(`#productName-${i}`);

        const productPrice =
            document.querySelector(`#productPrice-${i}`);

        const productQuantity =
            document.querySelector(`#productQuantity-${i}`);


        if (
            !productName ||
            !productPrice ||
            !productQuantity
        ) {

            validationMessage.textContent =
                `Product ${i + 1} fields are missing.`;

            validationMessage.className = "error";

            return false;
        }


        const name =
            productName.value.trim();

        const price =
            parseFloat(productPrice.value);

        const quantity =
            parseInt(productQuantity.value);


        // Product name validation
        if (name === "") {

            validationMessage.textContent =
                `Please enter a name for Product ${i + 1}.`;

            validationMessage.className = "error";

            return false;
        }


        // Price validation
        if (
            isNaN(price) ||
            price <= 0
        ) {

            validationMessage.textContent =
                `Please enter a valid positive price for Product ${i + 1}.`;

            validationMessage.className = "error";

            return false;
        }


        // Quantity validation
        if (
            isNaN(quantity) ||
            quantity <= 0
        ) {

            validationMessage.textContent =
                `Please enter a valid positive quantity for Product ${i + 1}.`;

            validationMessage.className = "error";

            return false;
        }
    }


    validationMessage.textContent =
        "All inputs are valid!";

    validationMessage.className = "success";

    return true;
}


// ==========================================
// CALCULATE ORDER
// ==========================================

function calculateOrder() {

    const orderSummary =
        document.querySelector("#orderSummary");


    // Stop if validation fails
    if (!validateInputs()) {

        orderSummary.style.display = "none";

        return;
    }


    const customerName =
        document.querySelector("#customerName").value.trim();

    const productCount =
        parseInt(
            document.querySelector("#productCount").value
        );

    const deliveryOption =
        document.querySelector("#deliveryOption").value;


    let subtotal = 0;

    let productDetails = [];


    // ======================================
    // REQUIRED FOR LOOP
    // Process every product
    // ======================================

    for (let i = 0; i < productCount; i++) {

        const productName =
            document.querySelector(
                `#productName-${i}`
            ).value.trim();

        const price =
            parseFloat(
                document.querySelector(
                    `#productPrice-${i}`
                ).value
            );

        const quantity =
            parseInt(
                document.querySelector(
                    `#productQuantity-${i}`
                ).value
            );


        // Calculate item amount
        const amount =
            calculateItemAmount(
                price,
                quantity
            );


        // Add to subtotal
        subtotal += amount;


        // Save product details
        productDetails.push({
            name: productName,
            price: price,
            quantity: quantity,
            amount: amount
        });
    }


    // ======================================
    // CALCULATIONS
    // ======================================

    const discountAmount =
        calculateDiscount(subtotal);

    const deliveryFee =
        getDeliveryFee(deliveryOption);

    const finalAmount =
        subtotal -
        discountAmount +
        deliveryFee;


    // ======================================
    // BUILD ORDER SUMMARY
    // ======================================

    let summaryHTML = "";

    summaryHTML += `
        <h2>Order Summary</h2>

        <div class="summary-customer">
            <strong>Customer:</strong>
            ${customerName}
        </div>
    `;


    // Display products
    for (let i = 0; i < productDetails.length; i++) {

        const item =
            productDetails[i];

        summaryHTML += `

            <div class="product-item">

                <div>
                    <span class="item-num">
                        ${i + 1}.
                    </span>

                    <span class="item-name">
                        ${item.name}
                    </span>
                </div>

                <div class="item-details">

                    Price:
                    ${formatPeso(item.price)}

                    &nbsp; | &nbsp;

                    Qty:
                    ${item.quantity}

                    <br>

                    <span class="item-amount">
                        Amount:
                        ${formatPeso(item.amount)}
                    </span>

                </div>

            </div>
        `;
    }


    // Display totals
    summaryHTML += `

        <div class="summary-totals">

            <div class="summary-row">
                <span>Subtotal:</span>
                <span>
                    ${formatPeso(subtotal)}
                </span>
            </div>


            <div class="summary-row discount">
                <span>Discount Rate:</span>
                <span>
                    ${getDiscountRateLabel(subtotal)}
                </span>
            </div>


            <div class="summary-row discount">
                <span>Discount Amount:</span>
                <span>
                    -${formatPeso(discountAmount)}
                </span>
            </div>


            <div class="summary-row">
                <span>Delivery Type:</span>
                <span>
                    ${getDeliveryTypeLabel(deliveryOption)}
                </span>
            </div>


            <div class="summary-row">
                <span>Delivery Fee:</span>
                <span>
                    ${formatPeso(deliveryFee)}
                </span>
            </div>


            <div class="summary-row total">
                <span>Final Amount:</span>

                <span>
                    ${formatPeso(finalAmount)}
                </span>
            </div>

        </div>
    `;


    // Show result
    orderSummary.innerHTML =
        summaryHTML;

    orderSummary.style.display =
        "block";


    // ======================================
    // DEBUGGING OUTPUT
    // ======================================

    console.log("=== Checkout Debug ===");
    console.log("Customer:", customerName);
    console.log("Subtotal:", subtotal);
    console.log("Discount Rate:", getDiscountRateLabel(subtotal));
    console.log("Discount Amount:", discountAmount);
    console.log("Delivery Type:", getDeliveryTypeLabel(deliveryOption));
    console.log("Delivery Fee:", deliveryFee);
    console.log("Final Amount:", finalAmount);
}


// ==========================================
// EVENT LISTENERS
// ==========================================

// Generate product fields when product count changes
document
    .querySelector("#productCount")
    .addEventListener(
        "input",
        generateProductInputs
    );


// Calculate order when button is clicked
document
    .querySelector("#calculateBtn")
    .addEventListener(
        "click",
        calculateOrder
    );
