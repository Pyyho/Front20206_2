const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let products = [
    { id: 1, name: 'Ноутбук', price: 75000 },
    { id: 2, name: 'Смартфон', price: 45000 },
    { id: 3, name: 'Наушники', price: 5000 }
];

app.get('/products', (req, res) => {
    res.json(products);
});

app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    res.json(product);
});

app.post('/products', (req, res) => {
    const { name, price } = req.body;
    
    if (!name || price === undefined) {
        return res.status(400).json({ 
            error: 'Необходимо указать название (name) и цену (price)' 
        });
    }
    
    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ 
            error: 'Цена должна быть положительным числом' 
        });
    }
    
    const newProduct = {
        id: Date.now(), 
        name: name,
        price: price
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const { name, price } = req.body;
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    if (!name || price === undefined) {
        return res.status(400).json({ 
            error: 'Необходимо указать название (name) и цену (price)' 
        });
    }
    
    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ 
            error: 'Цена должна быть положительным числом' 
        });
    }
    
    products[productIndex] = {
        id: productId,
        name: name,
        price: price
    };
    
    res.json(products[productIndex]);
});


app.patch('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const { name, price } = req.body;
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }

    if (name !== undefined) {
        if (typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ error: 'Название должно быть непустой строкой' });
        }
        product.name = name;
    }
    
    if (price !== undefined) {
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ error: 'Цена должна быть положительным числом' });
        }
        product.price = price;
    }
    
    res.json(product);
});

app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    products.splice(productIndex, 1);
    res.json({ message: 'Товар успешно удален' });
});


app.get('/', (req, res) => {
    res.send(`
        <h1>CRUD API для товаров</h1>
        <p>Доступные эндпоинты:</p>
        <ul>
            <li><b>GET /products</b> - все товары</li>
            <li><b>GET /products/:id</b> - товар по ID</li>
            <li><b>POST /products</b> - создать товар (JSON: name, price)</li>
            <li><b>PUT /products/:id</b> - полное обновление товара</li>
            <li><b>PATCH /products/:id</b> - частичное обновление</li>
            <li><b>DELETE /products/:id</b> - удалить товар</li>
        </ul>
    `);
});

app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

app.listen(port, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${port}`);
});