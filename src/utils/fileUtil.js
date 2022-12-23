import message from "./messageUtil";

let fileSelect = null;                           // 文件选择框
const FILE_TYPE = ['xls','xlsx']       // 限制文件上传类型
const FILE_MAX_SIZE = 10 * 1024 * 1024;      // 限制文件大小
const ACCEPT = ".xls,.xlsx"        // 限制选择文件的类型
// 选择文件功能
/**
 *
 * @param {*} accept   限制选择文件类型，默认.xls,.xlsx
 * @param {*} fileTypes    校验上传前文件类型, 默认['xls','xlsx']  , 单个类型可传字符串
 * @param {*} fileSize      限制文件上传大小
 */
export function uploadFile({accept,fileTypes,fileSize}){
    return new Promise((resolve,reject)=>{
        // 创建一个选择文件的input框
        if(!fileSelect){
            fileSelect = document.createElement('input');
            fileSelect.type = 'file';
            fileSelect.style.display="none";
            document.body.append(fileSelect);
        }
        // 获取文件类型，大小限制
        const mineType = accept || ACCEPT;
        const fileMaxSize = fileSize ? fileSize * 1024 * 1024 :  FILE_MAX_SIZE;
        // 限制可以选择的文件类型
        fileSelect.accept = mineType;
        // 监听input的change事件获取选择的文件
        fileSelect.onchange = function(e){
            // 获取文件
            const file = e.target.files[0];
            // 判断文件大小
            if(file.size > fileMaxSize){
                //  这里的处理方式一样，可以统一处理，也可以先不管
                // Message({
                //     message: `单个文件最大不超过${fileSize?fileSize:10}MB！`,
                //     type: 'info',
                //     duration: 5 * 1000
                // })
                // 将input选择器里面的内容置空，并将结果返回出去
                fileSelect.value = '';
                message.error('文件大小超出限制');
                return;
            }
            // 将input选择器里面的内容置空，并将选择到的文件结果传出去
            fileSelect.value = '';
            resolve(file);
        }
        // 自动触发点击事件，选择文件
        fileSelect.click();
    })
}
