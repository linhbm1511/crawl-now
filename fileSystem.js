//fs(file system) là một modul của nodejs cho phép ta ghi và đọc file
const fs = require('fs');
// ta tạo 1 file bằng cách sử dụng createNewfile, ở đây mình sử dụng arrow function
//openSync: sẽ mở file theo một tiến trình(sync) và sẽ mở file nên với quyền write;
module.exports = {
    createNewfile: (fileName) => {
        const fd = fs.openSync(fileName, 'w'); //fd là file description
    },

    saveJsonObjectToFile: (obj, fileName) => {
        // mình sử dụng stringify để biến object của chúng ta thành 1 string.
        const jsonString = JSON.stringify(obj)
        //tiếp theo ta gọi writeFile để ghi json ta vừa convert sang string vào fileName với dạng utf-8
        fs.writeFile(fileName, jsonString, 'utf-8', (err, data) => {
            if (err) throw err;
            console.log(`Saved to file ${fileName}`);
        });
    },
}