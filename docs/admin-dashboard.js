// =================== Dashboard Item Start ===================
/**
 * تهيئة النظام
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigationSystem();
    initializeDashboard();
    initializeResponsive();
});

/**
 * نظام التنقل الرئيسي
 */
function initializeNavigationSystem() {
    const navLinks = document.querySelectorAll('.nav-links li');
    const sections = {
        dashboard: initializeDashboard,
        products: initializeProducts,
        orders: initializeOrders,
        notifications: initializeNotifications,
        users: initializeUsers
    };

    // إضافة مستمع لكل رابط في القائمة
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            
            if (!sectionId || !sections[sectionId]) return;

            // إزالة الحالة النشطة من جميع الروابط
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // إخفاء جميع الأقسام
            document.querySelectorAll('.content-section').forEach(section => {
                section.style.display = 'none';
                section.classList.remove('active');
            });

            // عرض القسم المطلوب مع تأثير انتقالي
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.style.opacity = '0';
                targetSection.style.display = 'block';
                targetSection.classList.add('active');

                // تأثير الظهور التدريجي
                setTimeout(() => {
                    targetSection.style.transition = 'opacity 0.3s ease';
                    targetSection.style.opacity = '1';
                }, 50);

                // تهيئة القسم المطلوب
                sections[sectionId]();
            }
        });
    });

    // تهيئة الصفحة الرئيسية عند التحميل
    const initialSection = window.location.hash.slice(1) || 'dashboard';
    const initialLink = document.querySelector(`[data-section="${initialSection}"]`);
    if (initialLink) {
        initialLink.click();
    }
}

/**
 * تهيئة الصفحة الرئيسية
 */
function initializeDashboard() {
    if (!document.getElementById('dashboard').classList.contains('active')) return;
    
    // تهيئة البطاقات الإحصائية
    initializeStatisticsCards();
    // تهيئة المنتجات الرائجة
    initializeTrendingProducts();
}

// دالة تهيئة البطاقات الإحصائية
function initializeStatisticsCards() {
    const stats = {
        sales: { value: '15,350', trend: '+15', type: 'currency' },
        orders: { value: '24', trend: '+8', type: 'number' },
        products: { value: '186', trend: '+12', type: 'number' },
        customers: { value: '38', trend: '+5', type: 'number' }
    };

    Object.entries(stats).forEach(([key, data]) => {
        const card = document.querySelector(`.stats-${key} .value`);
        if (!card) return;

        const formattedValue = data.type === 'currency' 
            ? `${data.value} ج.م` 
            : data.value;

        const trendIcon = parseInt(data.trend) >= 0 ? '▲' : '▼';
        const trendClass = parseInt(data.trend) >= 0 ? 'text-success' : 'text-danger';

        card.innerHTML = `
            ${formattedValue}
            <small class="${trendClass}">
                ${trendIcon} ${Math.abs(parseInt(data.trend))}%
            </small>
        `;
    });

    // تهيئة الرسم البياني
    initializeStatsChart();
}

let currentChart = null;

function initializeStatsChart() {
    const ctx = document.getElementById('statsChart');
    if (!ctx) return;
    
    if (currentChart) {
        currentChart.destroy();
    }

    const currentYear = 2025;
    const years = document.querySelector('.year-select');
    const months = document.querySelector('.month-select');

    // تحديث اختيارات السنين
    if (years) {
        years.innerHTML = '';
        const startYear = currentYear;
        const endYear = currentYear + 5;
        for (let year = startYear; year <= endYear; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            option.selected = year === currentYear;
            years.appendChild(option);
        }
    }

    // تهيئة البيانات الافتراضية
    const mockData = {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
        datasets: [
            {
                label: 'المبيعات',
                data: generateRandomData(12, 10000, 50000),
                borderColor: '#00AEEF',
                backgroundColor: 'rgba(0, 174, 239, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'الطلبات',
                data: generateRandomData(12, 50, 200),
                borderColor: '#FBB040',
                backgroundColor: 'rgba(251, 176, 64, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const config = {
        type: 'line',
        data: mockData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    rtl: true,
                    labels: {
                        font: { 
                            family: 'Cairo',
                            size: window.innerWidth < 768 ? 12 : 14
                        },
                        boxWidth: window.innerWidth < 768 ? 30 : 40,
                        padding: window.innerWidth < 768 ? 10 : 20
                    }
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    titleFont: {
                        family: 'Cairo',
                        size: window.innerWidth < 768 ? 12 : 14
                    },
                    bodyFont: {
                        family: 'Cairo',
                        size: window.innerWidth < 768 ? 11 : 13
                    },
                    padding: window.innerWidth < 768 ? 8 : 12,
                    rtl: true,
                    textDirection: 'rtl'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'right',
                    grace: '5%',
                    grid: { 
                        drawBorder: false,
                        display: window.innerWidth > 480
                    },
                    ticks: {
                        font: {
                            size: window.innerWidth < 768 ? 11 : 12
                        },
                        padding: window.innerWidth < 768 ? 5 : 8,
                        maxTicksLimit: window.innerWidth < 768 ? 6 : 8
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        font: {
                            size: window.innerWidth < 768 ? 10 : 12,
                            family: 'Cairo'
                        },
                        maxTicksLimit: window.innerWidth < 768 ? 6 : 12,
                        maxRotation: 45,
                        minRotation: 45,
                        autoSkip: false,
                        padding: window.innerWidth < 768 ? 5 : 8,
                        align: 'start',
                        maxTicksLimit: null // إزالة حد العلامات لإظهار كل الشهور
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 750
            }
        }
    };

    // إنشاء رسم بياني جديد وتخزينه في المتغير العالمي
    currentChart = new Chart(ctx, config);

    // تحديث مستمعي الأحداث
    years?.addEventListener('change', () => updateChartData(currentChart, years.value, months.value));
    months?.addEventListener('change', () => updateChartData(currentChart, years.value, months.value));

    // تحديث الرسم البياني عند تغيير حجم النافذة
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (currentChart) {
                // تحديث خيارات الرسم البياني بناءً على حجم الشاشة الجديد
                currentChart.options.plugins.legend.labels.font.size = window.innerWidth < 768 ? 12 : 14;
                currentChart.options.plugins.legend.labels.boxWidth = window.innerWidth < 768 ? 30 : 40;
                currentChart.options.plugins.legend.labels.padding = window.innerWidth < 768 ? 10 : 20;
                
                currentChart.options.scales.y.ticks.font.size = window.innerWidth < 768 ? 11 : 12;
                currentChart.options.scales.y.ticks.maxTicksLimit = window.innerWidth < 768 ? 6 : 8;
                currentChart.options.scales.y.grid.display = window.innerWidth > 480;
                
                currentChart.options.scales.x.ticks.font.size = window.innerWidth < 768 ? 11 : 12;
                currentChart.options.scales.x.ticks.maxRotation = window.innerWidth < 768 ? 45 : 0;
                currentChart.options.scales.x.ticks.maxTicksLimit = window.innerWidth < 768 ? 6 : 12;
                
                currentChart.update();
            }
        }, 250);
    });
}

function updateChartData(chart, year, month) {
    if (!chart) return;

    const monthsLabels = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    let labels, salesData, ordersData;

    if (month === 'all') {
        // عرض بيانات السنة كاملة
        labels = monthsLabels;
        salesData = generateRandomData(12, 10000, 50000);
        ordersData = generateRandomData(12, 50, 200);
    } else {
        // عرض بيانات الشهر المحدد
        const daysInMonth = new Date(year, parseInt(month) + 1, 0).getDate();
        labels = Array.from({length: daysInMonth}, (_, i) => `${i + 1}`);
        salesData = generateRandomData(daysInMonth, 300, 2000);
        ordersData = generateRandomData(daysInMonth, 1, 10);
    }

    chart.data.labels = labels;
    chart.data.datasets[0].data = salesData;
    chart.data.datasets[1].data = ordersData;
    chart.update();
}

