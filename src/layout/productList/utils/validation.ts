export const validateProductForm = (data: any) => {
    const errors: any = {};
  
    if (!data.nameEn) {
      errors.nameEn = 'Английское название обязательно';
    }
  
    if (!data.nameRu) {
      errors.nameRu = 'Русское название обязательно';
    }
  
    if (!data.nameGeo) {
      errors.nameGeo = 'Грузинское название обязательно';
    }
  
    if (!data.price || isNaN(Number(data.price))) {
      errors.price = 'Корректная цена обязательна';
    }
  
    if (!data.image && !data.id) { // Если это добавление, изображение обязательно
      errors.image = 'Изображение обязательно';
    }
  
    // Дополнительные проверки можно добавить здесь
  
    return errors;
  };
  