// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const express = require('express')

const fs = require('fs')
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');


const filePath = path.join(__dirname, '../reviews.json');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../static/reviews-images')); 
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });
const upload = multer({ storage: storage });

const router = express.Router()

const getReviews = async () => {
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

const saveReviews = (reviews) => {
    const jsonData = JSON.stringify({ data: reviews }, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf8');
};



router.get('/', async (req, res) => {
    const reviews = await getReviews()
    res.status(200).send(reviews)
});

router.post('/', upload.array('photos'), async (req, res) => {
    const reviews = (await getReviews()).data;

    const newPhotos =  req.files.map(file => {
        return {
            id: uuidv4(),
            url: `${file.filename}`
        }
    })
  
    reviews.push(...newPhotos);
    saveReviews(reviews);
  
    res.status(201).json(newPhotos);
  });


const deletePhoto = async (id) => {
    const reviews = (await getReviews()).data;
    
    const photoToDeleteIndex = reviews.findIndex(item => item.id === id);
    if (photoToDeleteIndex === -1) {
        return { success: false, message: 'Товар не найден.' };
    }

    const photoToDelete = reviews[photoToDeleteIndex]

    const photoPath = path.join(__dirname, '../static/reviews-images', photoToDelete.url);

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

router.delete('/:id', async (req, res) => {
    const reviewId = req.params.id;
    const reviews = (await getReviews()).data;

    // Находим индекс товара
    const reviewIndex = reviews.findIndex(item => item.id === reviewId);
    if (reviewIndex === -1) {
        return res.status(404).json({ message: 'Фото не найдено.' });
    }

    await deletePhoto(reviewId); // Вызов функции для удаления фотографии

    // Удаляем товар из массива
    reviews.splice(reviewIndex, 1);
    saveReviews(reviews); // Сохраняем обновленный массив товаров

    res.status(200).json({ message: 'Товар и его фотографии успешно удалены.' });
});

module.exports = router