function generateRandomData(count, min, max) {
    return Array.from({length: count}, () => 
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}
// =================== Dashboard Item End =====================


// =================== Trending Products Item Start ===================
function initializeTrendingProducts() {
    const trendingProducts = [
        {
            id: 1,
            name: 'مفك كهربائي احترافي',
            model: 'DR-2000',
            image: 'images/logo.png',
            category: 'معدات كهربائية',
            price: 1200,
            stock: 50,
            sales: 120,
            rank: 1
        },
        {
            id: 2,
            name: 'مثقاب بطارية لاسلكي',
            model: 'CDL-1800',
            image: 'images/logo.png',
            category: 'معدات كهربائية',
            price: 2500,
            stock: 35,
            sales: 95,
            rank: 2
        },
        {
            id: 3,
            name: 'طقم مفكات متنوعة',
            model: 'TS-450',
            image: 'images/logo.png',
            category: 'عدد يدوية',
            price: 850,
            stock: 75,
            sales: 85,
            rank: 3
        },
        {
            id: 4,
            name: 'شاكوش دوار ثقيل',
            model: 'HR-3000',
            image: 'images/logo.png',
            category: 'معدات ثقيلة',
            price: 3200,
            stock: 20,
            sales: 65,
            rank: 4
        }
    ];

    const container = document.querySelector('.products-slider');
    if (!container) return;

    container.innerHTML = '';
    trendingProducts.forEach(product => {
        const template = document.getElementById('productCardTemplate');
        if (!template) return;

        const clone = template.content.cloneNode(true);
        
        // تعبئة بيانات المنتج
        clone.querySelector('.rank').textContent = product.rank;
        clone.querySelector('.product-image img').src = product.image;
        clone.querySelector('.product-image img').alt = product.name;
        clone.querySelector('h5').textContent = product.name;
        clone.querySelector('.category').textContent = product.category;
        clone.querySelector('.sales-count').textContent = product.sales;
        clone.querySelector('.stock-count').textContent = product.stock;
        clone.querySelector('.price').textContent = `${product.price} جنيه`;

        container.appendChild(clone);
    });
}

// إضافة تأثير التمرير السلس للمنتجات
function initializeProductsScroll() {
    const slider = document.querySelector('.products-slider');
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
}
// =================== Trending Products Item End =====================


// =================== Products Item Start ===================
/**
 * نظام إدارة المنتجات
 */
function initializeProducts() {
    // تهيئة نموذج إضافة المنتج
    const addForm = document.getElementById('addProductForm');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAddProduct(this);
        });
    }

    // تحميل المنتجات الحالية
    loadProductsGrid();
}

function loadProductsGrid() {
    const productsContainer = document.querySelector('.products-table');
    if (!productsContainer) return;

    let productsGrid = productsContainer.querySelector('.products-grid');
    if (!productsGrid) {
        productsGrid = document.createElement('div');
        productsGrid.className = 'products-grid';
        productsContainer.appendChild(productsGrid);
    }

    productsGrid.innerHTML = '';
    
    // إضافة منتج كمثال إذا لم تكن هناك منتجات مخزنة
    let savedProducts = JSON.parse(sessionStorage.getItem('products') || '[]');
    if (savedProducts.length === 0) {
        // إضافة منتج تجريبي
        const demoProduct = {
            id: 1,
            name: 'مفك كهربائي احترافي',
            model: 'DR-2000',
            image: 'images/logo.png',
            category: 'معدات كهربائية',
            price: 1200,
            stock: 50,
            details: 'مفك كهربائي احترافي عالي الجودة',
            sales: 120
        };
        savedProducts = [demoProduct];
        sessionStorage.setItem('products', JSON.stringify(savedProducts));
    }

    // تصفية المنتجات غير الصالحة
    const validProducts = savedProducts.filter(product => 
        product.name && product.model && product.category && !isNaN(product.price) && !isNaN(product.stock)
    );

    validProducts.forEach(product => {
        const productCard = createProductCard(product);
        if (productCard) {
            productsGrid.appendChild(productCard);
        }
    });

    // تحديث البيانات المخزنة
    sessionStorage.setItem('products', JSON.stringify(validProducts));
}

function createProductCard(product) {
    if (!product || !product.name || !product.model || !product.category || isNaN(product.price) || isNaN(product.stock)) {
        console.error('Invalid product data:', product);
        return null;
    }

    const template = document.getElementById('productManagementCardTemplate');
    if (!template) {
        console.error('Product template not found');
        return null;
    }

    const card = template.content.cloneNode(true);
    const cardElement = card.querySelector('.product-management-card');

    // تعيين بيانات المنتج
    cardElement.dataset.productId = product.id;
    cardElement.querySelector('.product-image img').src = product.image;
    cardElement.querySelector('.product-image img').alt = product.name;
    cardElement.querySelector('h5').textContent = product.name;
    cardElement.querySelector('.model').textContent = `الطراز: ${product.model}`;
    cardElement.querySelector('.category').textContent = product.category;
    cardElement.querySelector('.details').textContent = product.details;
    cardElement.querySelector('.stock-count').textContent = product.stock;
    cardElement.querySelector('.price').textContent = `${product.price} جنيه`;

    const status = cardElement.querySelector('.status');
    status.textContent = product.stock > 0 ? 'متوفر' : 'غير متوفر';
    status.classList.add(product.stock > 0 ? 'available' : 'unavailable');

    // إضافة مستمعي الأحداث للأزرار
    cardElement.querySelector('.edit-product').addEventListener('click', () => editProduct(product.id));
    cardElement.querySelector('.delete-product').addEventListener('click', () => deleteProduct(product.id));

    return cardElement;
}

function addNewProductToGrid(productCard, productData) {
    let productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) {
        productsGrid = document.createElement('div');
        productsGrid.className = 'products-grid';
        document.querySelector('.products-table').appendChild(productsGrid);
    }

    // إضافة البطاقة الجديدة فقط
    productCard.style.opacity = '0';
    productCard.style.transform = 'translateY(20px)';
    productsGrid.appendChild(productCard);

    
    const savedProducts = JSON.parse(sessionStorage.getItem('products') || '[]');
    savedProducts.push(productData);
    sessionStorage.setItem('products', JSON.stringify(savedProducts));

    // تفعيل التأثير الحركي
    requestAnimationFrame(() => {
        productCard.style.transition = 'all 0.5s ease';
        productCard.style.opacity = '1';
        productCard.style.transform = 'translateY(0)';
    });

    showSuccessRibbon(productCard);
    showToast('success', 'تم إضافة المنتج بنجاح');
}

function deleteProduct(productId) {
    const productCard = document.querySelector(`.product-management-card[data-product-id="${productId}"]`);
    if (!productCard) return;

    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        // حذف المنتج من sessionStorage أولاً
        const savedProducts = JSON.parse(sessionStorage.getItem('products') || '[]');
        const updatedProducts = savedProducts.filter(p => p.id.toString() !== productId.toString());
        sessionStorage.setItem('products', JSON.stringify(updatedProducts));

        // إضافة تأثير حركي للحذف
        productCard.style.transition = 'all 0.5s ease';
        productCard.style.transform = 'scale(0.8)';
        productCard.style.opacity = '0';
        
        setTimeout(() => {
            productCard.remove();
            showToast('success', 'تم حذف المنتج بنجاح');
        }, 500);
    }
}

