import React, { useState, useEffect } from 'react';
import { Header } from '../layout/header/header';

interface Product {
  id: number;
  name: {
    en: string;
    ru: string;
    geo: string;
  };
  price: number;
  image_url: string | null;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  phone: string;
  telegram_username: string;
}

const AdminPanel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [nameEn, setNameEn] = useState('');
  const [nameRu, setNameRu] = useState('');
  const [nameGeo, setNameGeo] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    fetch('/products')
      .then((response) => response.json())
      .then((data) => {
        const updatedProducts = data.map((product: any) => ({
          ...product,
          name: {
            en: product.name_en,
            ru: product.name_ru,
            geo: product.name_geo
          }
        }));
        setProducts(updatedProducts);
      })
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  useEffect(() => {
    fetch('/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const handleAddProduct = () => {
    const formData = new FormData();
    formData.append('nameEn', nameEn);
    formData.append('nameRu', nameRu);
    formData.append('nameGeo', nameGeo);
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
        const updatedProduct = {
          ...newProduct,
          name: {
            en: newProduct.name_en,
            ru: newProduct.name_ru,
            geo: newProduct.name_geo
          }
        };
        setProducts([...products, updatedProduct]);
        setNameEn('');
        setNameRu('');
        setNameGeo('');
        setPrice('');
        setImage(null);
      })
      .catch((error) => console.error('Error adding product:', error));
  };

  const handleDeleteProduct = (id: number) => {
    fetch(`/products/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setProducts(products.filter((product) => product.id !== id));
      })
      .catch((error) => console.error('Error deleting product:', error));
  };

  const handleEditProduct = (id: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setEditProductId(id);
      setNameEn(product.name.en);
      setNameRu(product.name.ru);
      setNameGeo(product.name.geo);
      setPrice(product.price.toString());
    }
  };

  const handleSaveProduct = (id: number) => {
    const formData = new FormData();
    formData.append('nameEn', nameEn);
    formData.append('nameRu', nameRu);
    formData.append('nameGeo', nameGeo);
    formData.append('price', price);
    if (image) {
      formData.append('image', image);
    }

    fetch(`/products/${id}`, {
      method: 'PUT',
      body: formData,
    })
      .then((response) => response.json())
      .then((updatedProduct) => {
        const updatedProducts = products.map((product) =>
          product.id === id
            ? {
                ...updatedProduct,
                name: {
                  en: updatedProduct.name_en,
                  ru: updatedProduct.name_ru,
                  geo: updatedProduct.name_geo
                }
              }
            : product
        );
        setProducts(updatedProducts);
        setEditProductId(null);
        setNameEn('');
        setNameRu('');
        setNameGeo('');
        setPrice('');
        setImage(null);
      })
      .catch((error) => console.error('Error updating product:', error));
  };

  return (
    <div>
          <Header />
      <h1>ADMIN PANEL</h1>
      <div>
        <h2>Add New Product</h2>
        <input
          type="text"
          placeholder="Product Name (English)"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
        />
        <input
          type="text"
          placeholder="Product Name (Russian)"
          value={nameRu}
          onChange={(e) => setNameRu(e.target.value)}
        />
        <input
          type="text"
          placeholder="Product Name (Georgian)"
          value={nameGeo}
          onChange={(e) => setNameGeo(e.target.value)}
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
              <img src={product.image_url ?? ''} alt={product.name.en ?? ''} style={{ width: '50px', height: '50px' }} />
              {editProductId === product.id ? (
                <div>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="Product Name (English)"
                  />
                  <input
                    type="text"
                    value={nameRu}
                    onChange={(e) => setNameRu(e.target.value)}
                    placeholder="Product Name (Russian)"
                  />
                  <input
                    type="text"
                    value={nameGeo}
                    onChange={(e) => setNameGeo(e.target.value)}
                    placeholder="Product Name (Georgian)"
                  />
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Product Price"
                  />
                  <input
                    type="file"
                    onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                  />
                  <button onClick={() => handleSaveProduct(product.id)}>Save</button>
                  <button onClick={() => setEditProductId(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  {product.name.en} - ${product.price}
                  <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                  <button onClick={() => handleEditProduct(product.id)}>Edit</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Users List</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.first_name} {user.last_name} - {user.email}
              <p>Address: {user.address}</p>
              <p>Phone: {user.phone}</p>
              <p>Telegram: {user.telegram_username}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
