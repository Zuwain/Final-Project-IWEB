document.addEventListener('DOMContentLoaded', function() {
    const cart = [];
    const cartToggle = document.getElementById('cart-toggle');
    const sidebarCart = document.getElementById('sidebar-cart');
    const closeCart = document.getElementById('close-cart');
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    const cartCount = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    const orderForm = document.getElementById('order-form');
    const userName = document.getElementById('user-name');
    const userNumber = document.getElementById('user-number');
    const userAddress = document.getElementById('user-address');
    const specialOffers = {
        '50OFF': { type: 'percent', discount: 0.5 },
        'TRIPLECOMBO': { type: 'percent', discount: 0.4 },
        'PIZZA2DRINK': { type: 'freeItem', item: 'Drink', requiredItems: ['Pizza', 'Pizza'] }
    };

    // Modify the handleCheckout function
    function handleCheckout() {

        
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items before checking out.');
            return;
        }

        // Check if user details are filled
        if (!userName.value || !userNumber.value || !userAddress.value) {
            alert('Please fill in your name, number, and address before checking out.');
            return;
        }

        let orderSummary = 'Order Summary:\n\n';
        let total = 0;
    
        cart.forEach((item, index) => {
            orderSummary += `${index + 1}. ${item.name} - $${item.price.toFixed(2)}`;
            if (item.originalPrice > item.price) {
                orderSummary += ` (Original: $${item.originalPrice.toFixed(2)})`;
            }
            orderSummary += '\n';
            total += item.price;
        });
    
        orderSummary += `\nTotal: $${total.toFixed(2)}`;

        // Add user details to order summary
        orderSummary += `\n\nDelivery Details:`;
        orderSummary += `\nName: ${userName.value}`;
        orderSummary += `\nPhone: ${userNumber.value}`;
        orderSummary += `\nAddress: ${userAddress.value}`;

        // Get the delivery message
        const deliveryMessage = document.getElementById('delivery-message').value;
        if (deliveryMessage) {
            orderSummary += `\n\nDelivery Message: ${deliveryMessage}`;
        }

        alert(orderSummary);

        // Clear the cart, delivery message, and user details
        cart.length = 0;
        document.getElementById('delivery-message').value = '';
        userName.value = '';
        userNumber.value = '';
        userAddress.value = '';
        updateCart();

        // Close the sidebar cart
        sidebarCart.classList.remove('open');
    }

    // Toggle cart sidebar
    cartToggle.addEventListener('click', () => {
        sidebarCart.classList.toggle('open');
    });

    closeCart.addEventListener('click', () => {
        sidebarCart.classList.remove('open');
    });




    function applyOffers() {
        let totalDiscount = 0.3; // 30% off on all items
    
        // Check for Triple Feast Combo 40% off
        let realItemsCount = cart.filter(item => item.fixedPrice !== 0).length;
        if (realItemsCount >= 3) {
            totalDiscount = Math.max(totalDiscount, 0.4); // Apply the larger discount
        }
    
        // Check for "Buy 2 Pizzas and Get a Free Drink" offer
        const pizzaCount = cart.filter(item => item.name.toLowerCase().includes('pizza')).length;
        if (pizzaCount >= 2 && !cart.some(item => item.name === 'Drink' && item.fixedPrice === 0)) {
            cart.push({ name: 'Drink', fixedPrice: 0, originalPrice: 3.50 }); // Assuming the original price of a drink is $3.50
        }
    
        // Apply discounts
        cart.forEach(item => {
            if (item.originalPrice === undefined) {
                item.originalPrice = item.price;
            }
            if (item.fixedPrice !== undefined) {
                item.price = item.fixedPrice
            } else {
                item.price = item.originalPrice * (1 - totalDiscount);
            }
        });
    
        updateCart();
    }

    function displayConfirmation(message) {
        const confirmation = document.createElement('div');
        confirmation.className = 'confirmation';
        confirmation.textContent = message;
        document.body.appendChild(confirmation);
        setTimeout(() => {
            confirmation.remove();
        }, 3000);
    }
    
    function addToCart(item) {
        cart.push(item);
        applyOffers();
        updateCart();
        displayConfirmation(`${item.name} added to cart!`);
    }

    // Add to cart functionality
    document.querySelectorAll('.menu_btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const card = button.closest('.menu_card');
            const item = {
                name: card.querySelector('h2').textContent,
                price: parseFloat(card.querySelector('.price').textContent.replace('$', ''))
            };
            addToCart(item);
        });
    });



    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item'); // Add a class for styling
            cartItem.innerHTML = `
                ${item.name} - $${item.price.toFixed(2)}
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
            
            // Add event listener for the remove button
            cartItem.querySelector('.remove-btn').addEventListener('click', () => {
                removeFromCart(index);
            });
    
            cartItems.appendChild(cartItem);
            total += item.price;
        });
        totalPrice.textContent = total.toFixed(2);
        cartCount.textContent = cart.length;
    }

    function removeFromCart(index) {
        cart.splice(index, 1); // Remove the item from the cart array
        updateCart(); // Update the cart display
        displayConfirmation(`Item removed from cart!`); // Optional: display a confirmation message
    }

    // Checkout functionality
    checkoutBtn.addEventListener('click', handleCheckout);

    // Handle order form submission
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(orderForm);
            const orderDetails = Object.fromEntries(formData.entries());

            // Include the delivery message in the alert
            setTimeout(() => {
                alert('Thank you for your order! Your food will be delivered soon.\n\nOrder details:\n' + 
                      JSON.stringify(orderDetails, null, 2));
                
                // Clear the form
                orderForm.reset();
            }, 1000);
        });
    }

    // Get all "Order Now" buttons
    const orderNowButtons = document.querySelectorAll('.menu_btn, .about_btn, .banner_btn, .offer_btn');

    // Add event listener to each button
    orderNowButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Scroll to the order now section
            document.querySelector('#order-now').scrollIntoView({ behavior: 'smooth' });
        });
    });
});
