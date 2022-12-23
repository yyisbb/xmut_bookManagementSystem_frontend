
import {http} from '../index'


export const getAllPullNoticeList = () => http.get('/getAllPullNoticeList');
export const getNotice = () => http.get('/getNotice');

export const sendNotice = (obj) => http.post('/sendNotice',obj);

export const readNotice = (id) => http.get('/readNotice', {id});
export const readAllNotice = () => http.get('/readAllNotice', );

