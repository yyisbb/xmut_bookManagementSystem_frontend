// * 用户所有信息接口
import {http} from "../index";

export const getBooksList = () => http.get('/getBooksList');

export const deleteBooks = (ids) => http.post('/deleteBooks', {ids});

export const addBook = (book) => http.post('/addBook', book);

export const getBookInfo = (id) => http.post('/getBookInfo', {id});

export const getBookInfoByBookNo = (bookNo) => http.post('/getBookContent', {bookNo});

export const updateBookInfo = (book) => http.post('/updateBookInfo', book);
