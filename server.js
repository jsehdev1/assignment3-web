const express = require("express");
const blogService = require("./blog-service");

const bodyParser = require('body-parser');
const app = express();
const path = require("path");

const cloudinary = require('cloudinary').v2;
const upload = require('./handlers/multer');
require('./handlers/cloudinary');

app.use(express.static('public'));
const port = process.env.PORT || 3000;

app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));

cloudinary.config({
    cloud_name: 'dxwgwfobi',
    api_key: '498436643178297',
    api_secret: 'MVMq5wnWIhBgt8HbPaA4WRJYTCU'
});

app.get('/', (req, res) => {
    res.redirect('/about');
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});

app.get('/posts/add', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/addPost.html'));
});

app.get("/blog", (req, res) => {
    blogService
        .getPublishedPosts()
        .then((posts) => res.json(posts))
        .catch((err) => res.status(500).send(err));
});

app.get("/posts", (req, res) => {
    blogService
        .getAllPosts()
        .then((posts) => res.json(posts))
        .catch((err) => res.status(500).send(err));
});

app.get("/categories", (req, res) => {
    blogService
        .getCategories()
        .then((categories) => res.json(categories))
        .catch((err) => res.status(500).send(err));
});

app.get("/posts", (req, res) => {
    const category = req.query.category;
    const minDate = req.query.minDate;

    if (category) {
        blogService
            .getPostsByCategory(category)
            .then((posts) => res.json(posts))
            .catch((err) => res.status(500).send(err));
    } else if (minDate) {
        blogService
            .getPostsByMinDate(minDate)
            .then((posts) => res.json(posts))
            .catch((err) => res.status(500).send(err));
    } else {
        blogService
            .getAllPosts()
            .then((posts) => res.json(posts))
            .catch((err) => res.status(500).send(err));
    }
});

app.get("/post/:id", (req, res) => {
    const id = req.params.id;

    blogService
        .getPostById(id)
        .then((post) => res.json(post))
        .catch((err) => res.status(500).send(err));
});

app.post('/posts/add', upload.single('image'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error uploading file');
    }
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

blogService


blogService
    .initialize()
    .then(() => {
        app.listen(port, () => {
            console.log(`Express Server is starting on port ${port}`);
        });
    })
    .catch((err) => {
        console.error(err);
    });

