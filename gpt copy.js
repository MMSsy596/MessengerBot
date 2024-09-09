const puppeteer = require('puppeteer');

(async () => {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

  // Khởi động trình duyệt Edge
  const browser = await puppeteer.launch({
    headless: false, // Đặt 'headless: false' để thấy trình duyệt
    executablePath: edgePath, // Đường dẫn đến trình duyệt Edge
    args: ['--start-maximized'], // Khởi động trình duyệt ở chế độ tối đa hóa
  });

  const page = await browser.newPage();

  // Điều hướng đến Messenger
  await page.goto('https://www.messenger.com/', { waitUntil: 'networkidle2' });

  // Hàm đăng nhập vào Messenger
  const login = async () => {
    try {
      await page.waitForSelector('input[name="email"]', { timeout: 5000 });
      await page.type('input[name="email"]', 'az9906159@gmail.com');
      await page.type('input[name="pass"]', 'Abcd!!1234');
      await page.keyboard.press('Enter');

      // Chờ để đảm bảo đăng nhập thành công
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      console.log('Đăng nhập thành công.');
      return true; // Đăng nhập thành công
    } catch (error) {
      console.log('Đăng nhập không thành công, thử lại...');
      return false; // Đăng nhập không thành công
    }
  };

  // Thử đăng nhập lại nếu chưa thành công
  let loginSuccess = false;
  const maxRetries = 3;
  let attempts = 0;

  while (!loginSuccess && attempts < maxRetries) {
    loginSuccess = await login();
    attempts++;
    if (!loginSuccess) {
      // Nếu không thành công, chờ một chút trước khi thử lại
      await page.waitForTimeout(5000);
    }
  }

  if (!loginSuccess) {
    console.log('Không thể đăng nhập sau nhiều lần thử.');
    await browser.close();
    return;
  }

  // Điều hướng đến cuộc trò chuyện cụ thể
  await page.goto('https://www.messenger.com/t/5429678400420468/', { waitUntil: 'networkidle2' });

  // Khai báo và khởi tạo biến cờ
  let codeEntered = false;
  let buttonClicked = false;

  // Liên tục kiểm tra và thực hiện các hành động
  const interval = setInterval(async () => {
    try {
      // Kiểm tra và điền mã vào ô input nếu nó xuất hiện
      const inputSelector = 'input#mw-numeric-code-input-prevent-composer-focus-steal';
      const inputElement = await page.$(inputSelector);
      
      if (inputElement && !codeEntered) {
        await page.type(inputSelector, '252588');
        codeEntered = true; // Đánh dấu rằng mã đã được điền
        console.log('Đã điền mã vào ô input.');
      }

      // Kiểm tra và nhấp vào nút nếu nó xuất hiện
      const buttonSelector = 'div[aria-label="See Conversation"]';
      const buttonElement = await page.$(buttonSelector);
      
      if (buttonElement && !buttonClicked) {
        await buttonElement.click();
        buttonClicked = true; // Đánh dấu rằng nút đã được nhấp
        console.log('Đã nhấp vào nút "See Conversation".');
      } else if (buttonClicked) {
        console.log('Nút "See Conversation" đã được nhấp.');
      }

      // Nếu nút đã được nhấp, dừng kiểm tra
      if (buttonClicked) {
        clearInterval(interval);
        console.log('Dừng kiểm tra vì nút đã được nhấp.');
      }

      // Kiểm tra tin nhắn mới và xử lý
      const messages = await page.evaluate(() => {
        const messageElements = document.querySelectorAll('div[class*="html-div"]'); // Thay đổi selector theo trang Messenger
        return Array.from(messageElements).map(el => el.innerText);
      });

      // Xử lý và gửi tin nhắn nếu thỏa mãn điều kiện
      const filteredMessages = messages.filter(message => message.startsWith('!GPT Lộc Ngu'));
      if (filteredMessages.length > 0) {
        console.log('Tin nhắn thỏa mãn điều kiện:', filteredMessages);

        // Gửi tin nhắn phản hồi
        const chatInputSelector = 'div[aria-label="Message"]'; // Thay đổi selector theo ô chat
        const sendButtonSelector = 'div[aria-label="Press Enter to send"]'; // Thay đổi selector theo nút gửi

        await page.focus(chatInputSelector);
        await page.type(chatInputSelector, 'Vâng, lộc không những ngu mà còn hay lí do!');
        await page.click(sendButtonSelector);
        console.log('Đã gửi tin nhắn phản hồi.');

        // Dừng kiểm tra sau khi đã gửi tin nhắn
  
        console.log('Dừng kiểm tra vì đã gửi tin nhắn.');
      }

    } catch (error) {
      console.error('Lỗi khi kiểm tra và thực hiện các hành động:', error);
    }
  }, 5000); // Kiểm tra mỗi 5 giây

  // Để giữ trình duyệt mở
  console.log('Trình duyệt đang chạy và kiểm tra tin nhắn.');

  // Đóng trình duyệt sau khi hoàn tất (hoặc giữ mở tùy theo nhu cầu)
  // await browser.close();
})();
