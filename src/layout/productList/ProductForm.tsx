import React, { useState } from 'react';
import { Form, Input, Button, DragDropArea, ImagePreview } from '../../styles/AdminPanelStyles';
import { validateProductForm } from '../../components/utils/validation';

interface ProductFormProps {
  onSubmit: (data: any) => void;
  initialData?: {
    nameEn?: string;
    nameRu?: string;
    nameGeo?: string;
    price?: string;
    unit?: string;
    step?: string;
    discounts?: any[];
  };
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  initialData = {},
  onCancel,
}) => {
  const [nameEn, setNameEn] = useState(initialData.nameEn || '');
  const [nameRu, setNameRu] = useState(initialData.nameRu || '');
  const [nameGeo, setNameGeo] = useState(initialData.nameGeo || '');
  const [price, setPrice] = useState(initialData.price || '');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // добавили состояние для предпросмотра
  const [unit, setUnit] = useState(initialData.unit || 'kg');
  const [step, setStep] = useState(initialData.step || '1');
  const [discounts, setDiscounts] = useState(initialData.discounts || []);
  const [errors, setErrors] = useState<any>({});

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // устанавливаем превью изображения
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // устанавливаем превью изображения
    }
  };

  const handleSubmit = () => {
    const formData = {
      nameEn,
      nameRu,
      nameGeo,
      price,
      unit,
      step,
      image,
      discounts: JSON.stringify(discounts),
    };

    const validationErrors = validateProductForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
    // Сброс формы после отправки
    setNameEn('');
    setNameRu('');
    setNameGeo('');
    setPrice('');
    setImage(null);
    setImagePreview(null); // сброс превью изображения
    setUnit('kg');
    setStep('1');
    setDiscounts([]);
    setErrors({});
  };

  return (
    <Form>
      <Input
        type="text"
        value={nameEn}
        onChange={(e) => setNameEn(e.target.value)}
        placeholder="Название продукта (английский)"
      />
      {errors.nameEn && <p>{errors.nameEn}</p>}
      <Input
        type="text"
        value={nameRu}
        onChange={(e) => setNameRu(e.target.value)}
        placeholder="Название продукта (русский)"
      />
      {errors.nameRu && <p>{errors.nameRu}</p>}
      <Input
        type="text"
        value={nameGeo}
        onChange={(e) => setNameGeo(e.target.value)}
        placeholder="Название продукта (грузинский)"
      />
      {errors.nameGeo && <p>{errors.nameGeo}</p>}
      <Input
        type="text"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Цена продукта"
      />
      {errors.price && <p>{errors.price}</p>}

      <DragDropArea onDrop={handleDrop} onDragOver={handleDragOver}>
        <p>Перетащите сюда изображение или нажмите для загрузки</p>
        <Input type="file" onChange={handleImageChange} />
      </DragDropArea>

      {imagePreview && (
        <ImagePreview>
          <p>Предпросмотр изображения:</p>
          <img src={imagePreview} alt="Предпросмотр" />
        </ImagePreview>
      )}

      <label>
        Единица измерения:
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="kg">Килограммы</option>
          <option value="pcs">Штуки</option>
          <option value="g">Граммы</option>
        </select>
      </label>
      {unit === 'g' && (
        <label>
          Шаг (граммы):
          <select value={step} onChange={(e) => setStep(e.target.value)}>
            <option value="10">10 грамм</option>
            <option value="100">100 грамм</option>
            <option value="500">500 грамм</option>
          </select>
        </label>
      )}

      <div>
        <h3>Скидки</h3>
        {discounts.map((discount, index) => (
          <div key={index}>
            <Input
              type="number"
              value={discount.quantity}
              onChange={(e) =>
                setDiscounts(prev =>
                  prev.map((d, i) => i === index ? {...d, quantity: e.target.value} : d)
                )
              }
              placeholder="Количество"
            />
            <Input
              type="number"
              value={discount.price}
              onChange={(e) =>
                setDiscounts(prev =>
                  prev.map((d, i) => i === index ? {...d, price: e.target.value} : d)
                )
              }
              placeholder="Цена за единицу"
            />
            <Button type="button" onClick={() => setDiscounts(discounts.filter((_, i) => i !== index))}>
              Удалить
            </Button>
          </div>
        ))}
        <Button type="button" onClick={() => setDiscounts([...discounts, { quantity: '', price: '' }])}>
          Добавить скидку
        </Button>
      </div>

      <Button type="button" onClick={handleSubmit}>
        Сохранить
      </Button>
      {onCancel && (
        <Button type="button" onClick={onCancel}>
          Отмена
        </Button>
      )}
    </Form>
  );
};

export default ProductForm;
