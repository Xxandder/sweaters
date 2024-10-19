// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const express = require('express')

const fs = require('fs')
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');


const filePath = path.join(__dirname, '../data.json');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../static/goods-images')); 
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });
const upload = multer({ storage: storage });

const router = express.Router()

const getProducts = async () => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Ошибка при чтении файла:', err);
          reject(err);
          return;
        }
  
        try {
          const jsonObject = JSON.parse(data);
          resolve(jsonObject);
        } catch (parseError) {
          console.error('Ошибка при разборе JSON:', parseError);
          reject(parseError);
        }
      });
    });
};

const saveProducts = (products) => {
    const jsonData = JSON.stringify({ data: products }, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf8');
};




const deletePhotoFromProduct = async (id, photoToDelete) => {
    const products = (await getProducts()).data;

    const productIndex = products.findIndex(item => item.id === id);
    if (productIndex === -1) {
        return { success: false, message: 'Товар не найден.' };
    }

    const product = products[productIndex];
    const photoIndex = product.photos.indexOf(photoToDelete);
    if (photoIndex === -1) {
        return { success: false, message: 'Фотография не найдена.' };
    }

    const photoPath = path.join(__dirname, '../static/goods-images', photoToDelete);

    // Удаляем фотографию из массива
    product.photos.splice(photoIndex, 1);
    saveProducts(products);

    // Удаление файла
    return new Promise((resolve, reject) => {
        fs.unlink(photoPath, (err) => {
            if (err) {
                console.error('Ошибка при удалении файла:', err);
                reject({ success: false, message: 'Ошибка при удалении файла.' });
            } else {
                resolve({ success: true, message: 'Фотография успешно удалена.' });
            }
        });
    });
};
  


router.get('/', async (req, res) => {
    const products = await getProducts()
    res.status(200).send(products)
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const item = jsonObject.data.find(item => item.id === id);
    res.status(200).send(item);
});

router.post('/', upload.array('photos'), async (req, res) => {
    const products = (await getProducts()).data;

    const newProduct = {
      id: uuidv4(),
      title: req.body.title,
      code: req.body.code,
      manufacturer: req.body.manufacturer,
      composition: req.body.composition,
      sizes: req.body.sizes.split(','),
      price: parseFloat(req.body.price),
      photos: req.files.map(file => `${file.filename}`),
    };
  
    products.push(newProduct);
    saveProducts(products);
  
    res.status(201).json(newProduct);
  });

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const products = await getProducts()
    const index = products.data.findIndex(item => item.id === id);
    
    if (index === -1) {
        return res.status(404).json({ message: 'Товар не найден' });
    }

    const updatedProduct = {
        ...products.data[index],
        ...req.body
    };

    products.data[index] = updatedProduct;
    saveProducts(products.data);

    res.status(200).json(updatedProduct);
});

router.put('/:id/order', async (req, res) => {
    const id = req.params.id;
    const newOrder = parseInt(req.body.order); // Новый порядковый номер
    const products = (await getProducts()).data;

    const productIndex = products.findIndex(item => item.id === id);
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Товар не найден.' });
    }

    // Проверяем, чтобы новый порядковый номер был валидным
    if (isNaN(newOrder) || newOrder < 0 || newOrder >= products.length) {
        return res.status(400).json({ message: 'Некорректный порядковый номер.' });
    }

    const [product] = products.splice(productIndex, 1);

    products.splice(newOrder, 0, product);

    saveProducts(products);

    res.status(200).json({ message: 'Порядок товара и индексы обновлены.', products });
});


router.post('/:id/photos', upload.array('photos'), async (req, res) => {
    const productId = req.params.id;
    const photos = req.files.map(file => file.filename); // Получаем имена загруженных файлов

    const products = await getProducts();
    const product = products.data.find(item => item.id === productId);

    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Добавляем новые фото к существующему продукту
    product.photos = product.photos.concat(photos);
    saveProducts(products.data); // Сохраняем обновленные данные

    res.status(200).json({ success: true, message: 'Photos added successfully' });
});

router.delete('/:id', async (req, res) => {
    const productId = req.params.id;
    const products = (await getProducts()).data;

    // Находим индекс товара
    const productIndex = products.findIndex(item => item.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Товар не найден.' });
    }

    const product = products[productIndex];

    // Удаляем все фотографии товара
    for (const photo of product.photos) {
        await deletePhotoFromProduct(productId, photo); // Вызов функции для удаления фотографии
    }

    // Удаляем товар из массива
    products.splice(productIndex, 1);
    saveProducts(products); // Сохраняем обновленный массив товаров

    res.status(200).json({ message: 'Товар и его фотографии успешно удалены.' });
});


router.delete('/:id/photos', async (req, res) => {
    const id = req.params.id;
    const photoToDelete = req.body.photo;

    try {
        const result = await deletePhotoFromProduct(id, photoToDelete);
        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }
        res.status(200).json({ message: result.message });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении файла.' });
    }
});

module.exports = router
