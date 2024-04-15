document.addEventListener("DOMContentLoaded", () => {
    const orderIdFilter = document.getElementById('orderIdFilter');
    const productIdFilter = document.getElementById('productIdFilter');
    const productCodeFilter = document.getElementById('productCodeFilter');

    orderIdFilter.addEventListener('input', filterOrders);
    productIdFilter.addEventListener('input', filterProducts);
    productCodeFilter.addEventListener('input', filterProductsByCode);

    loadOrders();
    loadProducts();
    loadProductsSelect();
});

function loadOrders() {
    fetch('https://localhost:44365/api/Order/Read')
        .then(response => response.json())
        .then(data => displayOrders(data));
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

function loadProducts() {
    fetch('https://localhost:44365/api/Product/Read')
        .then(response => response.json())
        .then(data => displayProducts(data));
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

    fetch(`https://localhost:44365/api/Order/Read/${orderId}`)
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

    fetch(`https://localhost:44365/api/Product/Read/${productId}`)
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

    fetch(`https://localhost:44365/api/Product/Read/code/${productCode}`)
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

    fetch(`https://localhost:44365/api/Product/Update/${productId}`, {
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

    fetch('https://localhost:44365/api/Product/Create', {
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
    fetch('https://localhost:44365/api/Product/Read')
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

    fetch('https://localhost:44365/api/Order/Create', {
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