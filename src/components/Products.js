// src/components/Products.js
import React, { useEffect, useState } from 'react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    fetch('/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error(error));
  }, []);

  const handleAddProduct = () => {
    fetch('/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, price: parseFloat(price) }),
    })
      .then(response => response.json())
      .then(newProduct => {
        setProducts([...products, newProduct]);
        setName('');
        setPrice('');
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - ${product.price.toFixed(2)}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Product Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>
    </div>
  );
};

export default Products;
