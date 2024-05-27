import React, { useState, useEffect } from 'react';

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

const AdminPanel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [nameEn, setNameEn] = useState('');
  const [nameRu, setNameRu] = useState('');
  const [nameGeo, setNameGeo] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    fetch('/products')
      .then((response) => response.json())
      .then((data) => {
        // Обновляем структуру данных для продуктов
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

  const handleEditProduct = (id: number, newNameEn: string, newNameRu: string, newNameGeo: string, newPrice: number, newImage: File | null) => {
    const formData = new FormData();
    formData.append('nameEn', newNameEn);
    formData.append('nameRu', newNameRu);
    formData.append('nameGeo', newNameGeo);
    formData.append('price', newPrice.toString());
    if (newImage) {
      formData.append('image', newImage);
    } else {
      formData.append('image', ''); // чтобы отправить пустую строку если изображение не выбрано
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
      })
      .catch((error) => console.error('Error updating product:', error));
  };

  const handleEditClick = (product: Product) => {
    const newNameEn = prompt('Enter new English name:', product.name.en);
    const newNameRu = prompt('Enter new Russian name:', product.name.ru);
    const newNameGeo = prompt('Enter new Georgian name:', product.name.geo);
    const newPriceStr = prompt('Enter new price:', product.price.toString());
    if (newNameEn !== null && newNameRu !== null && newNameGeo !== null && newPriceStr !== null) {
      const newPrice = parseFloat(newPriceStr);
      if (!isNaN(newPrice)) {
        const newImage = document.createElement('input');
        newImage.type = 'file';
        newImage.onchange = () => {
          if (newImage.files && newImage.files[0]) {
            handleEditProduct(product.id, newNameEn, newNameRu, newNameGeo, newPrice, newImage.files[0]);
          } else {
            handleEditProduct(product.id, newNameEn, newNameRu, newNameGeo, newPrice, null);
          }
        };
        newImage.click();
      }
    }
  };

  return (
    <div>
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
              {product.name.en} - ${product.price}
              <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
              <button onClick={() => handleEditClick(product)}>Edit</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