function updateProductInGridCustom(product, modalEl, form) {
    const productCard = document.querySelector(`.product-management-card[data-product-id="${product.id}"]`);
    if (!productCard) return;

    // تحديث عرض البطاقة
    productCard.querySelector('.product-image img').src = product.image;
    productCard.querySelector('.product-image img').alt = product.name;
    productCard.querySelector('h5').textContent = product.name;
    productCard.querySelector('.model').textContent = `الطراز: ${product.model}`;
    productCard.querySelector('.category').textContent = product.category;
    productCard.querySelector('.details').textContent = product.details;
    productCard.querySelector('.stock-count').textContent = product.stock;
    productCard.querySelector('.price').textContent = `${product.price} جنيه`;

    // تحديث حالة المنتج
    const status = productCard.querySelector('.status');
    const isAvailable = product.stock > 0;
    status.textContent = isAvailable ? 'متوفر' : 'غير متوفر';
    status.className = `status ${isAvailable ? 'available' : 'unavailable'}`;

    // تحديث المنتج في sessionStorage
    const savedProducts = JSON.parse(sessionStorage.getItem('products') || '[]');
    const productIndex = savedProducts.findIndex(p => p.id.toString() === product.id.toString());
    if (productIndex !== -1) {
        savedProducts[productIndex] = product;
        sessionStorage.setItem('products', JSON.stringify(savedProducts));
    }

    // إغلاق المودال
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) {
        modal.hide();
        if (form) form.reset();
    }

    // تأثير حركي وإظهار رسائل النجاح
    productCard.style.opacity = '0.5';
    productCard.style.transform = 'scale(0.98)';
    requestAnimationFrame(() => {
        productCard.style.transition = 'all 0.5s ease';
        productCard.style.opacity = '1';
        productCard.style.transform = 'scale(1)';
        
        // إضافة شريط النجاح
        showSuccessRibbon(productCard);
    });

    // إظهار رسالة نجاح
    showToast('success', 'تم تحديث المنتج بنجاح');
}

/**
 * تعديل المنتج
 */
function editProduct(productId) {
    const productCard = document.querySelector(`.product-management-card[data-product-id="${productId}"]`);
    if (!productCard) {
        console.error('Product card not found');
        return;
    }

    // إزالة أي تعديل سابق (لو حصل خطأ أو لم يُغلق)
    document.querySelectorAll('.modal.edit-product-modal').forEach(m => m.remove());

    const template = document.getElementById('editProductModal');
    if (!template) {
        console.error('Edit modal template not found');
        return;
    }

    // إنشاء نسخة جديدة
    const uniqueId = `editProductModal_${Date.now()}`;
    const modalEl = document.createElement('div');
    modalEl.className = 'modal fade edit-product-modal';
    modalEl.id = uniqueId;
    modalEl.innerHTML = template.innerHTML;
    document.body.appendChild(modalEl);

    // الحصول على النموذج وزر الحفظ
    const form = modalEl.querySelector('form');
    const saveBtn = modalEl.querySelector('.save-edit-btn');
    if (!form || !saveBtn) return;

    // وزر الحفظ
    const formId = `editProductForm_${Date.now()}`;
    form.id = formId;
    saveBtn.setAttribute('form', formId);

    // تعبئة البيانات
    form.querySelector('[name="productId"]').value = productId;
    form.querySelector('[name="name"]').value = productCard.querySelector('h5').textContent;
    form.querySelector('[name="model"]').value = productCard.querySelector('.model').textContent.replace('الطراز: ', '');
    form.querySelector('[name="category"]').value = productCard.querySelector('.category').textContent;
    form.querySelector('[name="details"]').value = productCard.querySelector('.details').textContent;
    form.querySelector('[name="price"]').value = productCard.querySelector('.price').textContent.replace(' جنيه', '');
    form.querySelector('[name="stock"]').value = productCard.querySelector('.stock-count').textContent;
    const currentImage = modalEl.querySelector('#currentProductImage');
    if (currentImage) {
        currentImage.src = productCard.querySelector('.product-image img').src;
    }

    // منع إعادة التحميل الافتراضي
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (form.checkValidity()) {
            handleEditSubmitCustom(e, modalEl, form);
        }
        form.classList.add('was-validated');
    });

    // زر الحفظ
    saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        form.requestSubmit();
    });

    // عرض المودال
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    // تنظيف عند الإغلاق
    modalEl.addEventListener('hidden.bs.modal', () => {
        modalEl.remove();
    });
}


function handleEditSubmitCustom(e, modalEl, form) {
    const formData = new FormData(form);
    const productId = formData.get('productId');
    const updatedProduct = {
        id: productId,
        name: formData.get('name'),
        model: formData.get('model'),
        category: formData.get('category'),
        details: formData.get('details'),
        price: parseFloat(formData.get('price')),
        stock: parseInt(formData.get('stock'))
    };

    const imageFile = formData.get('image');
    if (imageFile?.size > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            updatedProduct.image = e.target.result;
            updateProductInGridCustom(updatedProduct, modalEl, form);
        };
        reader.readAsDataURL(imageFile);
    } else {
        const currentImage = document.querySelector(`[data-product-id="${productId}"] .product-image img`);
        updatedProduct.image = currentImage.src;
        updateProductInGridCustom(updatedProduct, modalEl, form);
    }
}

/**
 * معالجة إضافة منتج جديد
 */
function handleAddProduct(form) {
    const formData = new FormData(form);

    // إنشاء كائن المنتج
    const newProduct = {
        id: Date.now(),
        name: formData.get('name')?.trim(),
        model: formData.get('model')?.trim(),
        category: formData.get('category')?.trim(),
        details: formData.get('details')?.trim(),
        price: parseFloat(formData.get('price')),
        stock: parseInt(formData.get('stock')),
    };



    // معالجة الصورة
    const imageFile = formData.get('image');
    if (imageFile?.size > 0) {
        const reader = new FileReader();
        reader.onload = function (e) {
            newProduct.image = e.target.result;
            const productCard = createProductCard(newProduct);
            if (productCard) {
                addNewProductToGrid(productCard, newProduct);
            }
        };
        reader.readAsDataURL(imageFile);
    } else {
        newProduct.image = 'images/default-product.jpg';
        const productCard = createProductCard(newProduct);
        if (productCard) {
            addNewProductToGrid(productCard, newProduct);
        }
    }


    const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
    if (modal) {
        modal.hide();
        form.reset();
    }

    showToast('success', 'تم إضافة المنتج بنجاح');
}

// =================== Products Item End =====================


// =================== Orders Item Start ===================
/**
 * صفحة الطلبات
 */
function initializeOrders() {
    if (!document.getElementById('orders').classList.contains('active')) return;


    loadOrdersTable();
}

function loadOrdersTable() {
    const container = document.querySelector('.orders-table');
    if (!container) return;

    //مثال للطلبات
    const orders = [
        {
            id: "ORD-001",
            customerName: "أحمد محمد",
            phone: "0123456789",
            address: "القاهرة - المعادي",
            products: [
                { name: "مفك كهربائي", category: "معدات كهربائية", price: 1200, quantity: 1 },
                { name: "طقم عدة", category: "عدد يدوية", price: 850, quantity: 2 }
            ],
            total: 2900,
            date: "2025-03-20",
            status: "قيد المراجعة"
        }
    ];

    const table = createOrdersTable(orders);
    container.innerHTML = '';
    container.appendChild(table);


    initializeStatusButtons();
}

/**
 *  أزرار تغيير حالة الطلب
 */
function initializeStatusButtons() {
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const buttonsContainer = this.closest('.status-buttons');
            const buttons = buttonsContainer.querySelectorAll('.status-btn');
            
            // إزالة التنشيط من الأزرار
            buttons.forEach(button => {
                button.classList.remove('btn-warning', 'btn-success', 'btn-danger');
                button.classList.add(`btn-outline-${getStatusClass(button.dataset.status)}`);
            });

            // تفعيل الزرار المختار
            const status = this.dataset.status;
            const statusClass = getStatusClass(status);
            this.classList.remove(`btn-outline-${statusClass}`);
            this.classList.add(`btn-${statusClass}`);

            // عرض حالة الطلب في الجدول
            updateOrderStatus(this.closest('tr').dataset.orderId, status);
        });
    });
}

