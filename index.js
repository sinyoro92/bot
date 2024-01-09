const express = require('express');
const app = express();
const ejs = require('ejs');
const { fetchNews, scrapNews } = require('./app');
  const db = require('./db.connection');
    db();

const PORT = process.env.PORT || 3000;
app.use(express.static("public"));
app.set("view engine", "ejs");


app.get('/', async function (req, res) {
    try {
        const news = await fetchNews();
        res.render('index', { news });
    
    } catch (error) {
       console.log(error); 
    }
    
})

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
})