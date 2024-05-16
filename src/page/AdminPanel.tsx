import React, { useEffect, useState, ChangeEvent } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

export const AdminPanel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');

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
      .then((newProduct: Product) => {
        setProducts([...products, newProduct]);
        setName('');
        setPrice('');
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <div>
        <h2>Add New Product</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Product Price"
          value={price}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>
      <div>
        <h2>Products List</h2>
        <ul>
          {products.map(product => (
            <li key={product.id}>
              {product.name} - ${product.price.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

