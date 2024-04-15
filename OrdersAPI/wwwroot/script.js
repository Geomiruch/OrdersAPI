const PAGE_SIZE = 3;

document.addEventListener("DOMContentLoaded", () => {
    const orderIdFilter = document.getElementById('orderIdFilter');
    const productIdFilter = document.getElementById('productIdFilter');
    const productCodeFilter = document.getElementById('productCodeFilter');

    orderIdFilter.addEventListener('input', filterOrders);
    productIdFilter.addEventListener('input', filterProducts);
    productCodeFilter.addEventListener('input', filterProductsByCode);

    loadOrders(1);
    loadProducts(1);
    loadProductsSelect();
});

function loadOrders(page) {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    fetch(`${window.location.origin}/api/Order/Read`)
        .then(response => response.json())
        .then(data => {
            const orders = data.slice(start, end);
            displayOrders(orders);
            renderOrderPagination(data.length, page);
        });
}

function renderOrderPagination(totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / PAGE_SIZE); 

    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<button onclick="loadOrders(${i})" ${i === currentPage ? 'class="active"' : ''}>${i}</button>`;
    }

    orderPagination.innerHTML = paginationHTML;
}

function displayOrders(orders) {
    const ordersTable = document.getElementById('ordersTable').getElementsByTagName('tbody')[0];
    ordersTable.innerHTML = '';
    orders.forEach(order => {
        const products = order.products.map(product => `${product.name} (ID: ${product.id})`).join(', ');
        ordersTable.innerHTML += `
      <tr>
        <td>${order.id}</td>
        <td>${order.createdOn}</td>
        <td>${order.customerFullName}</td>
        <td>${order.customerPhone}</td>
        <td>${products}</td>
      </tr>
    `;
    });
}


function loadProducts(page) {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    fetch(`${window.location.origin}/api/Product/Read`)
        .then(response => response.json())
        .then(data => {
            const products = data.slice(start, end);
            displayProducts(products);
            renderProductPagination(data.length, page);
        });
}

function renderProductPagination(totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / PAGE_SIZE); 

    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<button onclick="loadProducts(${i})" ${i === currentPage ? 'class="active"' : ''}>${i}</button>`;
    }

    productPagination.innerHTML = paginationHTML;
}

function displayProducts(products) {
    const productsTable = document.getElementById('productsTable').getElementsByTagName('tbody')[0];
    productsTable.innerHTML = '';
    products.forEach(product => {
        productsTable.innerHTML += `
      <tr>
        <td>${product.id}</td>
        <td>${product.code}</td>
        <td>${product.name}</td>
        <td>${product.price}</td>
      </tr>
    `;
    });
}

function filterOrders() {
    const orderId = document.getElementById('orderIdFilter').value.trim();
    if (!orderId) {
        loadOrders();
        return;
    }

    fetch(`${window.location.origin}/api/Order/Read/${orderId}`)
        .then(response => response.json())
        .then(order => displayOrders([order]))
        .catch(err => displayOrders([])); 
}

function filterProducts() {
    const productId = document.getElementById('productIdFilter').value.trim();
    if (!productId) {
        loadProducts();
        return;
    }

    fetch(`${window.location.origin}/api/Product/Read/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(product => {
            const products = product ? [product] : [];
            displayProducts(products);
        })
        .catch(err => {
            console.error('Error fetching data:', err);
            displayProducts([]);
        });
}

function filterProductsByCode() {
    const productCode = document.getElementById('productCodeFilter').value.trim();
    if (!productCode) {
        loadProducts();
        return;
    }

    fetch(`${window.location.origin}/api/Product/Read/code/${productCode}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(product => {
            const products = product ? [product] : [];
            displayProducts(products);
        })
        .catch(err => {
            console.error('Error fetching data:', err);
            displayProducts([]);
        });
}

function updateProduct() {
    const productId = document.getElementById('updateId').value.trim();
    const productCode = document.getElementById('updateCode').value.trim();
    const productName = document.getElementById('updateName').value.trim();
    const productPrice = document.getElementById('updatePrice').value.trim();

    if (!productId || !productCode || !productName || !productPrice) {
        alert('Please fill in all fields');
        return;
    }

    const productData = {
        id: parseInt(productId),
        code: productCode,
        name: productName,
        price: parseFloat(productPrice),
    };

    fetch(`${window.location.origin}/api/Product/Update/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            alert('Product updated successfully!');
            loadProducts();
        })
        .catch(err => {
            console.error('Error updating product:', err);
            alert('Error updating product');
        });
}

function createProduct() {
    const productCode = document.getElementById('createCode').value.trim();
    const productName = document.getElementById('createName').value.trim();
    const productPrice = document.getElementById('createPrice').value.trim();

    if (!productCode || !productName || !productPrice) {
        alert('Please fill in all fields');
        return;
    }

    const productData = {
        code: productCode,
        name: productName,
        price: parseFloat(productPrice),
    };

    fetch(`${window.location.origin}/api/Product/Create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            alert('Product created successfully!');
            loadProducts();
            document.getElementById('createCode').value = '';
            document.getElementById('createName').value = '';
            document.getElementById('createPrice').value = '';
        })
        .catch(err => {
            console.error('Error creating product:', err);
            alert('Error creating product');
        });
}

function loadProductsSelect() {
    fetch(`${window.location.origin}/api/Product/Read`)
        .then(response => response.json())
        .then(products => {
            const productsList = document.getElementById('productsList');
            productsList.innerHTML = '';
            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.text = `${product.name} - ${product.code}`;
                productsList.appendChild(option);
            });
        })
        .catch(err => {
            console.error('Error loading products:', err);
        });
}

let selectedProducts = []; 

function updateSelectedProductsList() {
    const selectedProductsList = document.getElementById('selectedProductsList');
    selectedProductsList.innerHTML = '';
    selectedProducts.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} (Quantity: ${item.quantity})`;
        selectedProductsList.appendChild(listItem);
    });
}

function addProduct() {
    const productId = parseInt(document.getElementById('productsList').value);
    const productName = document.getElementById('productsList').selectedOptions[0].textContent;
    const productQuantity = parseInt(document.getElementById('productQuantity').value);

    if (productId && !selectedProducts.some(item => item.id === productId)) {
        selectedProducts.push({ id: productId, name: productName, quantity: productQuantity });
        updateSelectedProductsList();
    }
}

function createOrder() {
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();

    if (!customerName || !customerPhone || selectedProducts.length === 0) {
        alert('Please fill in all fields and select at least one product');
        return;
    }

    const orderData = {
        order: {
            customerFullName: customerName,
            customerPhone: customerPhone,
            createdOn: new Date().toISOString() 
        },
        products: selectedProducts.map(product => ({
            productId: product.id,
            amount: product.quantity
        }))
    };

    fetch(`${window.location.origin}/api/Order/Create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            alert('Order created successfully!');
            loadOrders();
            document.getElementById('customerName').value = '';
            document.getElementById('customerPhone').value = '';
            document.getElementById('productQuantity').value = '1';
            selectedProducts = [];
            updateSelectedProductsList(); 
        })
        .catch(err => {
            console.error('Error creating order:', err);
            alert('Error creating order');
        });
}