/**
 *  انواع حالة الطلب
 */
function getStatusClass(status) {
    switch(status) {
        case 'قيد المراجعة': return 'warning';
        case 'تم الشحن': return 'success';
        case 'ملغي': return 'danger';
        default: return 'secondary';
    }
}

/**
 *  حالة الطلب
 */
function updateOrderStatus(orderId, newStatus) {
    
    console.log(`تحديث حالة الطلب ${orderId} إلى ${newStatus}`);
}

function createOrdersTable(orders) {
    const template = document.getElementById('ordersTableTemplate');
    if (!template) return document.createElement('div');

    const table = template.content.cloneNode(true);
    const tbody = table.querySelector('tbody');

    orders.forEach(order => {
        const row = createOrderRow(order);
        tbody.appendChild(row);
    });

    return table;
}

function createOrderRow(order) {
    const template = document.getElementById('orderRowTemplate');
    if (!template) return document.createElement('tr');

    const row = template.content.cloneNode(true);
    const tr = row.querySelector('tr');

    tr.dataset.orderId = order.id;
    tr.querySelector('.order-id').textContent = order.id;
    tr.querySelector('.customer-name').textContent = order.customerName;
    tr.querySelector('.customer-phone').textContent = order.phone;
    tr.querySelector('.customer-address').textContent = order.address;
    tr.querySelector('.order-total').textContent = `${order.total} ج.م`;
    tr.querySelector('.order-date').textContent = formatDate(order.date);

    // إضافة المنتجات
    const productsContainer = tr.querySelector('.order-products');
    order.products.forEach(product => {
        const productItem = createOrderProductItem(product);
        productsContainer.appendChild(productItem);
    });

    // قايمة تغيير الحالة
    const statusCell = tr.querySelector('.order-status-cell');
    const statusButtons = createStatusButtons(order.status);
    statusCell.appendChild(statusButtons);


    initializeOrderActions(tr, order);

    return tr;
}

// إجراءات الطلب
function createOrderProductItem(product) {
    
    const productDiv = document.createElement('div');
    productDiv.className = 'product-item';
    
    
    productDiv.innerHTML = `
        <div class="product-details">
            <span class="product-name">${product.name}</span>
            <small class="product-category">${product.category}</small>
        </div>
        <div class="product-numbers">
            <span class="quantity">${product.quantity}x</span>
            <span class="price">${product.price} ج.م</span>
        </div>
    `;
    
    return productDiv;
}

function createStatusButtons(currentStatus) {
    const template = document.getElementById('orderStatusTemplate');
    if (!template) return document.createElement('div');

    const buttons = template.content.cloneNode(true);
    const statusButtons = buttons.querySelectorAll('.status-btn');

    statusButtons.forEach(btn => {
        if (btn.dataset.status === currentStatus) {
            btn.classList.remove('btn-outline-warning', 'btn-outline-success', 'btn-outline-danger');
            switch (currentStatus) {
                case 'قيد المراجعة':
                    btn.classList.add('btn-warning');
                    break;
                case 'تم الشحن':
                    btn.classList.add('btn-success');
                    break;
                case 'ملغي':
                    btn.classList.add('btn-danger');
                    break;
            }
        }
    });

    return buttons;
}

function initializeOrderActions(row, order) {
    // زر عرض التفاصيل
    row.querySelector('.view-order-details-btn').addEventListener('click', () => {
        showOrderDetails(order);
    });

    // زر طباعة الفاتورة
    row.querySelector('.print-order-invoice-btn').addEventListener('click', () => {
        showInvoice(order);
    });
}

function showOrderDetails(order) {
    const modalElement = document.createElement('div');
    modalElement.className = 'modal fade';
    modalElement.id = 'orderDetailsModal';
    document.body.appendChild(modalElement);

    const template = document.getElementById('orderDetailsTemplate');
    if (!template) return;

    const content = template.content.cloneNode(true);
    fillOrderDetails(content, order);
    
    modalElement.innerHTML = content.querySelector('.modal-dialog').outerHTML;
    
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    // زر الإغلاق
    modalElement.addEventListener('hidden.bs.modal', () => {
        modalElement.remove();
    });
}

/**
 * عرض تفاصيل الطلب
 */
function fillOrderDetails(content, order) {
    if (!content || !order) return;

    // معلومات العميل
    content.querySelector('.customer-name').textContent = order.customerName;
    content.querySelector('.customer-phone').textContent = order.phone;
    content.querySelector('.customer-address').textContent = order.address;


    content.querySelector('.order-id').textContent = order.id;
    content.querySelector('.order-number').textContent = order.id;
    content.querySelector('.order-date').textContent = formatDate(order.date);
    
    // حالة الطلب
    const statusBadge = content.querySelector('.order-status');
    statusBadge.textContent = order.status;
    statusBadge.className = `badge bg-${getStatusClass(order.status)} order-status`;

    // جدول المنتجات
    const tableBody = content.querySelector('.products-table-body');
    tableBody.innerHTML = '';
    let total = 0;

    order.products.forEach(product => {
        const subtotal = product.price * product.quantity;
        total += subtotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price} ج.م</td>
            <td>${product.quantity}</td>
            <td>${subtotal} ج.م</td>
        `;
        tableBody.appendChild(row);
    });

    // الإجمالي
    content.querySelector('.total-amount').textContent = `${total} ج.م`;
}

/**
 * تفاصيل الفاتورة
 */
function fillInvoiceDetails(content, order) {
    if (!content || !order) return;

    // معلومات العميل والطلب
    content.querySelector('.customer-name').textContent = order.customerName;
    content.querySelector('.customer-phone').textContent = order.phone;
    content.querySelector('.customer-address').textContent = order.address;
    content.querySelector('.order-number').textContent = order.id;
    content.querySelector('.order-date').textContent = formatDate(order.date);
    content.querySelector('.invoice-date').textContent = formatDate(new Date());

    // المنتجات
    const tableBody = content.querySelector('.products-table-body');
    tableBody.innerHTML = '';
    let total = 0;

    order.products.forEach(product => {
        const subtotal = product.price * product.quantity;
        total += subtotal;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.price} ج.م</td>
            <td>${subtotal} ج.م</td>
        `;
        tableBody.appendChild(row);
    });

    // الإجمالي
    content.querySelector('.total-amount').textContent = `${total}`;
}

/**
 * عرض الفاتورة لتستخدم iframe
 */
function showInvoice(order) {
    // الفاتورة ifram
    const iframe = document.createElement('iframe');
    iframe.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        height: 90%;
        border: none;
        background: white;
        box-shadow: 0 0 20px rgba(0,0,0,0.2);
        z-index: 1050;
    `;
    document.body.appendChild(iframe);

    // إنشاء overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 1040;
    `;
    document.body.appendChild(overlay);

    // إضافة زر الإغلاق
    const closeButton = document.createElement('button');
    closeButton.innerHTML = `<i class="fas fa-times"></i>`;
    closeButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1060;
        background: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;

    // تحديث زر الطباعة
    const printButton = document.createElement('button');
    printButton.innerHTML = `طباعة <i class="fas fa-print me-2"></i>`;
    printButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 70px;
        z-index: 1060;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 6px;
        padding: 8px 20px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 5px;
    `;

    document.body.appendChild(closeButton);
    document.body.appendChild(printButton);

    // تحضير محتوى الفاتورة
    const template = document.getElementById('invoiceTemplate');
    if (!template) return;

    const content = template.content.cloneNode(true);
    fillInvoiceDetails(content, order);

    // هيكل الفاتورة iframe
    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
        <html dir="rtl">
            <head>
                <title>فاتورة طلب #${order.id}</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css">
                <link rel="stylesheet" href="Css/admin-dashboard.css">
                <style>
                    body {
                        padding: 20px;
                    }
                    @media print {
                        @page {
                            margin: 0;
                            size: auto;
                        }
                        body {
                            margin: 15mm;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }
                </style>
            </head>
            <body>
                ${content.querySelector('.invoice-container').outerHTML}
            </body>
        </html>
    `);
    iframeDoc.close();

    
    closeButton.addEventListener('click', () => {
        iframe.remove();
        overlay.remove();
        closeButton.remove();
        printButton.remove();
    });

    printButton.addEventListener('click', () => {
        iframe.contentWindow.print();
    });

    overlay.addEventListener('click', () => {
        iframe.remove();
        overlay.remove();
        closeButton.remove();
        printButton.remove();
    });
}

