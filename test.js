const { exec } = require('child_process');

// Đường dẫn đến tệp thực thi của Microsoft Edge trên Windows
const edgePath = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const url = 'https://www.messenger.com/t/5429678400420468/';

// Khởi động Microsoft Edge và mở trang cụ thể
exec(`${edgePath} ${url}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Lỗi: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
