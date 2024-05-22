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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

  const handleDeleteProduct = (id: number) => {
    fetch(`/products/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setProducts(products.filter(product => product.id !== id));
      })
      .catch(error => console.error(error));
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
  };

  const handleUpdateProduct = () => {
    if (editingProduct) {
      fetch(`/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, price: parseFloat(price) }),
      })
        .then(response => response.json())
        .then((updatedProduct: Product) => {
          setProducts(products.map(product =>
            product.id === updatedProduct.id ? updatedProduct : product
          ));
          setEditingProduct(null);
          setName('');
          setPrice('');
        })
        .catch(error => console.error(error));
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <div>
        <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
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
        <button onClick={editingProduct ? handleUpdateProduct : handleAddProduct}>
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
      </div>
      <div>
        <h2>Products List</h2>
        <ul>
          {products.map(product => {
            const productPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price);
            return (
              <li key={product.id}>
                {product.name} - ${productPrice.toFixed(2)}
                <button onClick={() => handleEditProduct(product)}>Edit</button>
                <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;


// 

// import React, { useState, useEffect } from 'react';
// import Products from '../components/Products';

// const AdminPanel = () => {
//   const [products, setProducts] = useState([]);
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');

//   useEffect(() => {
//     fetch('/products')
//       .then((response) => response.json())
//       .then((data) => setProducts(data))
//       .catch((error) => console.error(error));
//   }, []);

//   const handleAddProduct = () => {
//     fetch('/products', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ name, price: parseFloat(price) }),
//     })
//       .then((response) => response.json())
//       .then((newProduct) => {
//         setProducts([...Products, newProduct]);
//         setName('');
//         setPrice('');
//       })
//       .catch((error) => console.error(error));
//   };

//   const handleDeleteProduct = (id) => {
//     fetch(`/products/${id}`, {
//       method: 'DELETE',
//     })
//       .then(() => {
//         setProducts(products.filter((product) => product.id !== id));
//       })
//       .catch((error) => console.error(error));
//   };

//   return (
//     <div>
//       <h1>ADMIN PANEL</h1>
//       <div>
//         <h2>Add New Product</h2>
//         <input
//           type="text"
//           placeholder="Product Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Product Price"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//         />
//         <button onClick={handleAddProduct}>Add Product</button>
//       </div>
//       <div>
//         <h2>Products List</h2>
//         <ul>
//           {products.map((product) => (
//             <li key={product.id}>
//               {product.name} - ${product.price}
//               <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
//               {/* Implement Edit functionality here */}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;