function createModal(id) {
    let modal = document.getElementById(id);
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = id;
        modal.setAttribute('tabindex', '-1');
        document.body.appendChild(modal);
    }
    return new bootstrap.Modal(modal);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
// =================== Orders Item End =====================


// =================== Notifications Item Start ===================
/**
 * صفحة الإشعارات
 */
function initializeNotifications() {
    if (!document.getElementById('notifications').classList.contains('active')) return;
    loadNotifications();

    //زر تحديد الكل كمقروء
    const markAllBtn = document.createElement('button');
    markAllBtn.className = 'btn btn-primary mark-all-read-btn mb-4';
    markAllBtn.innerHTML = '<i class="fas fa-check-double"></i> تحديد الكل كمقروء';
    markAllBtn.addEventListener('click', markAllNotificationsAsRead);

    const container = document.querySelector('.notifications-list');
    container.insertBefore(markAllBtn, container.firstChild);
}

/**
 * تحميل الإشعارات
 */
function loadNotifications(limit = null, container = null) {
    const targetContainer = container || document.querySelector('.notifications-list');
    if (!targetContainer) return;

    // امثلة للإشعارات
    const notifications = [
        {
            id: 1,
            type: 'order',
            title: 'طلب جديد',
            message: 'تم استلام طلب جديد من <strong>أحمد محمد</strong>',
            time: '2024-03-20T10:30:00',
            isRead: false,
            icon: 'fa-shopping-cart',
            color: 'primary'
        },
        {
            id: 2,
            type: 'product',
            title: 'تحديث المخزون',
            message: 'المنتج <strong>مفك كهربائي</strong> أوشك على النفاد',
            time: '2024-03-20T09:15:00',
            isRead: false,
            icon: 'fa-box',
            color: 'warning'
        },
        {
            id: 3,
            type: 'user',
            title: 'مستخدم جديد',
            message: 'انضم <strong>محمد علي</strong> إلى فريق العمل',
            time: '2024-03-19T16:45:00',
            isRead: true,
            icon: 'fa-user-plus',
            color: 'success'
        }
    ];


    const displayedNotifications = limit ? notifications.slice(0, limit) : notifications;

    // عداد الإشعارات غير المقروءة
    updateNotificationCount(notifications.filter(n => !n.isRead).length);


    targetContainer.innerHTML = '';

    // فلتر صفحة الاشعارات
    if (!container && limit === null) {
        targetContainer.appendChild(createNotificationsFilter());
    }

    // انواع الإشعارات وتفصيلها
    displayedNotifications.forEach(notification => {
        const notificationElement = createNotificationItem(notification);
        if (notificationElement) {
            targetContainer.appendChild(notificationElement);
        }
    });
}

/**
 * إنشاء فلتر الإشعارات
 */
function createNotificationsFilter() {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'notifications-filter mb-4';
    filterContainer.innerHTML = `
        <div class="btn-group" role="group">
            <button type="button" class="btn btn-primary active" data-filter="all">الكل</button>
            <button type="button" class="btn btn-outline-primary" data-filter="order">الطلبات</button>
            <button type="button" class="btn btn-outline-primary" data-filter="product">المنتجات</button>
            <button type="button" class="btn btn-outline-primary" data-filter="user">المستخدمين</button>
        </div>
    `;


    filterContainer.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function() {
            filterContainer.querySelectorAll('button').forEach(b => {
                b.classList.remove('active');
                b.classList.replace('btn-primary', 'btn-outline-primary');
            });
            this.classList.add('active');
            this.classList.replace('btn-outline-primary', 'btn-primary');
            
            const filter = this.dataset.filter;
            filterNotifications(filter);
        });
    });

    return filterContainer;
}

/**
 * فلترة الإشعارات
 */
function filterNotifications(filter) {
    document.querySelectorAll('.notification-item').forEach(item => {
        if (filter === 'all' || item.dataset.type === filter) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * تحديد جميع الإشعارات كمقروءة
 */
function markAllNotificationsAsRead() {
    document.querySelectorAll('.notification-item.unread').forEach(item => {
        item.classList.remove('unread');
        const markBtn = item.querySelector('.mark-as-read');
        if (markBtn) {
            markBtn.innerHTML = '<i class="fas fa-check-circle"></i>';
        }
    });
    updateNotificationCount(0);
}

/**
 * الإشعارات البوب اب
 */
function initializeNotificationsDropdown() {
    const notificationIcon = document.querySelector('.notification-icon-wrapper');
    const notificationsContent = document.querySelector('.notifications-content');
    
    if (!notificationIcon || !notificationsContent) return;

    // هنا تحديد اخر تلت اشعارات
    loadNotificationsPreview();

    // اظهار الدروب داون من ايقونة جرس الاشعارات
    notificationIcon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        notificationsContent.classList.toggle('show');

        // تحديث الإشعارات عند فتح القائمة
        if (notificationsContent.classList.contains('show')) {
            loadNotificationsPreview();
        }
    });

    // قفل الدروب داون لما ادوس في اي حته في الصفحه
    document.addEventListener('click', (e) => {
        if (!notificationsContent.contains(e.target) && !notificationIcon.contains(e.target)) {
            notificationsContent.classList.remove('show');
        }
    });

    // زر عرض كل الإشعارات
    const viewAllBtn = notificationsContent.querySelector('.view-all-notifications');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            notificationsContent.classList.remove('show');
            navigateToNotifications();
        });
    }
}

function loadNotificationsPreview() {
    const notificationsBody = document.querySelector('.notifications-content .notifications-body');
    if (!notificationsBody) return;

    // امثلة للإشعارات في الدروب داون
    const notifications = [
        {
            id: 1,
            type: 'order',
            title: 'طلب جديد',
            message: 'تم استلام طلب جديد من أحمد محمد',
            time: '2024-03-20T10:30:00',
            isRead: false,
            icon: 'fa-shopping-cart',
            color: 'primary'
        },
        {
            id: 2,
            type: 'product',
            title: 'تحديث المخزون',
            message: 'المنتج مفك كهربائي أوشك على النفاد',
            time: '2024-03-20T09:15:00',
            isRead: false,
            icon: 'fa-box',
            color: 'warning'
        },
        {
            id: 3,
            type: 'user',
            title: 'مستخدم جديد',
            message: 'انضم محمد علي إلى فريق العمل',
            time: '2024-03-19T16:45:00',
            isRead: true,
            icon: 'fa-user-plus',
            color: 'success'
        }
    ];

    // تحديث عداد الإشعارات غير المقروءة
    const unreadCount = notifications.filter(n => !n.isRead).length;
    updateNotificationCount(unreadCount);

    // عرض آخر 3 إشعارات
    notificationsBody.innerHTML = '';
    notifications.slice(0, 3).forEach(notification => {
        const notificationElement = createNotificationPreviewItem(notification);
        notificationsBody.appendChild(notificationElement);
    });
}

