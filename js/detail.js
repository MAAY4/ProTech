        // --- Unified Cart & UI Logic ---
        document.addEventListener('DOMContentLoaded', function() {
            // Search Box Toggle
            const searchBtn = document.getElementById("searchBtn");
            const searchBox = document.getElementById("searchBox");
            if (searchBtn) {
                searchBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    searchBox.classList.toggle("d-none");
                });
            }

            // Cart Initialization
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

            // Close UI elements on outside click
            document.addEventListener('mousedown', function(e) {
                if (cartSidebar && cartSidebar.classList.contains('open')) {
                    if (!cartSidebar.contains(e.target) && !e.target.closest('#cartIcon') && !e.target.closest('#cartIconCollapse')) {
                        cartSidebar.classList.remove('open');
                    }
                }
                if (searchBox && !searchBox.classList.contains('d-none')) {
                    if (!searchBox.contains(e.target) && !e.target.closest('#searchBtn') && !e.target.closest('#searchBtnCollapse')) {
                        searchBox.classList.add('d-none');
                    }
                }
            });

            // "Add to Cart" button on this page
            const addToCartBtn = document.getElementById('addToCartBtn');
            if(addToCartBtn) {
                addToCartBtn.addEventListener('click', () => {
                    const product = {
                        name: document.getElementById('productName').textContent,
                        price: parseFloat(document.getElementById('productPrice').textContent),
                        image: document.getElementById('mainProductImage').src,
                        qty: parseInt(document.getElementById('quantity').textContent)
                    };
                    addToCart(product);
                    cartSidebar.classList.add('open');
                });
            }

            // "Buy Now" button logic
            const buyNowBtn = document.getElementById('buyNowBtn');
            if(buyNowBtn) {
                buyNowBtn.addEventListener('click', () => {
                    const product = {
                        name: document.getElementById('productName').textContent,
                        price: parseFloat(document.getElementById('productPrice').textContent),
                        image: document.getElementById('mainProductImage').src,
                        qty: parseInt(document.getElementById('quantity').textContent)
                    };
                    addToCart(product);
                    window.location.href = 'Payment.html';
                });
            }
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
                    item.innerHTML = `<img src="${p.image}" alt="${p.name}"><div class="item-details"><strong>${p.name}</strong><span class="price">${p.price.toFixed(2)} ج.م</span></div><div class="item-controls me-3"><button class="qty-btn decrease-qty" data-idx="${idx}">-</button><span class="qty-display">${p.qty}</span><button class="qty-btn increase-qty" data-idx="${idx}">+</button></div><button class="remove-item-btn remove-item ms-auto" data-idx="${idx}"><i class="fas fa-trash-alt"></i></button>`;
                    cartItemsContainer.appendChild(item);
                });
                cartFooter.innerHTML = `<div class="cart-total"><span>الإجمالي</span><span>${total.toFixed(2)} ج.م</span></div><a href="Payment.html" class="btn-payment">الذهاب إلى الدفع</a>`;
            } else {
                emptyMessage.style.display = 'flex';
                cartFooter.style.display = 'none';
            }
            bindCartEvents();
        }

        function bindCartEvents() {
            document.querySelectorAll('.increase-qty').forEach(btn => btn.onclick = () => updateItemQty(btn.dataset.idx, 1));
            document.querySelectorAll('.decrease-qty').forEach(btn => btn.onclick = () => updateItemQty(btn.dataset.idx, -1));
            document.querySelectorAll('.remove-item').forEach(btn => btn.onclick = () => updateItemQty(btn.dataset.idx, 0));
        }

        function updateItemQty(index, change) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (change === 0 || (cart[index].qty + change) <= 0) {
                cart.splice(index, 1);
            } else {
                cart[index].qty += change;
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartView();
        }

        // --- Page-Specific Functions ---
        function changeImage(src) {
            document.getElementById('mainProductImage').src = src;
            document.querySelectorAll('.thumbnail-images img').forEach(img => img.classList.remove('active'));
            event.target.classList.add('active');
        }

        function increase() {
            let quantity = document.getElementById("quantity");
            quantity.innerText = parseInt(quantity.innerText) + 1;
        }

        function decrease() {
            let quantity = document.getElementById("quantity");
            if (parseInt(quantity.innerText) > 1) {
                quantity.innerText = parseInt(quantity.innerText) - 1;
        }
        }

        // سحب السلايدر بالماوس أو اللمس
        function enableSliderDrag(sliderSelector) {
          document.querySelectorAll(sliderSelector).forEach(slider => {
            let isDown = false;
            let startX;
            let scrollLeft;
            slider.addEventListener('mousedown', (e) => {
              isDown = true;
              slider.classList.add('dragging');
              startX = e.pageX - slider.offsetLeft;
              scrollLeft = slider.scrollLeft;
            });
            slider.addEventListener('mouseleave', () => {
              isDown = false;
              slider.classList.remove('dragging');
            });
            slider.addEventListener('mouseup', () => {
              isDown = false;
              slider.classList.remove('dragging');
            });
            slider.addEventListener('mousemove', (e) => {
              if (!isDown) return;
              e.preventDefault();
              const x = e.pageX - slider.offsetLeft;
              const walk = (x - startX) * 2;
              slider.scrollLeft = scrollLeft - walk;
            });
            // دعم اللمس
            slider.addEventListener('touchstart', (e) => {
              isDown = true;
              startX = e.touches[0].pageX - slider.offsetLeft;
              scrollLeft = slider.scrollLeft;
            });
            slider.addEventListener('touchend', () => {
              isDown = false;
            });
            slider.addEventListener('touchmove', (e) => {
              if (!isDown) return;
              const x = e.touches[0].pageX - slider.offsetLeft;
              const walk = (x - startX) * 2;
              slider.scrollLeft = scrollLeft - walk;
            });
          });
        }
        document.addEventListener('DOMContentLoaded', function() {
          enableSliderDrag('.products-slider');
        });