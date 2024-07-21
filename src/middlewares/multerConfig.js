const multer = require('multer');
const path = require('path');

// Конфигурация для хранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Папка для загрузки файлов
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Уникальное имя файла
  }
});

// Фильтр для проверки типа файла
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Ошибка: загружать можно только изображения!');
  }
};

// Ограничение размера файла (например, 5MB)
const limits = {
  fileSize: 5 * 1024 * 1024 // 5 MB
};

// Инициализация Multer с указанными конфигурациями
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits
});

module.exports = upload;