function createNotificationPreviewItem(notification) {
    const item = document.createElement('div');
    item.className = `notification-item ${notification.isRead ? '' : 'unread'}`;
    item.dataset.type = notification.type;

    item.innerHTML = `
        <div class="notification-icon ${notification.color}">
            <i class="fas ${notification.icon}"></i>
        </div>
        <div class="notification-content">
            <h6>${notification.title}</h6>
            <p>${notification.message}</p>
            <small>${formatNotificationDate(notification.time)}</small>
        </div>
    `;

    return item;
}

function navigateToNotifications() {
    const notificationsLink = document.querySelector('[data-section="notifications"]');
    if (notificationsLink) {
        notificationsLink.click();
    }
}

function updateNotificationCount(count) {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
        
        if (count > 0) {
            badge.classList.add('pulse');
            setTimeout(() => badge.classList.remove('pulse'), 1000);
        }
    }
}

// تهيئة نظام الإشعارات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    initializeNotificationsDropdown();
});

function createNotificationItem(notification) {
    const template = document.getElementById('notificationItemTemplate');
    if (!template) return;

    const item = template.content.cloneNode(true);
    const notificationElement = item.querySelector('.notification-item');


    notificationElement.classList.add(`notification-${notification.type}`);
    if (!notification.isRead) notificationElement.classList.add('unread');
    notificationElement.dataset.type = notification.type;


    const content = notificationElement.querySelector('.notification-content');
    content.querySelector('h6').textContent = notification.title;
    content.querySelector('p').innerHTML = notification.message;
    content.querySelector('small').textContent = formatNotificationDate(notification.time);


    const icon = document.createElement('div');
    icon.className = `notification-icon ${notification.color}`;
    icon.innerHTML = `<i class="fas ${notification.icon}"></i>`;
    notificationElement.insertBefore(icon, content);


    const actions = document.createElement('div');
    actions.className = 'notification-actions';
    actions.innerHTML = `
        <button class="btn btn-light mark-as-read" title="تحديد كمقروء">
            ${notification.isRead ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-circle"></i>'}
        </button>
        <button class="btn btn-light delete-notification" title="حذف">
            <i class="fas fa-trash"></i>
        </button>
    `;
    notificationElement.appendChild(actions);


    actions.querySelector('.mark-as-read').addEventListener('click', () => {
        markNotificationAsRead(notificationElement, notification.id);
    });
    actions.querySelector('.delete-notification').addEventListener('click', () => {
        deleteNotification(notificationElement, notification.id);
    });

    return notificationElement;
}

/**
 * تنسيق تاريخ الإشعار
 */
function formatNotificationDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 30) return `منذ ${days} يوم`;
    
    return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * تحديد الإشعار كمقروء
 */
function markNotificationAsRead(element, id) {
    element.classList.remove('unread');
    const markBtn = element.querySelector('.mark-as-read');
    if (markBtn) {
        markBtn.innerHTML = '<i class="fas fa-check-circle"></i>';
    }
    updateNotificationCount(document.querySelectorAll('.notification-item.unread').length);
}

/**
 * حذف الإشعار
 */
function deleteNotification(element, id) {
    element.style.transform = 'translateX(-100%)';
    element.style.opacity = '0';
    setTimeout(() => {
        element.remove();
        if (element.classList.contains('unread')) {
            updateNotificationCount(document.querySelectorAll('.notification-item.unread').length);
        }
    }, 300);
}
// =================== Notifications Item End =====================


// =================== Users Item Start ===================
function initializeUsers() {
    if (!document.getElementById('users').classList.contains('active')) return;

    // جدول المسؤولين
    loadUsersTable();
    
    // هنا بنجهز نظام الدعوات
    initializeInviteSystem();
}

/**
 * جدول المسؤولين
 */
function loadUsersTable() {
    const container = document.querySelector('.users-table');
    if (!container) return;

    // بيانات المسؤولين
    const users = [
        {
            id: 1,
            name: "أحمد محمد",
            email: "ahmed@example.com",
            phone: "0123456789",
            role: "مدير عام",
            permissions: ["إدارة المنتجات", "إدارة الطلبات", "إدارة المسؤولين"],
            joinDate: "2024-01-15",
            status: "نشط"
        }
    ];

    const table = createUsersTable(users);
    container.innerHTML = '';
    container.appendChild(table);
}

function createUsersTable(users) {
    const template = document.getElementById('usersTableTemplate');
    if (!template) return document.createElement('div');

    const table = template.content.cloneNode(true);
    const tbody = table.querySelector('tbody');

    users.forEach(user => {
        const row = createUserRow(user);
        tbody.appendChild(row);
    });

    return table;
}

function createUserRow(user) {
    const template = document.getElementById('userRowTemplate');
    if (!template) return document.createElement('tr');

    const row = template.content.cloneNode(true);
    const tr = row.querySelector('tr');

    tr.dataset.userId = user.id;
    tr.querySelector('.user-name').textContent = user.name;
    tr.querySelector('.user-email').textContent = user.email;
    tr.querySelector('.user-phone').textContent = user.phone;
    tr.querySelector('.user-role').textContent = user.role;
    tr.querySelector('.user-join-date').textContent = formatDate(user.joinDate);
    
    // إضافة الصلاحيات
    const permissionsBadges = tr.querySelector('.permissions-badges');
    user.permissions.forEach(permission => {
        const badge = document.createElement('span');
        badge.className = 'badge bg-info me-1';
        badge.textContent = permission;
        permissionsBadges.appendChild(badge);
    });

    // حالة المستخدم
    const statusBadge = tr.querySelector('.user-status');
    statusBadge.textContent = user.status;
    statusBadge.className = `badge ${user.status === 'نشط' ? 'bg-success' : 'bg-danger'}`;

    // أزرار الإجراءات
    tr.querySelector('.edit-user-btn').addEventListener('click', () => {
        openEditUserModal(user);
    });

    tr.querySelector('.delete-user-btn').addEventListener('click', () => {
        deleteUser(user.id);
    });

    return tr;
}

/**
 * نافذة تعديل المستخدم
 */
function openEditUserModal(user) {
    const template = document.getElementById('editUserModalTemplate');
    if (!template) return;

    const modalContent = template.content.cloneNode(true);
    const modalEl = document.createElement('div');
    modalEl.className = 'modal fade';
    modalEl.id = 'editUserModal';
    modalEl.appendChild(modalContent);
    document.body.appendChild(modalEl);

    // تعبئة البيانات في اثناء التعديل
    const form = modalEl.querySelector('.edit-user-form');
    form.querySelector('[name="userId"]').value = user.id;
    form.querySelector('[name="name"]').value = user.name;
    form.querySelector('[name="email"]').value = user.email;
    form.querySelector('[name="phone"]').value = user.phone;
    form.querySelector('[name="role"]').value = user.role;

    // تحديد الصلاحيات
    const permissions = form.querySelectorAll('input[name="permissions[]"]');
    permissions.forEach(checkbox => {
        checkbox.checked = user.permissions.includes(checkbox.value);
    });


    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleEditUser(form, user.id);
    });

    // زر الحفظ
    const submitBtn = modalEl.querySelector('.edit-user-submit-btn');
    submitBtn.addEventListener('click', () => {
        form.requestSubmit();
    });


    const modal = new bootstrap.Modal(modalEl);
    modal.show();


    modalEl.addEventListener('hidden.bs.modal', () => {
        modalEl.remove();
    });
}

function handleEditUser(form, userId) {
    const formData = new FormData(form);
    const updatedUser = {
        id: userId,
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        role: formData.get('role'),
        permissions: Array.from(formData.getAll('permissions[]'))
    };

    // تحديث البيانات في الجدول
    updateUserInTable(updatedUser);

    // إغلاق تعديل المستخدم
    const modalEl = form.closest('.modal');
    if (modalEl) {
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal?.hide();
    }

    // عرض رسالة نجاح
    showToast('success', 'تم تحديث بيانات المسؤول بنجاح');
}

