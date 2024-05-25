import React, { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
}

const AdminPanel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    fetch('/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error(error));
  }, []);

  const handleAddProduct = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    if (image) {
      formData.append('image', image);
    }

    fetch('/products', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((newProduct) => {
        setProducts([...products, newProduct]);
        setName('');
        setPrice('');
        setImage(null);
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

  const handleEditProduct = (id: number, newName: string, newPrice: number, newImage: File | null) => {
    const formData = new FormData();
    formData.append('name', newName);
    formData.append('price', newPrice.toString());
    if (newImage) {
      formData.append('image', newImage);
    }

    fetch(`/products/${id}`, {
      method: 'PUT',
      body: formData,
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
        <h2>Add Ne Product</h2>
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
        <input
          type="file"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>
      <div>
        <h2>Products List</h2>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <img src={product.image_url ?? ''} alt={product.name ?? ''} style={{ width: '50px', height: '50px' }} />
              {product.name} - ${product.price}
              <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
              <button
                onClick={() => {
                  const newName = prompt('Enter new name:', product.name);
                  const newPriceStr = prompt('Enter new price:', product.price.toString());
                  if (newName !== null && newPriceStr !== null) {
                    const newPrice = parseFloat(newPriceStr);
                    if (!isNaN(newPrice)) {
                      const newImage = document.createElement('input');
                      newImage.type = 'file';
                      newImage.onchange = () => {
                        if (newImage.files) {
                          handleEditProduct(product.id, newName, newPrice, newImage.files[0]);
                        }
                      };
                      newImage.click();
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
