// src/utils/validation.ts

interface FormData {
    nameEn: string;
    nameRu: string;
    nameGeo: string;
    price: string;
    unit: string;
    step: string;
    image: File | null;
  }
  
  interface ValidationErrors {
    nameEn?: string;
    nameRu?: string;
    nameGeo?: string;
    price?: string;
    unit?: string;
    step?: string;
    image?: string;
  }
  
  export const validateProductForm = (data: FormData): ValidationErrors => {
    const errors: ValidationErrors = {};
  
    // Проверка названий
    if (!data.nameEn.trim()) {
      errors.nameEn = 'Название на английском обязательно.';
    }
  
    if (!data.nameRu.trim()) {
      errors.nameRu = 'Название на русском обязательно.';
    }
  
    if (!data.nameGeo.trim()) {
      errors.nameGeo = 'Название на грузинском обязательно.';
    }
  
    // Проверка цены
    if (!data.price.trim()) {
      errors.price = 'Цена обязательна.';
    } else if (isNaN(Number(data.price)) || Number(data.price) <= 0) {
      errors.price = 'Цена должна быть положительным числом.';
    }
  
    // Проверка единицы измерения
    const validUnits = ['kg', 'pcs', 'g'];
    if (!validUnits.includes(data.unit)) {
      errors.unit = 'Выберите корректную единицу измерения.';
    }
  
    // Если единица измерения "граммы", проверяем шаг
    if (data.unit === 'g') {
      const validSteps = ['10', '100', '500'];
      if (!validSteps.includes(data.step)) {
        errors.step = 'Выберите корректный шаг.';
      }
    }
  
    // Проверка изображения (опционально)
    if (data.image) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(data.image.type)) {
        errors.image = 'Допустимые форматы изображений: JPEG, PNG, GIF.';
      }
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (data.image.size > maxSizeInBytes) {
        errors.image = 'Размер изображения не должен превышать 5MB.';
      }
    }
  
    return errors;
  };
  