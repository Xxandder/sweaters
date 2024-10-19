const express = require('express')
const cors = require('cors');
const path = require('path');

const authRouter = require('./routes/auth.routes.js');
const itemRouter = require('./routes/item.routes.js');
const reviewsRouter = require('./routes/reviews.routes.js');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));

app.use('/api/auth', authRouter)
app.use('/api/items', itemRouter)
app.use('/api/reviews', reviewsRouter)

// Запуск сервера на порту 3000
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});


