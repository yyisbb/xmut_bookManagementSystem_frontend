// * 用户所有信息接口
import {http} from "../index";

export const getAllCategory = () => http.get('/getCategoryList');


export const deleteCategories = (ids) => http.post('/deleteCategories',{ids});

export const addCategory = (category) => http.post('/addCategory',category);
export const editCategory = (category) => http.post('/editCategory',category);


