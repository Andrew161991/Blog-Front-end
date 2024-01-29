import express  from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import checkAuth from "./utils/checkAuth.js";
import { register, login, getMe } from './controllers/UserController.js';
import * as PostController from "./controllers/PostController.js";
import handleValidationErrors from './utils/handleValidationErrors.js';

mongoose.connect(
    'mongodb+srv://andreyerm16:wwwwww@cluster0.pdjkta8.mongodb.net/blog?retryWrites=true&w=majority',
    ).then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB Error', err));

const app = express()



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); //App
    }
});

const upload = multer({ storage });

app.use(express.json());
app.use('/upload', express.static('uploads'));
app.use(cors());

app.post('/auth/login',  loginValidation, handleValidationErrors, login);
app.post('/auth/register', registerValidation, handleValidationErrors,  register);
// checkAuth - Функция провверка авторизации
app.get('/auth/me', checkAuth, getMe);
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    return res.json({
        url: `/upload/${req.file.originalname}`,
    });
});
app.get('/tags', PostController.getLastTags);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', postCreateValidation, checkAuth, handleValidationErrors, PostController.create);
app.delete('/posts/:id',checkAuth, PostController.remove);
app.patch('/posts/:id',postCreateValidation,  checkAuth, handleValidationErrors, PostController.update)

app.listen(4444, (err) => {
    if (err){
        return console.log(err);
    }else{
        console.log('Server OK');
        
    }
});