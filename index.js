import express from 'express';
import path from 'path'
import fs from 'fs';

const app = express();


import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Указываем Express использовать статические файлы из каталога 'static'
app.use(express.static(path.join(__dirname, 'static')));

// Обработка запроса на стандартном адресе '/'
app.get('/', (req, res) => {
   
});

const filePath = './data.json';
let jsonObject;
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка при чтении файла:', err);
      return;
    }
  
    try {
      // Преобразование JSON в объект
    jsonObject = JSON.parse(data);
      console.log('Объект из файла JSON:', jsonObject);
    } catch (parseError) {
      console.error('Ошибка при разборе JSON:', parseError);
    }
  });

app.get('/api/items', (req, res) => {
    res.status(200).send(jsonObject)
});

app.get('/api/items/:code', (req, res) => {
    const code = req.params.code;
    const item = jsonObject.data.find(item => item.code === code);
    res.status(200).send(item);
});


// Запуск сервера на порту 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