function updateUserInTable(user) {
    const row = document.querySelector(`tr[data-user-id="${user.id}"]`);
    if (!row) return;

    // تحديث البيانات في الصف
    row.querySelector('.user-name').textContent = user.name;
    row.querySelector('.user-email').textContent = user.email;
    row.querySelector('.user-phone').textContent = user.phone;
    row.querySelector('.user-role').textContent = user.role;

    // تحديث الصلاحيات
    const permissionsBadges = row.querySelector('.permissions-badges');
    permissionsBadges.innerHTML = '';
    user.permissions.forEach(permission => {
        const badge = document.createElement('span');
        badge.className = 'badge bg-info me-1';
        badge.textContent = permission;
        permissionsBadges.appendChild(badge);
    });

    // إضافة تأثير حركي للتحديث
    row.style.transition = 'background-color 0.3s ease';
    row.style.backgroundColor = '#e8f5e9';
    setTimeout(() => {
        row.style.backgroundColor = '';
    }, 1000);
}

/**
 * تهيئة نظام الدعوات
 */
function initializeInviteSystem() {
    // إضافة دعوة جديدة
    const inviteForm = document.getElementById('inviteUserForm');
    if (inviteForm) {
        inviteForm.addEventListener('submit', handleInvite);
    }

    // تحديث عداد الدعوات
    updatePendingInvitesCount();

    // تحديث جدول الدعوات المعلقة
    updatePendingInvitesTable();
}

/**
 * تحديث جدول الدعوات المعلقة
 */
function updatePendingInvitesTable() {
    const modalBody = document.querySelector('#pendingInvitesModal .modal-body');
    if (!modalBody) return;

    const invites = JSON.parse(sessionStorage.getItem('pendingInvites') || '[]');
    const tableBody = modalBody.querySelector('tbody');
    const emptyMessage = modalBody.querySelector('.empty-invites');

    if (invites.length === 0) {
        tableBody.innerHTML = '';
        emptyMessage.classList.remove('d-none');
    } else {
        emptyMessage.classList.add('d-none');
        tableBody.innerHTML = invites.map(invite => {
            const inviteDate = new Date(invite.date);
            const formattedDate = inviteDate.toLocaleDateString('ar-EG');
            const formattedTime = inviteDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

            return `
                <tr data-invite-id="${invite.id}">
                    <td>${invite.name}</td>
                    <td>${invite.email}</td>
                    <td>${formattedDate}</td>
                    <td>${formattedTime}</td>
                    <td><span class="badge bg-warning">${invite.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-secondary resend-invite" title="إعادة إرسال الدعوة">
                            <i class="fas fa-redo"></i>
                        </button>
                        <button class="btn btn-sm btn-danger cancel-invite" title="إلغاء الدعوة">
                            <i class="fas fa-times"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    
    const resendButtons = modalBody.querySelectorAll('.resend-invite');
    const cancelButtons = modalBody.querySelectorAll('.cancel-invite');

    resendButtons.forEach(button => {
        button.addEventListener('click', () => {
            const inviteId = button.closest('tr').dataset.inviteId;
            resendInvite(inviteId);
        });
    });

    cancelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const inviteId = button.closest('tr').dataset.inviteId;
            cancelInvite(inviteId);
        });
    });
}

/**
 * إضافة دعوة جديدة
 */
function handleInvite(e) {
    e.preventDefault();
    const formData = new FormData(this);
    
    // إنشاء الدعوة
    const invite = {
        id: Date.now().toString(),
        name: formData.get('name'),
        email: formData.get('email'),
        date: new Date().toISOString(),
        status: 'في انتظار القبول'
    };


    const invites = JSON.parse(sessionStorage.getItem('pendingInvites') || '[]');
    invites.push(invite);
    sessionStorage.setItem('pendingInvites', JSON.stringify(invites));

    // تحديث عداد الدعوات وجدول الدعوات
    updatePendingInvitesCount();
    updatePendingInvitesTable();


    const modal = bootstrap.Modal.getInstance(document.getElementById('inviteUserModal'));
    if (modal) {
        modal.hide();
        this.reset();
    }

    showToast('success', 'تم إرسال الدعوة بنجاح');
}

/**
 * إلغاء دعوة
 */
function cancelInvite(inviteId) {
    if (!confirm('هل أنت متأكد من إلغاء هذه الدعوة؟')) return;

    // حذف الدعوة
    const invites = JSON.parse(sessionStorage.getItem('pendingInvites') || '[]');
    const updatedInvites = invites.filter(inv => inv.id !== inviteId);
    sessionStorage.setItem('pendingInvites', JSON.stringify(updatedInvites));

    // تحديث العداد والجدول
    updatePendingInvitesCount();
    updatePendingInvitesTable();

    showToast('success', 'تم إلغاء الدعوة بنجاح');
}

/**
 * تحديث عداد الدعوات المعلقة
 */
function updatePendingInvitesCount() {
    const invites = JSON.parse(sessionStorage.getItem('pendingInvites') || '[]');
    const count = invites.length;
    const badges = document.querySelectorAll('.pending-invites-count');
    
    badges.forEach(badge => {
        if (count > 0) {
            badge.style.display = 'inline-flex';
            badge.textContent = count;
            badge.classList.add('pulse');
            setTimeout(() => badge.classList.remove('pulse'), 1000);
        } else {
            badge.style.display = 'none';
        }
    });
}

/**
 * إعادة إرسال دعوة
 */
function resendInvite(inviteId) {
    const invites = JSON.parse(sessionStorage.getItem('pendingInvites') || '[]');
    const inviteIndex = invites.findIndex(inv => inv.id === inviteId);

    if (inviteIndex === -1) {
        showToast('error', 'لم نستطع ارسال الدعوة.');
        return;
    }

    // تحديث تاريخ ووقت إعادة الإرسال
    invites[inviteIndex].date = new Date().toISOString();
    
    // حفظ التغييرات
    sessionStorage.setItem('pendingInvites', JSON.stringify(invites));
    
    // تحديث عرض الجدول
    updatePendingInvitesTable();

    console.log(`إعادة إرسال الدعوة إلى: ${invites[inviteIndex].email}`);

    // عرض رسالة نجاح
    showToast('success', 'تمت إعادة إرسال الدعوة بنجاح.');
}
// =================== Users Item End =====================


// =================== Toast/Alert Item Start ===================
/**
 * عرض رسالة التنبيه
 */
function showToast(type, message) {
    // إزالة أي تنبيه موجود
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    // عنصر التنبيه
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed bottom-0 start-50 translate-middle-x p-3';
    toastContainer.style.zIndex = '5000';

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white border-0 ${type === 'success' ? 'bg-success' : 'bg-danger'}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    toastContainer.appendChild(toast);
    document.body.appendChild(toastContainer);

    // عرض التنبيه
    const bsToast = new bootstrap.Toast(toast, {
        animation: true,
        autohide: true,
        delay: 3000
    });
    
    bsToast.show();

    // تنسيق التنبيه
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            min-width: 250px;
            opacity: 0;
            transition: all 0.3s ease;
        }
        .toast.show {
            opacity: 1;
            transform: translateY(-20px);
        }
        .toast.hide {
            opacity: 0;
            transform: translateY(0);
        }
        .toast-body {
            font-size: 0.95rem;
            padding: 12px 15px;
        }
    `;
    document.head.appendChild(style);


    toast.addEventListener('hidden.bs.toast', () => {
        toastContainer.remove();
        style.remove();
    });
}
// =================== Toast/Alert Item End ===================


// =================== Admin Functions Start ===================
/**
 * حذف مسؤول
 */
function deleteUser(userId) {
    if (!confirm('هل أنت متأكد من حذف هذا المسؤول؟')) return;

    const userRow = document.querySelector(`tr[data-user-id="${userId}"]`);
    if (!userRow) return;

    // تأثير حركي للحذف
    userRow.style.transition = 'all 0.3s ease';
    userRow.style.opacity = '0';
    userRow.style.transform = 'translateX(-100%)';

    setTimeout(() => {
        userRow.remove();
        showToast('success', 'تم حذف المسؤول بنجاح');
    }, 300);

}
// =================== Admin Functions End ===================


// =================== Search Functionality Start ===================
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigationSystem();
    initializeDashboard();
    initializeSearch();
});

function resetAllSearchResults() {
    document.querySelectorAll('.product-management-card, .orders-table tr[data-order-id], .users-table tr[data-user-id]')
        .forEach(el => {
            el.style.display = '';
            el.style.opacity = '1';
        });
}

function initializeSearch() {
    const searchBox = document.querySelector('.search-box');
    const searchIconBtn = document.querySelector('.search-icon-btn');
    const searchInput = searchBox.querySelector('.search-dropdown input');

    if (!searchBox || !searchIconBtn || !searchInput) return;

    // فتح / إغلاق مربع البحث
    searchIconBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        searchBox.classList.toggle('active');
        searchInput.focus();
    });

    // إغلاق لما اضغط في اي حته في الصفحه
    document.addEventListener('click', (e) => {
        if (!searchBox.contains(e.target)) {
            searchBox.classList.remove('active');
        }
    });

    // البحث داخل الاقسام
    searchInput.addEventListener('input', () => {
        const term = searchInput.value.trim().toLowerCase();
        const section = document.querySelector('.content-section.active');

        if (!term || !section) {
            resetAllSearchResults();
            return;
        }

        if (section.id === 'products') {
            searchProducts(term);
        } else if (section.id === 'orders') {
            searchOrders(term);
        } else if (section.id === 'users') {
            searchUsers(term);
        }
    });
}

