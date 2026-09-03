// ==========================================
// REQUIRED FUNCTIONS
// ==========================================

// Calculate the amount for one product
function calculateItemAmount(price, quantity) {
    return Number(price) * Number(quantity);
}


// Calculate the discount based on subtotal
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


// Determine delivery fee using switch
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
// GENERATE PRODUCT INPUTS
// ==========================================

function generateProductInputs() {

    const productCount =
        Number(document.getElementById("productCount").value);

    const productsContainer =
        document.getElementById("productsContainer");

    productsContainer.innerHTML = "";


    if (!Number.isInteger(productCount) || productCount <= 0) {
        return;
    }


    // Required for loop
    for (let i = 0; i < productCount; i++) {

        const productDiv =
            document.createElement("div");


        productDiv.innerHTML = `

            <h3>Product ${i + 1}</h3>

            <label for="productName-${i}">
                Product Name
            </label>

            <input
                type="text"
                id="productName-${i}"
                placeholder="Product Name"
            >

            <br><br>

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

            <br><br>

            <label for="productQuantity-${i}">
                Quantity
            </label>

            <input
                type="number"
                id="productQuantity-${i}"
                placeholder="1"
                min="1"
            >

            <br><br>
        `;


        productsContainer.appendChild(productDiv);
    }
}


// ==========================================
// VALIDATE INPUTS
// ==========================================

function validateInputs() {

    const customerName =
        document.getElementById("customerName").value.trim();

    const productCount =
        Number(document.getElementById("productCount").value);

    const validationMessage =
        document.getElementById("validationMessage");


    // Customer name validation
    if (customerName === "") {

        validationMessage.textContent =
            "Please enter the customer name.";

        return false;
    }


    // Product count validation
    if (!Number.isInteger(productCount) || productCount <= 0) {

        validationMessage.textContent =
            "Please enter a valid positive number of products.";

        return false;
    }


    // Validate each product
    for (let i = 0; i < productCount; i++) {

        const productName =
            document.getElementById(`productName-${i}`);

        const productPrice =
            document.getElementById(`productPrice-${i}`);

        const productQuantity =
            document.getElementById(`productQuantity-${i}`);


        if (!productName || !productPrice || !productQuantity) {

            validationMessage.textContent =
                `Product ${i + 1} fields are missing.`;

            return false;
        }


        const name =
            productName.value.trim();

        const price =
            Number(productPrice.value);

        const quantity =
            Number(productQuantity.value);


        // Product name
        if (name === "") {

            validationMessage.textContent =
                `Please enter the name of Product ${i + 1}.`;

            return false;
        }


        // Product price
        if (!Number.isFinite(price) || price <= 0) {

            validationMessage.textContent =
                `Please enter a valid positive price for Product ${i + 1}.`;

            return false;
        }


        // Product quantity
        if (!Number.isInteger(quantity) || quantity <= 0) {

            validationMessage.textContent =
                `Please enter a valid positive quantity for Product ${i + 1}.`;

            return false;
        }
    }


    validationMessage.textContent =
        "All inputs are valid.";

    return true;
}


// ==========================================
// CALCULATE ORDER
// ==========================================

function calculateOrder() {

    const validationMessage =
        document.getElementById("validationMessage");

    const orderSummary =
        document.getElementById("orderSummary");


    // Validate first
    if (!validateInputs()) {

        orderSummary.innerHTML = "";

        return;
    }


    const customerName =
        document.getElementById("customerName").value.trim();

    const productCount =
        Number(document.getElementById("productCount").value);

    const deliveryOption =
        document.getElementById("deliveryOption").value;


    // Accumulator
    let subtotal = 0;

    let products = [];


    // ======================================
    // REQUIRED FOR LOOP
    // ======================================

    for (let i = 0; i < productCount; i++) {

        const productName =
            document.getElementById(
                `productName-${i}`
            ).value.trim();

        const price =
            Number(
                document.getElementById(
                    `productPrice-${i}`
                ).value
            );

        const quantity =
            Number(
                document.getElementById(
                    `productQuantity-${i}`
                ).value
            );


        // Calculate item amount
        const itemAmount =
            calculateItemAmount(
                price,
                quantity
            );


        // Add to subtotal
        subtotal += itemAmount;


        // Save product details
        products.push({
            name: productName,
            price: price,
            quantity: quantity,
            amount: itemAmount
        });
    }


    // ======================================
    // DISCOUNT
    // ======================================

    const discount =
        calculateDiscount(subtotal);


    // ======================================
    // DELIVERY
    // ======================================

    const deliveryFee =
        getDeliveryFee(deliveryOption);


    // ======================================
    // FINAL AMOUNT
    // ======================================

    const finalAmount =
        subtotal - discount + deliveryFee;


    // ======================================
    // DISCOUNT RATE FOR DISPLAY
    // ======================================

    let discountRate = "";

    if (subtotal >= 5000) {
        discountRate = "10%";

    } else if (subtotal >= 3000) {
        discountRate = "7%";

    } else if (subtotal >= 1000) {
        discountRate = "5%";

    } else {
        discountRate = "No discount";
    }


    // ======================================
    // DELIVERY TYPE FOR DISPLAY
    // ======================================

    let deliveryType = "";

    switch (Number(deliveryOption)) {

        case 1:
            deliveryType = "Store Pickup";
            break;

        case 2:
            deliveryType = "Standard Delivery";
            break;

        case 3:
            deliveryType = "Express Delivery";
            break;

        default:
            deliveryType = "Unknown";
    }


    // ======================================
    // BUILD ORDER SUMMARY
    // ======================================

    let output = `

        <h2>MINI STORE CHECKOUT SYSTEM</h2>

        <p>
            Customer: ${customerName}
        </p>

    `;


    // Display products
    for (let i = 0; i < products.length; i++) {

        output += `

            <p>
                ${i + 1}. ${products[i].name}
                <br>

                Price: ₱${products[i].price.toFixed(2)}
                <br>

                Quantity: ${products[i].quantity}
                <br>

                Amount: ₱${products[i].amount.toFixed(2)}
            </p>

        `;
    }


    // Display totals
    output += `

        <h3>ORDER SUMMARY</h3>

        <p>
            Subtotal: ₱${subtotal.toFixed(2)}
        </p>

        <p>
            Discount Rate: ${discountRate}
        </p>

        <p>
            Discount Amount: ₱${discount.toFixed(2)}
        </p>

        <p>
            Delivery Type: ${deliveryType}
        </p>

        <p>
            Delivery Fee: ₱${deliveryFee.toFixed(2)}
        </p>

        <p>
            Final Amount: ₱${finalAmount.toFixed(2)}
        </p>

    `;


    // Display the summary
    orderSummary.innerHTML = output;


    // Optional debugging
    console.log("Customer:", customerName);
    console.log("Subtotal:", subtotal);
    console.log("Discount:", discount);
    console.log("Delivery Fee:", deliveryFee);
    console.log("Final Amount:", finalAmount);
}


// ==========================================
// EVENT LISTENERS
// ==========================================

// Generate products when product count changes
document
    .getElementById("productCount")
    .addEventListener(
        "input",
        generateProductInputs
    );


// Calculate order
document
    .getElementById("calculateBtn")
    .addEventListener(
        "click",
        calculateOrder
    );
