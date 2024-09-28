// ProductForm.tsx

import React, { useState } from 'react';
import { Form, Input, Button } from '../../styles/AdminPanelStyles';
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
    image?: File | null;
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
  const [image, setImage] = useState<File | null>(initialData.image || null);
  const [unit, setUnit] = useState(initialData.unit || 'kg');
  const [step, setStep] = useState(initialData.step || '1');
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      nameEn,
      nameRu,
      nameGeo,
      price,
      unit,
      step,
      image,
    };

    const validationErrors = validateProductForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);

    // Сброс формы после отправки, если это не форма редактирования
    if (!initialData || Object.keys(initialData).length === 0) {
      setNameEn('');
      setNameRu('');
      setNameGeo('');
      setPrice('');
      setImage(null);
      setUnit('kg');
      setStep('1');
      setErrors({});
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
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

      <Input
        type="file"
        onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
        accept="image/*"
      />
      {errors.image && <p>{errors.image}</p>}

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

      <Button type="submit">Сохранить</Button>
      {onCancel && (
        <Button type="button" onClick={onCancel}>
          Отмена
        </Button>
      )}
    </Form>
  );
};

export default ProductForm;
