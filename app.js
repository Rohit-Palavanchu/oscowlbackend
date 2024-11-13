const express = require('express');
const cors = require('cors');
const blogRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')

const app = express();
app.use(cors());
app.use(express.json());

app.use('/todo', blogRoutes);
app.use('/todo', authRoutes);
app.use('/todo', profileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});