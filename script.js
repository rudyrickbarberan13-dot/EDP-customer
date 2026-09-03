// Calculate the amount for one product
function calculateItemAmount(price, quantity) {
    return price * quantity;
}


// Calculate discount based on subtotal
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


// Determine delivery fee using a switch statement
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


// Generate product input fields
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

        const productDiv = document.createElement("div");

        productDiv.innerHTML = `
            <h3>Product ${i + 1}</h3>

            <label for="productName-${i}">Product Name</label>
            <input
                type="text"
                id="productName-${i}"
                placeholder="Product Name"
            >

            <br>

            <label for="productPrice-${i}">Price</label>
            <input
                type="number"
                id="productPrice-${i}"
                placeholder="0.00"
                min="0"
                step="0.01"
            >

            <br>

            <label for="productQuantity-${i}">Quantity</label>
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


// Validate all required inputs
function validateInputs() {

    const customerName =
        document.getElementById("customerName").value.trim();

    const productCount =
        Number(document.getElementById("productCount").value);

    const validationMessage =
        document.getElementById("validationMessage");


    // Validate customer name
    if (customerName === "") {

        validationMessage.textContent =
            "Please enter the customer name.";

        return false;
    }


    // Validate product count
    if (!Number.isInteger(productCount) || productCount <= 0) {

        validationMessage.textContent =
            "Please enter a valid positive number of products.";

        return false;
    }


    // Validate every product
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


        if (name === "") {

            validationMessage.textContent =
                `Please enter the name of Product ${i + 1}.`;

            return false;
        }


        if (!Number.isFinite(price) || price <= 0) {

            validationMessage.textContent =
                `Please enter a valid positive price for Product ${i + 1}.`;

            return false;
        }


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


// Calculate and display the complete order
function calculateOrder() {

    const validationMessage =
        document.getElementById("validationMessage");

    const orderSummary =
        document.getElementById("orderSummary");


    // Validate inputs first
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


    let subtotal = 0;

    let products = [];


    // Required for loop for product processing
    for (let i = 0; i < productCount; i++) {

        const productName =
            document.getElementById(`productName-${i}`).value.trim();

        const price =
            Number(document.getElementById(`productPrice-${i}`).value);

        const quantity =
            Number(document.getElementById(`productQuantity-${i}`).value);


        // Calculate item amount
        const itemAmount =
            calculateItemAmount(price, quantity);


        // Add item amount to subtotal
        subtotal += itemAmount;


        // Store product information
        products.push({
            name: productName,
            price: price,
            quantity: quantity,
            amount: itemAmount
        });
    }


    // Calculate discount
    const discount =
        calculateDiscount(subtotal);


    // Calculate delivery fee
    const deliveryFee =
        getDeliveryFee(deliveryOption);


    // Calculate final amount
    const finalAmount =
        subtotal - discount + deliveryFee;


    // Determine discount rate for display
    let discountRate;

    if (subtotal >= 5000) {
        discountRate = "10%";
    } else if (subtotal >= 3000) {
        discountRate = "7%";
    } else if (subtotal >= 1000) {
        discountRate = "5%";
    } else {
        discountRate = "0%";
    }


    // Determine delivery type for display
    let deliveryType;

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


    // Start order summary
    let output = `
        <h2>ORDER SUMMARY</h2>

        <p><strong>Customer:</strong> ${customerName}</p>
    `;


    // Display every product
    for (let i = 0; i < products.length; i++) {

        output += `
            <div>
                <p>
                    <strong>${i + 1}. ${products[i].name}</strong>
                </p>

                <p>
                    Price: ₱${products[i].price.toFixed(2)}<br>
                    Quantity: ${products[i].quantity}<br>
                    Amount: ₱${products[i].amount.toFixed(2)}
                </p>
            </div>
        `;
    }


    // Display order totals
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
            <strong>
                Final Amount: ₱${finalAmount.toFixed(2)}
            </strong>
        </p>
    `;


    // Display complete order summary
    orderSummary.innerHTML = output;


    // Optional debugging output
    console.log("Customer:", customerName);
    console.log("Subtotal:", subtotal);
    console.log("Discount:", discount);
    console.log("Delivery Fee:", deliveryFee);
    console.log("Final Amount:", finalAmount);
}


// Generate product fields when product count changes
document
    .getElementById("productCount")
    .addEventListener("input", generateProductInputs);


// Calculate order when Calculate Order is clicked
document
    .getElementById("calculateBtn")
    .addEventListener("click", calculateOrder);
