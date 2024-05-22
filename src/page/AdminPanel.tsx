import React, { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

const AdminPanel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    fetch('/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error(error));
  }, []);

  const handleAddProduct = () => {
    fetch('/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, price: parseFloat(price) }),
    })
      .then((response) => response.json())
      .then((newProduct) => {
        setProducts([...products, newProduct]);
        setName('');
        setPrice('');
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteProduct = (id: number) => {
    fetch(`/products/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setProducts(products.filter((product) => product.id !== id));
      })
      .catch((error) => console.error(error));
  };

  const handleEditProduct = (id: number, newName: string, newPrice: number) => {
    fetch(`/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newName, price: newPrice }),
    })
      .then((response) => response.json())
      .then((updatedProduct) => {
        setProducts(products.map((product) => (product.id === id ? updatedProduct : product)));
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>ADMIN PANEL</h1>
      <div>
        <h2>Add New Product</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Product Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>
      <div>
        <h2>Products List</h2>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price}
              <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
              <button
                onClick={() => {
                  const newName = prompt('Enter new name:', product.name);
                  const newPriceStr = prompt('Enter new price:', product.price.toString());
                  if (newName !== null && newPriceStr !== null) {
                    const newPrice = parseFloat(newPriceStr);
                    if (!isNaN(newPrice)) {
                      handleEditProduct(product.id, newName, newPrice);
                    }
                  }
                }}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
