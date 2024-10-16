import React from 'react';
import { ListItem, ProductDetails, ProductImage, Button } from '../../styles/AdminPanelStyles';

interface Product {
  id: number;
  name: {
    en: string;
    ru: string;
    geo: string;
  };
  price: number;
  image_url: string | null;
  unit: string;
  step?: number;
  discounts?: any[]; // Добавлено поле discounts
}

interface ProductListItemProps {
  product: Product;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const ProductListItem: React.FC<ProductListItemProps> = React.memo(
  ({ product, onDelete, onEdit }) => (
    <ListItem>
      <ProductDetails>
        <ProductImage src={product.image_url ?? ''} alt={product.name.en ?? ''} />
        <p>
          {product.name.en} - ${product.price} {product.unit}
        </p>
        {/* Отображение скидок */}
        {product.discounts && product.discounts.length > 0 && (
          <div>
            <p>Скидки:</p>
            <ul>
              {product.discounts.map((discount, index) => (
                <li key={index}>
                  {`При покупке от ${discount.quantity} шт. цена ${discount.price} за единицу`}
                </li>
              ))}
            </ul>
          </div>
        )}
        <Button onClick={() => onDelete(product.id)}>Удалить</Button>
        <Button onClick={() => onEdit(product.id)}>Редактировать</Button>
      </ProductDetails>
    </ListItem>
  )
);

export default ProductListItem;
