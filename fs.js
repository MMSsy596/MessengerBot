const fs = require('fs');

// Lấy ngày hiện tại
const now = new Date();

// Định dạng ngày theo định dạng YYYY-MM-DD
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
const day = String(now.getDate()).padStart(2, '0');

// Tạo chuỗi ngày
const formattedDate = `${year}-${month}-${day}`;

// Tạo tên file dựa trên ngày
const filename = `output_${formattedDate}.txt`;

// Dữ liệu bạn muốn thêm vào file
const dataToAppend = 'Hello, again!';

// Thêm dữ liệu vào file với tên theo ngày
fs.appendFile(filename, dataToAppend + '\n', (err) => {
  if (err) {
    console.error('Lỗi khi thêm vào file:', err);
    return;
  }
  console.log(`Dữ liệu đã được thêm vào file ${filename} thành công!`);
});
