// src/components/Products.tsx
import React, { useEffect, useState } from 'react';
import { ProductCart } from '../layout/prouctCart/cart';

interface Product {
  id: number;
  name: string;
  price: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
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
          <ProductCart key={product.id} title={product.name} price={product.price} />
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
