// * 用户所有信息接口
import {http} from "../index";

export const upload = (file) => http.postFile('/upload', file);
