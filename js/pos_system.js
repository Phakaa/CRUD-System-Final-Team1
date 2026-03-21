document.addEventListener('DOMContentLoaded', function() {
    const db = {
        get: (key) => JSON.parse(localStorage.getItem(key) || '[]'),
        set: (key, data) => localStorage.setItem(key, JSON.stringify(data))
    };

    // Helper functions to get names from IDs
    const getCatName = (id) => db.get('categories').find(c => c.cid == id)?.category_name || "N/A";
    const getProdName = (id) => db.get('products').find(p => p.pid == id)?.product_name || "N/A";

    // Menu button toggle for sidebar
    const menuBtn = document.querySelector('.menu-btnn');
    const container = document.querySelector('.container');
    menuBtn.addEventListener('click', () => {
        container.classList.toggle('sidebar-closed');
    });

    function refreshSystem() {
        const categories = db.get('categories');
        const products = db.get('products');
        const orders = db.get('orders');
        const users = db.get('users');

        updateText('dashboard-products-count', products.length);
        updateText('dashboard-categories-count', categories.length);
        updateText('dashboard-orders-count', orders.length);
        updateText('dashboard-users-count', users.length);

        document.querySelectorAll('.cat-select').forEach(sel => {
            sel.innerHTML = '<option value="">Select Category</option>' + 
                categories.map(c => `<option value="${c.cid}">${c.category_name}</option>`).join('');
        });
        document.querySelectorAll('.prod-select').forEach(sel => {
            sel.innerHTML = '<option value="">Select Product</option>' + 
                products.map(p => `<option value="${p.pid}">${p.product_name}</option>`).join('');
        });

        renderRows('.table-products', products, p => `<td>${p.product_name}</td><td>${p.price}</td><td>${p.qty}</td><td>${getCatName(p.category_id)}</td>`);
        renderRows('.table-products', products, p => `
            <td>${p.product_name}</td><td>${p.price}</td><td>${p.qty}</td><td>${getCatName(p.category_id)}</td>
            <td>
                <button class="btn-edit" onclick="editItem('products', 'pid', ${p.pid}, ['product_name', 'price', 'qty'])">Edit</button>
                <button class="btn-del" onclick="deleteItem('products', 'pid', ${p.pid})">Delete</button>
            </td>`);
        renderRows('.table-categories', categories, c => `
            <td>${c.category_name}</td>
            <td>
                <button class="btn-edit" onclick="editItem('categories', 'cid', ${c.cid}, ['category_name'])">Edit</button>
                <button class="btn-del" onclick="deleteItem('categories', 'cid', ${c.cid})">Delete</button>
            </td>`);
        renderRows('.table-orders', orders, o => `
            <td>${o.order_name}</td><td>${o.qty}</td><td>${o.date}</td><td>${getProdName(o.product_id)}</td>
            <td>
                <button class="btn-edit" onclick="editItem('orders', 'oid', ${o.oid}, ['order_name', 'qty', 'date'])">Edit</button>
                <button class="btn-del" onclick="deleteItem('orders', 'oid', ${o.oid})">Delete</button>
            </td>`);
        renderRows('.table-users', users, u => `
            <td>${u.username}</td><td>${u.email}</td><td>${u.phone}</td>
            <td>
                <button class="btn-edit" onclick="editItem('users', 'uid', ${u.uid}, ['username', 'email', 'phone'])">Edit</button>
                <button class="btn-del" onclick="deleteItem('users', 'uid', ${u.uid})">Delete</button>
            </td>`);
        renderRows('#list-product-section .table-products', products, p => `
            <td>${p.product_name}</td><td>${p.price}</td><td>${p.qty}</td><td>${getCatName(p.category_id)}</td>
            <td>
                <button class="btn-edit" onclick="editItem('products', 'pid', ${p.pid}, ['product_name', 'price', 'qty'])">Edit</button>
                <button class="btn-del" onclick="deleteItem('products', 'pid', ${p.pid})">Delete</button>
            </td>`);

        renderRows('#list-category-section .table-categories', categories, c => `
            <td>${c.category_name}</td>
            <td>
                <button class="btn-edit" onclick="editItem('categories', 'cid', ${c.cid}, ['category_name'])">Edit</button>
                <button class="btn-del" onclick="deleteItem('categories', 'cid', ${c.cid})">Delete</button>
            </td>`);

        renderRows('#list-order-section .table-orders', orders, o => `
            <td>${o.order_name}</td><td>${o.qty}</td><td>${o.date}</td><td>${getProdName(o.product_id)}</td>
            <td>
                <button class="btn-edit" onclick="editItem('orders', 'oid', ${o.oid}, ['order_name', 'qty', 'date'])">Edit</button>
                <button class="btn-del" onclick="deleteItem('orders', 'oid', ${o.oid})">Delete</button>
            </td>`);

        renderRows('#list-user-section .table-users', users, u => `
            <td>${u.username}</td><td>${u.email}</td><td>${u.phone}</td>
            <td>
                <button class="btn-edit" onclick="editItem('users', 'uid', ${u.uid}, ['username', 'email', 'phone'])">Edit</button>
                <button class="btn-del" onclick="deleteItem('users', 'uid', ${u.uid})">Delete</button>
            </td>`);
    }

    window.deleteItem = (key, idProp, idValue) => {
        if (confirm("Delete this item?")) {
            db.set(key, db.get(key).filter(i => i[idProp] != idValue));
            refreshSystem();
        }
    };

    window.editItem = (key, idProp, idValue, fields) => {
        const data = db.get(key);
        const item = data.find(i => i[idProp] == idValue);
        if (!item) return;
        fields.forEach(f => {
            const n = prompt(`Edit ${f.replace('_',' ')}:`, item[f]);
            if (n !== null) item[f] = n;
        });
        db.set(key, data);
        refreshSystem();
    };

    function updateText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }

    function renderRows(selector, data, rowFunc) {
        document.querySelectorAll(selector).forEach(table => {
            const tbody = table.querySelector('tbody');
            if (tbody) tbody.innerHTML = data.map((item, i) => `<tr><td>${i+1}</td>${rowFunc(item)}</tr>`).join('');
        });
    }

    function showSection(id) {
        document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
        const active = document.getElementById(id);
        if (active) { active.style.display = 'block'; refreshSystem(); }
    }

    document.addEventListener('click', e => {
        const target = e.target.closest('[data-section]');
        if (target) showSection(target.getAttribute('data-section'));
    });

    function initForm(formId, storageKey, idPrefix) {
        const form = document.getElementById(formId);
        if (!form) return;
        form.onsubmit = (e) => {
            e.preventDefault();
            const entry = { [idPrefix]: Date.now() };
            new FormData(form).forEach((v, k) => entry[k] = v);
            const data = db.get(storageKey);
            data.push(entry);
            db.set(storageKey, data);
            form.reset();
            refreshSystem();
        };
    }

    initForm('add-product-form', 'products', 'pid');
    initForm('add-category-form', 'categories', 'cid');
    initForm('add-order-form', 'orders', 'oid');
    initForm('add-user-form', 'users', 'uid');

    showSection('dashboard-section');
});