AOS.init({
    duration: 1000, 
    once: true,     
});

// --- Unified Cart Logic ---

    // Generic Page Functions
    document.addEventListener('DOMContentLoaded', function() {
        // Search Box Toggle
        const searchBtn = document.getElementById("searchBtn");
        const searchBox = document.getElementById("searchBox");
        if(searchBtn) {
            searchBtn.addEventListener("click", (e) => {
                e.preventDefault();
                searchBox.classList.toggle("d-none");
            });
        }
        
        // Modal Functions
        window.openModal = function() {
            document.getElementById("policyModal").style.display = "flex";
        }
        window.closeModal = function() {
            document.getElementById("policyModal").style.display = "none";
        }
        window.onclick = function(event) {
            const modal = document.getElementById("policyModal");
            if (event.target === modal) {
                closeModal();
            }
        }

        // --- Cart Initialization ---
        const cartIcon = document.getElementById('cartIcon');
        const cartSidebar = document.getElementById('cartSidebar');
        const closeCartBtn = document.getElementById('closeCartBtn');
        
        if (cartIcon) {
            cartIcon.onclick = (e) => {
                e.preventDefault();
                cartSidebar.classList.add('open');
                updateCartView();
            };
        }

        if (closeCartBtn) {
            closeCartBtn.onclick = () => {
                cartSidebar.classList.remove('open');
            };
        }
        
        // Responsive Navbar Icon Listeners
        const cartIconCollapse = document.getElementById('cartIconCollapse');
        if (cartIconCollapse) {
            cartIconCollapse.addEventListener('click', function(e) {
                e.preventDefault();
                cartSidebar.classList.add('open');
                updateCartView();
                const navbarCollapse = document.getElementById('mainNavbar');
                if (navbarCollapse && window.bootstrap) {
                    bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
                }
            });
        }
        
        const searchBtnCollapse = document.getElementById('searchBtnCollapse');
        if (searchBtnCollapse) {
            searchBtnCollapse.addEventListener('click', function(e) {
                e.preventDefault();
                searchBox.classList.toggle('d-none');
                const navbarCollapse = document.getElementById('mainNavbar');
                if (navbarCollapse && window.bootstrap) {
                    bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
                }
            });
        }
        
        // Close sidebar when clicking outside
        document.addEventListener('mousedown', function(e) {
            if (cartSidebar && cartSidebar.classList.contains('open')) {
              if (!cartSidebar.contains(e.target) && !e.target.closest('#cartIcon') && !e.target.closest('#cartIconCollapse')) {
                cartSidebar.classList.remove('open');
              }
            }
            // Close searchbox when clicking outside
            if (searchBox && !searchBox.classList.contains('d-none')) {
                if (!searchBox.contains(e.target) && !e.target.closest('#searchBtn') && !e.target.closest('#searchBtnCollapse')) {
                    searchBox.classList.add('d-none');
                }
            }
        });
    });

    // --- Cart Management Functions ---

    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = cart.find(item => item.name === product.name);
        if (existing) {
            existing.qty += product.qty;
        } else {
            cart.push(product);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartView();
    }

    function updateCartView() {
        const products = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyMessage = document.getElementById('emptyMessage');
        const cartFooter = document.querySelector('.cart-footer');
        
        if (!cartItemsContainer || !emptyMessage || !cartFooter) return;

        cartItemsContainer.innerHTML = '';

        if (products.length > 0) {
            emptyMessage.style.display = 'none';
            cartFooter.style.display = 'block';
            let total = 0;

            products.forEach((p, idx) => {
                total += p.price * p.qty;
                const item = document.createElement('div');
                item.className = 'cart-item';
                item.innerHTML = `
                    <img src="${p.image}" alt="${p.name}">
                    <div class="item-details">
                        <strong>${p.name}</strong>
                        <span class="price">${p.price.toFixed(2)} ج.م</span>
                    </div>
                    <div class="item-controls me-3">
                        <button class="qty-btn decrease-qty" data-idx="${idx}">-</button>
                        <span class="qty-display">${p.qty}</span>
                        <button class="qty-btn increase-qty" data-idx="${idx}">+</button>
                    </div>
                    <button class="remove-item-btn remove-item ms-auto" data-idx="${idx}"><i class="fas fa-trash-alt"></i></button>
                `;
                cartItemsContainer.appendChild(item);
            });

            cartFooter.innerHTML = `
                <div class="cart-total">
                    <span>الإجمالي</span>
                    <span>${total.toFixed(2)} ج.م</span>
                </div>
                <a href="Payment.html" class="btn-payment">الذهاب إلى الدفع</a>
            `;
        } else {
            emptyMessage.style.display = 'flex';
            cartFooter.style.display = 'none';
        }
        bindCartEvents();
    }

    function bindCartEvents() {
        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.onclick = function() {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart[btn.dataset.idx].qty++;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartView();
            };
        });
        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.onclick = function() {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                if (cart[btn.dataset.idx].qty > 1) {
                    cart[btn.dataset.idx].qty--;
                } else {
                    cart.splice(btn.dataset.idx, 1);
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartView();
            };
        });
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.onclick = function() {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart.splice(btn.dataset.idx, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartView();
            };
        });
    }
    
    function returnToShop(event) {
        if(event) event.preventDefault();
        window.location.href = 'product.html'; 
    }