// توحيد الحروف المتشابهه
function normalizeArabicText(text) {
    return text
        .replace(/[أإآا]/g, 'ا')
        .replace(/[ىي]/g, 'ي')
        .replace(/[ؤو]/g, 'و')
        .replace(/[ةه]/g, 'ه')
        .replace(/[ئ]/g, 'ء')
        .toLowerCase();
}

function searchProducts(term) {
    const normalizedTerm = normalizeArabicText(term);
    const productCards = document.querySelectorAll('.product-management-card');
    
    productCards.forEach(card => {
        const name = normalizeArabicText(card.querySelector('h5').textContent);
        const model = normalizeArabicText(card.querySelector('.model').textContent);
        const category = normalizeArabicText(card.querySelector('.category').textContent);
        
        const isMatch = name.includes(normalizedTerm) || 
                    model.includes(normalizedTerm) || 
                    category.includes(normalizedTerm);

        card.style.display = isMatch ? '' : 'none';
        card.style.opacity = '0';
        
        if (isMatch) {
            requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.3s ease';
                card.style.opacity = '1';
            });
        }
    });
}

function searchOrders(term) {
    const normalizedTerm = normalizeArabicText(term);
    const orderRows = document.querySelectorAll('.orders-table tr[data-order-id]');
    
    orderRows.forEach(row => {
        const orderId = normalizeArabicText(row.querySelector('.order-id').textContent);
        const customerName = normalizeArabicText(row.querySelector('.customer-name').textContent);
        const phone = row.querySelector('.customer-phone').textContent.toLowerCase();
        
        const isMatch = orderId.includes(normalizedTerm) || 
                    customerName.includes(normalizedTerm) || 
                    phone.includes(term);

        row.style.display = isMatch ? '' : 'none';
    });
}

function searchUsers(term) {
    const normalizedTerm = normalizeArabicText(term);
    const userRows = document.querySelectorAll('.users-table tr[data-user-id]');
    
    userRows.forEach(row => {
        const name = normalizeArabicText(row.querySelector('.user-name').textContent);
        const email = row.querySelector('.user-email').textContent.toLowerCase();
        const role = normalizeArabicText(row.querySelector('.user-role').textContent);
        
        const isMatch = name.includes(normalizedTerm) || 
                    email.includes(term) ||
                    role.includes(normalizedTerm);

        row.style.display = isMatch ? '' : 'none';
    });
}
// =================== Search Functionality End ===================

// =================== Success Ribbon Item Start ===================
/**
 * شريط تنبيه النجاح عند اضافة او تعديل منتج
 */
function showSuccessRibbon(element) {

    element.querySelectorAll('.success-ribbon').forEach(el => el.remove());

    // إنشاء الشريط
    const ribbon = document.createElement('div');
    ribbon.className = 'success-ribbon';
    ribbon.innerHTML = `<i class="fas fa-check"></i> تم بنجاح`;

    // تنسيق الشريط
    ribbon.style.position = 'absolute';
    ribbon.style.top = '10px';
    ribbon.style.right = '-180px';
    ribbon.style.opacity = '0';
    ribbon.style.transition = 'all 0.5s cubic-bezier(.68,-0.55,.27,1.55)';

    // إضافة الشريط للكرت
    element.style.position = 'relative';
    element.appendChild(ribbon);


    setTimeout(() => {
        ribbon.style.right = '10px';
        ribbon.style.opacity = '1';
    }, 10);


    setTimeout(() => {
        ribbon.style.right = '-180px';
        ribbon.style.opacity = '0';
        setTimeout(() => ribbon.remove(), 400);
    }, 2000);
}
// =================== Success Ribbon Item End ===================


// =================== Responsive Features Start ===================

    
    const searchBox = document.querySelector(".search-box");
    const searchBtn = searchBox.querySelector(".search-icon-btn");
    const searchInput = searchBox.querySelector(".search-dropdown input");

    searchBtn.addEventListener("click", () => {
        searchBox.classList.toggle("active");
        searchInput.focus();
    });

    searchInput.addEventListener("input", () => {
        const keyword = searchInput.value.toLowerCase();
        const activeSection = document.querySelector(".content-section.active");
        if (!activeSection) return;

        const rows = activeSection.querySelectorAll("table tbody tr");
        rows.forEach((row) => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(keyword) ? "" : "none";
        });
    });

function initializeResponsive() {

    const toggleButton = document.querySelector('.toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (toggleButton && sidebar && overlay) {
        toggleButton.addEventListener('click', () => {
            document.body.classList.toggle('sidebar-open');
            sidebar.classList.toggle('collapsed');
        });

        overlay.addEventListener('click', () => {
            document.body.classList.remove('sidebar-open');
            sidebar.classList.remove('collapsed');
        });
    }

    // البحث
    const searchBox = document.querySelector(".search-box");
    if (searchBox) {
        const searchBtn = searchBox.querySelector(".search-icon-btn");
        const searchInput = searchBox.querySelector(".search-dropdown input");
        const searchDropdown = searchBox.querySelector(".search-dropdown");

        if (searchBtn && searchInput && searchDropdown) {

            searchBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                searchBox.classList.toggle("active");
                if (searchBox.classList.contains("active")) {
                    searchInput.focus();
                }
            });

            // منع إغلاق البحث عند النقر داخل الدروب داون
            searchDropdown.addEventListener("click", (e) => {
                e.stopPropagation();
            });

            // إغلاق البحث عند النقر في أي مكان خارج صندوق البحث
            document.addEventListener("click", () => {
                if (searchBox.classList.contains("active")) {
                    searchBox.classList.remove("active");
                }
            });

            searchInput.addEventListener("input", () => {

                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    resetAllSearchResults();
                    searchProducts(searchTerm);
                    searchOrders(searchTerm);
                    searchUsers(searchTerm);
                }
            });
        }
    }


    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            document.body.classList.remove('sidebar-open');
            if (sidebar) sidebar.classList.remove('collapsed');
        }
    });
}
// =================== Responsive Features End ===================