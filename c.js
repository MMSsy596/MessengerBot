const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  // Đường dẫn đến Microsoft Edge
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

  // Khởi động trình duyệt Edge
  const browser = await puppeteer.launch({
    headless: false, // Đặt 'headless: false' để thấy trình duyệt
    executablePath: edgePath, // Đường dẫn đến trình duyệt Edge
    // args: ['--start-maximized'], // Khởi động trình duyệt ở chế độ tối đa hóas
  });

  const page = await browser.newPage();

  // Điều hướng đến Messenger
  await page.goto('https://www.messenger.com/', { waitUntil: 'networkidle2' });

  // Đăng nhập vào Messenger (nếu cần)
  try {
    await page.waitForSelector('input[name="email"]', { timeout: 5000 });
    await page.type('input[name="email"]', 'az9906159@gmail.com');
    await page.type('input[name="pass"]', 'Abcd!!1234');
    await page.keyboard.press('Enter');
    
    // Chờ để đảm bảo đăng nhập thành công
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('Đăng nhập thành công.');
  } catch (error) {
    console.log('Đăng nhập không thành công hoặc không cần thiết.');
  }

  

  // Điều hướng đến cuộc trò chuyện cụ thể
  await page.goto('https://www.messenger.com/t/5429678400420468', { waitUntil: 'networkidle2' });
  // await page.goto('https://www.messenger.com/t/100034047354340', { waitUntil: 'networkidle2' });

  let codeEntered = false;

  let buttonClicked = false;
  let buttonClicked1 = false;
   // Liên tục kiểm tra và nhấp vào nút nếu nó xuất hiện
   setInterval(async () => {
    try {
        // Kiểm tra và điền mã vào ô input nếu nó xuất hiện
        // const inputSelector = 'input#mw-numeric-code-input-prevent-composer-focus-steal';
        // const inputElement = await page.$(inputSelector);
        
        // if (inputElement && !codeEntered) {
        //   await page.type(inputSelector, '252588');
        //   codeEntered = true; // Đánh dấu rằng mã đã được điền
        //   console.log('Đã điền mã vào ô input.');
        // }
  
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

        const buttonSelectorClose = 'div[aria-label="Close"]';
        const buttonElementClose = await page.$(buttonSelectorClose);
        if (buttonElementClose && !buttonClicked1) {
            await buttonElementClose.click();
            buttonClicked1 = true; // Đánh dấu rằng nút đã được nhấp
            console.log('Đã nhấp vào nút "close".');
          } else if (buttonClicked) {
            console.log('Nút " close" đã được nhấp.');
          }
  
      } catch (error) {
        console.error('Lỗi khi kiểm tra và thực hiện các hành động:', error);
      }
    }, 5000); // Kiểm tra mỗi 5 giây
  
    // Để giữ trình duyệt mở
    console.log('Trình duyệt đang chạy và kiểm tra ô input và nút.');
  

  // Liên tục kiểm tra tin nhắn mới
  setInterval(async () => {
    try {
      // Chọn các tin nhắn mới bằng cách xác định selector phù hợp
      const messages = await page.evaluate(() => {
        const messageElements = document.querySelectorAll('div[class*="html-div xexx8yu x4uap5 x18d9i69 xkhd6sd x1gslohp x11i5rnm x12nagc x1mh8g0r x1yc453h x126k92a x18lvrbx"]'); // Thay đổi selector theo trang Messenger
        const messageElements1 = document.querySelectorAll('div[class*="x78zum5 xdt5ytf x1n2onr6"]'); // Thay đổi selector theo trang Messenger

        return Array.from(messageElements1).map(el => el.innerText);
        return Array.from(messageElements1).map(el => el.innerText);

      });

      
      const transformedMessages = messages.map(message => message.replace(/\n/g, ':'));

      // Hiển thị mảng mới đã được chuyển đổi
      console.log('Mảng mới sau khi chuyển đổi:', transformedMessages);
      // Hiển thị tin nhắn mới nhận được
      // console.log('Tin nhắn mới nhận được:', messages);
      const lastMessage = transformedMessages[messages.length - 1]; // Lấy tin nhắn cuối cùng
      console.log('Tin nhắn mới cuối cùng nhận được:', lastMessage);
      const lastMessageParts = lastMessage.split(':');
      const messageContent = lastMessageParts.length > 1 ? lastMessageParts[1] : lastMessage;
      console.log('Nội dung tin nhắn sau ký tự ": ":', messageContent);
      const logDirectory = path.join(__dirname); // Thư mục hiện tại
const currentDate = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại (yyyy-mm-dd)
const logFilePath = path.join(logDirectory, `test${currentDate}_log.txt`);

// Kiểm tra nếu tin nhắn cuối cùng không trùng với tin nhắn trước đó trong file
let previousMessage = '';

if (fs.existsSync(logFilePath)) {
    const logData = fs.readFileSync(logFilePath, 'utf8');
    const logLines = logData.trim().split('\n');
    previousMessage = logLines[logLines.length - 1];
}

if (lastMessage !== previousMessage) {
    // Thêm tin nhắn cuối cùng vào file log
    fs.appendFileSync(logFilePath, lastMessage + '\n', 'utf8');
    console.log('Đã lưu tin nhắn vào file log:', lastMessage);
} else {
    console.log('Tin nhắn trùng với tin nhắn trước đó, không lưu vào file.');
}
      // const lastMessageParts = lastMessage.split('\n');
      // const messageContent1 = lastMessageParts.length > 1 ? lastMessageParts[1] : lastMessage;
      // console.log('Nội dung tin nhắn sau ký tự "\\n":', messageContent1);
    

  if (messageContent.startsWith('!GPT Lộc ngu')){

        // Gửi tin nhắn phản hồi
        const chatInputSelector = 'div[aria-label="Message"]'; // Thay đổi selector theo ô chat
        const sendButtonSelector = 'div[aria-label="Press Enter to send"]'; // Thay đổi selector theo nút gửi

        await page.focus(chatInputSelector);
        await page.type(chatInputSelector, 'Vâng, lộc không những ngu mà con hay lí do!');
        await page.click(sendButtonSelector);
        console.log('Đã gửi tin nhắn phản hồi.');

        // Dừng kiểm tra sau khi đã gửi tin nhắn
        clearInterval(interval);
        console.log('Dừng kiểm tra vì đã gửi tin nhắn.');
        
      }
      if (messageContent.startsWith('nsan')){

        // Gửi tin nhắn phản hồi
        const chatInputSelector = 'div[aria-label="Message"]'; // Thay đổi selector theo ô chat
        const sendButtonSelector = 'div[aria-label="Press Enter to send"]'; // Thay đổi selector theo nút gửi

        await page.focus(chatInputSelector);
        await page.type(chatInputSelector, 'là con heo, là con heo!!!');
        await page.click(sendButtonSelector);
        console.log('Đã gửi tin nhắn phản hồi.');

        // Dừng kiểm tra sau khi đã gửi tin nhắn
        clearInterval(interval);
        console.log('Dừng kiểm tra vì đã gửi tin nhắn.');
        
      }
      if (messageContent.startsWith('ngu')){

        // Gửi tin nhắn phản hồi
        const chatInputSelector = 'div[aria-label="Message"]'; // Thay đổi selector theo ô chat
        const sendButtonSelector = 'div[aria-label="Press Enter to send"]'; // Thay đổi selector theo nút gửi

        await page.focus(chatInputSelector);
        await page.type(chatInputSelector, '!nguconcac, phong céch!');
        await page.click(sendButtonSelector);
        console.log('Đã gửi tin nhắn phản hồi.');

        // Dừng kiểm tra sau khi đã gửi tin nhắn
        clearInterval(interval);
        console.log('Dừng kiểm tra vì đã gửi tin nhắn.');
      }
      if (messageContent.startsWith('!GPT Hoàngl')){

        // Gửi tin nhắn phản hồi
        const chatInputSelector = 'div[aria-label="Message"]'; // Thay đổi selector theo ô chat
        const sendButtonSelector = 'div[aria-label="Press Enter to send"]'; // Thay đổi selector theo nút gửi

        await page.focus(chatInputSelector);
        await page.type(chatInputSelector, 'Vâng, Hoàngl!');
        await page.click(sendButtonSelector);
        console.log('Đã gửi tin nhắn phản hồi.');

        // Dừng kiểm tra sau khi đã gửi tin nhắn
        clearInterval(interval);
        console.log('Dừng kiểm tra vì đã gửi tin nhắn.');
      }
      if (messageContent.startsWith('!GPT hảiii')){

        // Gửi tin nhắn phản hồi
        const chatInputSelector = 'div[aria-label="Message"]'; // Thay đổi selector theo ô chat
        const sendButtonSelector = 'div[aria-label="Press Enter to send"]'; // Thay đổi selector theo nút gửi

        await page.focus(chatInputSelector);
        await page.type(chatInputSelector, 'Hốc trưởng đẹp traiii!');
        await page.click(sendButtonSelector);
        console.log('Đã gửi tin nhắn phản hồi.');

        // Dừng kiểm tra sau khi đã gửi tin nhắn
        clearInterval(interval);
        console.log('Dừng kiểm tra vì đã gửi tin nhắn.');
      }if (messageContent.startsWith('!GPT Mai')){

        // Gửi tin nhắn phản hồi
        const chatInputSelector = 'div[aria-label="Message"]'; // Thay đổi selector theo ô chat
        const sendButtonSelector = 'div[aria-label="Press Enter to send"]'; // Thay đổi selector theo nút gửi

        await page.focus(chatInputSelector);
        await page.type(chatInputSelector, 'Xinh dep tuyet voi');
        await page.click(sendButtonSelector);
        console.log('Đã gửi tin nhắn phản hồi.');

        // Dừng kiểm tra sau khi đã gửi tin nhắn
        clearInterval(interval);
        console.log('Dừng kiểm tra vì đã gửi tin nhắn.');
      
      }
      if (messageContent.startsWith('!dậy')){

        // Gửi tin nhắn phản hồi
        const chatInputSelector = 'div[aria-label="Message"]'; // Thay đổi selector theo ô chat
        const sendButtonSelector = 'div[aria-label="Press Enter to send"]'; // Thay đổi selector theo nút gửi

        await page.focus(chatInputSelector);
        await page.type(chatInputSelector, 'Dậy mẹ m đi!');
        await page.click(sendButtonSelector);
        console.log('Đã gửi tin nhắn phản hồi.');

        // Dừng kiểm tra sau khi đã gửi tin nhắn
        clearInterval(interval);
        console.log('Dừng kiểm tra vì đã gửi tin nhắn.');
      }
      if (messageContent.startsWith('ngu vc')){

        // Gửi tin nhắn phản hồi
        const chatInputSelector = 'div[aria-label="Message"]'; // Thay đổi selector theo ô chat
        const sendButtonSelector = 'div[aria-label="Press Enter to send"]'; // Thay đổi selector theo nút gửi

        await page.focus(chatInputSelector);
        await page.type(chatInputSelector, 'ngu con c, phong cách!!!');
        await page.click(sendButtonSelector);
        console.log('Đã gửi tin nhắn phản hồi.');

        // Dừng kiểm tra sau khi đã gửi tin nhắn
        clearInterval(interval);
        console.log('Dừng kiểm tra vì đã gửi tin nhắn.');
      }
    } catch (error) {
      console.error('Lỗi khi lấy tin nhắn:', error);
    }
 
   
  }, 5000); // Kiểm tra mỗi 5 giây

  // Thực hiện các hành động khác hoặc giữ trình duyệt mở
  console.log('Trình duyệt đang chạy và kiểm tra tin nhắn.');

//   Để giữ trình duyệt mở
//   await browser.close(); // Đóng trình duyệt nếu bạn muốn kết thúc ngay lập tức
})();
