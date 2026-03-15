document.addEventListener('DOMContentLoaded', function() {
    function renderDashboard() {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        document.getElementById('dashboard-products-count').textContent = products.length;
        document.getElementById('dashboard-categories-count').textContent = categories.length;
        document.getElementById('dashboard-orders-count').textContent = orders.length;
        document.getElementById('dashboard-users-count').textContent = users.length;

        // Products Overview
        const prodTbody = document.querySelector('#dashboard-products-table tbody');
        prodTbody.innerHTML = '';
        products.slice(0,5).forEach((p,i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${i+1}</td><td>${p.product_name}</td><td>${p.price}</td><td>${p.qty}</td><td>${p.category_id}</td><td>${p.description}</td>`;
            prodTbody.appendChild(tr);
        });

        // Categories Overview
        const catTbody = document.querySelector('#dashboard-categories-table tbody');
        catTbody.innerHTML = '';
        categories.slice(0,5).forEach((c,i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${i+1}</td><td>${c.category_name}</td>`;
            catTbody.appendChild(tr);
        });

        // Orders Overview
        const ordTbody = document.querySelector('#dashboard-orders-table tbody');
        ordTbody.innerHTML = '';
        orders.slice(0,5).forEach((o,i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${i+1}</td><td>${o.order_name}</td><td>${o.qty}</td><td>${o.date}</td><td>${o.product_id}</td>`;
            ordTbody.appendChild(tr);
        });

        // Users Overview
        const userTbody = document.querySelector('#dashboard-users-table tbody');
        userTbody.innerHTML = '';
        users.slice(0,5).forEach((u,i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${i+1}</td><td>${u.username}</td><td>${u.email}</td><td>${u.phone}</td>`;
            userTbody.appendChild(tr);
        });
    }

    // Helper: get category name by id
    function getCategoryName(cid) {
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        const cat = categories.find(c => c.cid == cid);
        return cat ? cat.category_name : cid;
    }
    // Helper: get product name by id
    function getProductName(pid) {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const prod = products.find(p => p.pid == pid);
        return prod ? prod.product_name : pid;
    }

    // Sidebar navigation update
    function showSection(sectionId) {
        document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
        document.getElementById(sectionId).style.display = 'block';
        if(sectionId === 'dashboard-section') renderDashboard();
        if(sectionId === 'list-product-section') renderProductList();
    }
    document.getElementById('add-product-nav').onclick = () => showSection('add-product-section');
    document.getElementById('list-product-nav').onclick = () => {
        showSection('list-product-section');
        renderProductList();
    };

    // Product form submit
    document.getElementById('add-product-form').onsubmit = function(e) {
        e.preventDefault();
        const form = e.target;
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const pid = Date.now();
        const product = {
            pid,
            product_name: form.product_name.value,
            price: parseFloat(form.price.value),
            qty: parseInt(form.qty.value),
            category_id: form.category_id.value,
            description: form.description.value
        };
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
        form.reset();
        alert('Product added!');
    };

    // Render product list
    function renderProductList() {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const tbody = document.querySelector('#product-list-table tbody');
        tbody.innerHTML = '';
        products.forEach((p, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${i+1}</td><td>${p.product_name}</td><td>${p.price}</td><td>${p.qty}</td><td>${getCategoryName(p.category_id)}</td><td>${p.description}</td><td></td>`;
            tbody.appendChild(tr);
        });
    }

    // Populate category select (dummy for now)
    const catSelect = document.getElementById('product-category-select');
    catSelect.innerHTML = '<option value="">Select Category</option>';
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.cid;
        opt.textContent = cat.category_name;
        catSelect.appendChild(opt);
    });

    // Repopulate all selects
    function repopulateSelects() {
        // Category select for products
        const catSelect = document.getElementById('product-category-select');
        if (catSelect) {
            catSelect.innerHTML = '<option value="">Select Category</option>';
            const categories = JSON.parse(localStorage.getItem('categories') || '[]');
            categories.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat.cid;
                opt.textContent = cat.category_name;
                catSelect.appendChild(opt);
            });
        }
        // Product select for orders
        const orderProductSelect = document.getElementById('order-product-select');
        if (orderProductSelect) {
            orderProductSelect.innerHTML = '<option value="">Select Product</option>';
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            products.forEach(prod => {
                const opt = document.createElement('option');
                opt.value = prod.pid;
                opt.textContent = prod.product_name;
                orderProductSelect.appendChild(opt);
            });
        }
    }

    // Trigger repopulateSelects on every sidebar nav click
    ['add-product-nav','add-category-nav','add-order-nav','add-user-nav','list-product-nav','list-category-nav','list-order-nav','list-user-nav','dashboard-products-more','dashboard-orders-more','dashboard-categories-more','dashboard-users-more'].forEach(id => {
        const btn = document.getElementById(id);
        if(btn) btn.onclick = function() {
            repopulateSelects();
            switch(id) {
                case 'add-product-nav': showSection('add-product-section'); break;
                case 'add-category-nav': showSection('add-category-section'); break;
                case 'add-order-nav': showSection('add-order-section'); break;
                case 'add-user-nav': showSection('add-user-section'); break;
                case 'list-product-nav': showSection('list-product-section'); renderProductList(); break;
                case 'list-category-nav': showSection('list-category-section'); renderCategoryList(); break;
                case 'list-order-nav': showSection('list-order-section'); renderOrderList(); break;
                case 'list-user-nav': showSection('list-user-section'); renderUserList(); break;
                case 'dashboard-products-more': showSection('list-product-section'); renderProductList(); break;
                case 'dashboard-orders-more': showSection('list-order-section'); renderOrderList(); break;
                case 'dashboard-categories-more': showSection('list-category-section'); renderCategoryList(); break;
                case 'dashboard-users-more': showSection('list-user-section'); renderUserList(); break;
            }
        };
    });

    // Add Category
    document.getElementById('add-category-form').onsubmit = function(e) {
        e.preventDefault();
        const form = e.target;
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        const cid = Date.now();
        const category = {
            cid,
            category_name: form.category_name.value
        };
        categories.push(category);
        localStorage.setItem('categories', JSON.stringify(categories));
        form.reset();
        alert('Category added!');
    };
    // Render Category List
    function renderCategoryList() {
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        const tbody = document.querySelector('#category-list-table tbody');
        tbody.innerHTML = '';
        categories.forEach((c, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${i+1}</td><td>${c.category_name}</td><td></td>`;
            tbody.appendChild(tr);
        });
    }

    // Add Order
    document.getElementById('add-order-form').onsubmit = function(e) {
        e.preventDefault();
        const form = e.target;
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const oid = Date.now();
        const order = {
            oid,
            order_name: form.order_name.value,
            qty: parseInt(form.qty.value),
            date: form.date.value,
            product_id: form.product_id.value
        };
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        form.reset();
        alert('Order added!');
    };
    // Render Order List
    function renderOrderList() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const tbody = document.querySelector('#order-list-table tbody');
        tbody.innerHTML = '';
        orders.forEach((o, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${i+1}</td><td>${o.order_name}</td><td>${o.qty}</td><td>${o.date}</td><td>${getProductName(o.product_id)}</td><td></td>`;
            tbody.appendChild(tr);
        });
    }

    // Populate order product select
    const orderProductSelect = document.getElementById('order-product-select');
    orderProductSelect.innerHTML = '<option value="">Select Product</option>';
    const productsForOrder = JSON.parse(localStorage.getItem('products') || '[]');
    productsForOrder.forEach(prod => {
        const opt = document.createElement('option');
        opt.value = prod.pid;
        opt.textContent = prod.product_name;
        orderProductSelect.appendChild(opt);
    });
    // Repopulate product select for orders
    function populateOrderProductSelect() {
        orderProductSelect.innerHTML = '<option value="">Select Product</option>';
        productsForOrder.forEach(prod => {
            const opt = document.createElement('option');
            opt.value = prod.pid;
            opt.textContent = prod.product_name;
            orderProductSelect.appendChild(opt);
        });
    }

    // Add User
    document.getElementById('add-user-form').onsubmit = function(e) {
        e.preventDefault();
        const form = e.target;
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const uid = Date.now();
        const user = {
            uid,
            username: form.username.value,
            email: form.email.value,
            phone: form.phone.value
        };
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        form.reset();
        alert('User added!');
    };
    // Render User List
    function renderUserList() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const tbody = document.querySelector('#user-list-table tbody');
        tbody.innerHTML = '';
        users.forEach((u, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${i+1}</td><td>${u.username}</td><td>${u.email}</td><td>${u.phone}</td><td></td>`;
            tbody.appendChild(tr);
        });
    }

    // Update sidebar navigation to repopulate selects
    document.getElementById('add-product-nav').onclick = () => {
        repopulateSelects();
        showSection('add-product-section');
    };
    document.getElementById('add-order-nav').onclick = () => {
        repopulateSelects();
        showSection('add-order-section');
    };
    document.getElementById('add-category-nav').onclick = () => showSection('add-category-section');
    document.getElementById('add-user-nav').onclick = () => showSection('add-user-section');

    // On load, show dashboard
    showSection('dashboard-section');
});
