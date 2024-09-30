const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');


const filePath = path.join(__dirname, 'note.txt');

//delay
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// function typetext
async function typeText(page, text) {
  for (const char of text) {
    await page.keyboard.press(char);
  }
}

(async () => {
  // Đường dẫn đến Microsoft Edge
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

  // Khởi động trình duyệt Edge
  const browser = await puppeteer.launch({
    headless: false, // Đặt 'headless: false' để thấy trình duyệt
    executablePath: edgePath, // Đường dẫn đến trình duyệt Edge
    // args: ['--start-maximized'], // Khởi động trình duyệt ở chế độ tối đa hóa
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

  function processAndSave(command) {
    // Kiểm tra xem lệnh có đúng định dạng !add.key:nội dung không
    if (command.startsWith('!add.')) {
      // Tách lấy phần key và nội dung
      const [keyPart, valuePart] = command.replace('!add.', '').split(':');

      if (keyPart && valuePart) {
        // Ghép thành chuỗi key:nội dung
        const entry = `${keyPart}:${valuePart}\n`;

        // Đường dẫn đến file log
        const filePath = path.join(__dirname, 'note.txt');

        fs.appendFileSync(filePath, entry);
        console.log('Đã lưu tin nhắn vào file log:', entry);
        // Ghi vào file
        fs.appendFile(filePath, entry, (err) => {
          if (err) {

            console.error('Lỗi khi ghi vào file:', err);
          } else {
            console.log('Đã lưu:', entry);
          }
        });
      } else {
        console.error('Định dạng lệnh không hợp lệ.');
      }
    } else {
      console.error('Lệnh không hợp lệ.');
    }
  }

  //in lỗi lênchat
  async function sendMessageToChat(page, message) {
    const chatInputSelector = 'div[aria-label="Message"]'; // Thay đổi selector theo ô chat
    const sendButtonSelector = 'div[aria-label="Press Enter to send"]'; // Thay đổi selector theo nút gửi

    try {
      await page.focus(chatInputSelector);
      await page.type(chatInputSelector, message);
      await page.click(sendButtonSelector);
      console.log('Đã gửi tin nhắn phản hồi.');
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
    }
  }

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
      const logFilePath = path.join(logDirectory, `vmq${currentDate}_log.txt`);

      // Kiểm tra nếu tin nhắn cuối cùng không trùng với tin nhắn trước đó trong file
      let previousMessage = '';
      let prepreviousMessage = '';

      if (fs.existsSync(logFilePath)) {
        const logData = fs.readFileSync(logFilePath, 'utf8');
        const logLines = logData.trim().split('\n');
        previousMessage = logLines[logLines.length - 1];
        prepreviousMessage = logLines[logLines.length - 2];
      }

           

      if (''+lastMessage !== previousMessage) {

        console.log(lastMessage+'/n',prepreviousMessage)
        // Thêm tin nhắn cuối cùng vào file log
        fs.appendFileSync(logFilePath, ''+lastMessage + '\n', 'utf8');
        console.log('Đã lưu tin nhắn vào file log:', lastMessage);


                  // Kiểm tra key không cần !, #

        if (lastMessage !== prepreviousMessage) {
          // console.log(lastMessage, '   ', prepreviousMessage);
  
          const filePath = path.join(__dirname, 'note.txt');
  
          // Đọc nội dung file note.txt
          fs.readFile(filePath, 'utf8', async (err, data) => {
              if (err) {
                  console.error('Lỗi khi đọc file note:', err);
              } else {
                  const lines = data.split('\n');
                  // Tìm dòng có key khớp với lastMessage
                  const foundEntry = lines.find(line => line.startsWith(`${messageContent}:`));
                  
                  console.log(foundEntry);
  
                  if (foundEntry) {
                      const value = foundEntry.split(':')[1]; // Lấy phần value sau dấu :
                      sleep(1000);//chờ key bên ngoài note thực hiện
                      await sendMessageToChat(page, value);
                      console.log(value);
                  }
              }
          });
       }

      }
    else {

        console.log('Tin nhắn trùng với tin nhắn trước đó, không lưu vào file.');
      }
      // const lastMessageParts = lastMessage.split('\n');
      // const messageContent1 = lastMessageParts.length > 1 ? lastMessageParts[1] : lastMessage;
      // console.log('Nội dung tin nhắn sau ký tự "\\n":', messageContent1);


      if (messageContent.startsWith('Lộc ngu') || messageContent.startsWith('lộc ngu') || messageContent.startsWith('lặc cộc') || messageContent.startsWith('Lặc cộc')) {

        // Gửi tin nhắn phản hồi
        const chatInputSelector = 'div[aria-label="Message"]'; // Thay đổi selector theo ô chat
        const sendButtonSelector = 'div[aria-label="Press Enter to send"]'; // Thay đổi selector theo nút gửi

        await page.focus(chatInputSelector);
        await page.type(chatInputSelector, ' lộc ngu');
        await page.click(sendButtonSelector);
        await page.type(chatInputSelector, ' lộc ngu');
        await page.click(sendButtonSelector);
        await page.type(chatInputSelector, ' lộc ngu');
        await page.click(sendButtonSelector);
        await page.type(chatInputSelector, ' cái gì quan trọng phải nhắc 3 lần');
        await page.click(sendButtonSelector);
        console.log('Đã gửi tin nhắn phản hồi.');

        // Dừng kiểm tra sau khi đã gửi tin nhắn
        clearInterval(interval);
        console.log('Dừng kiểm tra vì đã gửi tin nhắn.');



      }


      // in list note
      if (messageContent === '#note') {
        // Đọc nội dung file log
        fs.readFile(filePath, 'utf8', async (err, data) => {
            if (err) {
                console.error('Lỗi khi đọc file log:', err);
                return;
            }

            // Gửi nội dung file log vào khung chat
            await sendMessageToChat(page, data);
            console.log('Đã gửi nội dung file log vào khung chat:', data);
        });
    }
      if (messageContent.startsWith('!GPT log')) {
        if (lastMessage.startsWith('Hốc Trưởng')|| lastMessage.startsWith('Đángiuu')|| lastMessage.startsWith('Đángiuu')){
        // Gửi tin nhắn phản hồi
        const logFileName = `vmq${currentDate}_log.txt`;

        // Đọc nội dung file log
        fs.readFile(logFilePath, 'utf8', async (err, data) => {
          if (err) {
            console.error('Lỗi khi đọc file log:', err);
          } else {
            const chatInputSelector = 'div[aria-label="Message"]';
            const sendButtonSelector = 'div[aria-label="Press Enter to send"]';

            // Gửi từng dòng trong file log
            const logLines = data.split('\n');
            if(logLines <20){
     for (const line of logLines) {
              if (line.trim()) {
                await page.focus(chatInputSelector);
                await page.type(chatInputSelector, line);
                await page.click(sendButtonSelector);
                console.log('Đã gửi dòng log:', line);

              }
            }
            }else{
              await page.focus(chatInputSelector);
              await page.type(chatInputSelector, 'tự xem đi, dài thế gửi để bị cấm chat à😎😎😎');
              await page.click(sendButtonSelector);
            }
       
          }
        });
      }else{
        const chatInputSelector = 'div[aria-label="Message"]';
        const sendButtonSelector = 'div[aria-label="Press Enter to send"]';
        await page.focus(chatInputSelector);
        await page.type(chatInputSelector, ' nạp vip để sử dụng');
        await page.click(sendButtonSelector);
      }


      }

      if (messageContent.startsWith('ngu')) {

        // Gửi tin nhắn phản hồi
        const chatInputSelector = 'div[aria-label="Message"]'; // Thay đổi selector theo ô chat
        const stickerInputSelector = 'div[aria-label="Search stickers"]'; // Thay đổi selector theo ô chat

        const sendButtonSelector = 'div[aria-label="Press Enter to send"]'; // Thay đổi selector theo nút gửi
        const stickerbuttonSelector = 'div[aria-label="Choose a sticker"]'; // Thay đổi selector theo ô chat
        const fool = 'div[aria-label="Mugsy Cartoon of Mugsy - a French bull dog - looking annoyed. His palm is resting on his forehead.  sticker"]'; // Thay đổi selector theo ô chat


        await page.focus(chatInputSelector);


        await page.type(chatInputSelector, '.nguconcac, phong céch!😀😀😀');
        await page.click(sendButtonSelector);  
        await sleep(1000);

        await page.click(stickerbuttonSelector);
        // await page.focus(stickerInputSelector);
        await sleep(1000);
        await typeText(page, 'fool');

        await sleep(1000);

        await page.click(fool);  
        await page.focus(fool);  

        console.log('Đã gửi tin nhắn phản hồi.');

        // Dừng kiểm tra sau khi đã gửi tin nhắn
        clearInterval(interval);
        console.log('Dừng kiểm tra vì đã gửi tin nhắn.');
      }

      //hưng

      if (messageContent.startsWith('hưng')) {

        // Gửi tin nhắn phản hồi
        const chatInputSelector = 'div[aria-label="Message"]'; // Thay đổi selector theo ô chat
        const sendButtonSelector = 'div[aria-label="Press Enter to send"]'; // Thay đổi selector theo nút gửi

        await page.focus(chatInputSelector);
        await page.type(chatInputSelector, ' hưng rùa');
        await page.click(sendButtonSelector);
        console.log('Đã gửi tin nhắn phản hồi.');

        // Dừng kiểm tra sau khi đã gửi tin nhắn
        clearInterval(interval);
        console.log('Dừng kiểm tra vì đã gửi tin nhắn.');
      }
      //add key
      if (messageContent.startsWith('!add')) {

        console.log('Kiem tra phat hien add.');
        if (messageContent.startsWith('!add.')) {
          // Tách lấy phần key và nội dung
          const [keyPart, valuePart] = messageContent.replace('!add.', '').split(',');
          const chatInputSelector = 'div[aria-label="Message"]'; // Thay đổi selector theo ô chat
          const sendButtonSelector = 'div[aria-label="Press Enter to send"]'; // Thay đổi selector theo nút gửi

          if (keyPart && valuePart) {
            // Ghép thành chuỗi key:nội dung
            const entry = `${keyPart}:${valuePart}\n`;

            // Đường dẫn đến file log
            const filePath = path.join(__dirname, 'note.txt');

            // fs.appendFileSync(filePath, entry);
            // console.log('Đã lưu tin nhắn vào file log:', entry);
            // Ghi vào file
            fs.appendFile(filePath, entry, (err) => {
              if (err) {
                // sendMessageToChat(page, 'Lỗi khi ghi vào file:', err);
                console.error('Lỗi khi ghi vào file:', err);
              } else {
                console.log('Đã lưu:', entry);
              }
            });
          } else {
            //  sendMessageToChat(page,'Định dạng lệnh không hợp lệ.');

            console.error('Định dạng lệnh không hợp lệ.');
          }
        } else {
          // sendMessageToChat(page,'Lệnh không hợp lệ.');

          console.error();
        }

        // Gửi tin nhắn phản hồi
        const chatInputSelector = 'div[aria-label="Message"]'; // Thay đổi selector theo ô chat
        const sendButtonSelector = 'div[aria-label="Press Enter to send"]'; // Thay đổi selector theo nút gửi

        await page.focus(chatInputSelector);
        await page.type(chatInputSelector, 'thêm '+ lastMessage.replace('!add.', ''));
        await page.click(sendButtonSelector);
        console.log('Đã gửi tin nhắn phản hồi.');

        // Dừng kiểm tra sau khi đã gửi tin nhắn
        clearInterval(interval);
        console.log('Dừng kiểm tra vì đã gửi tin nhắn.');
      }

      if (messageContent.startsWith('ngu')) {

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
      if (messageContent.startsWith('hoàng') || messageContent.startsWith('Hoàng')) {

        // Gửi tin nhắn phản hồi
        const chatInputSelector = 'div[aria-label="Message"]'; // Thay đổi selector theo ô chat
        const sendButtonSelector = 'div[aria-label="Press Enter to send"]'; // Thay đổi selector theo nút gửi

        await page.focus(chatInputSelector);
        await page.type(chatInputSelector, ' .Hoàngl');
        await page.click(sendButtonSelector);
        console.log('Đã gửi tin nhắn phản hồi.');

        // Dừng kiểm tra sau khi đã gửi tin nhắn
        clearInterval(interval);
        console.log('Dừng kiểm tra vì đã gửi tin nhắn.');
      }
      if (messageContent.startsWith('hảiii')) {

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
      } 
      if (messageContent.startsWith('Mai')) {

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

      //meet
      if (messageContent.startsWith('meet') || messageContent.startsWith('Meet')) {

        // Gửi tin nhắn phản hồi
        const chatInputSelector = 'div[aria-label="Message"]'; // Thay đổi selector theo ô chat
        const sendButtonSelector = 'div[aria-label="Press Enter to send"]'; // Thay đổi selector theo nút gửi

        await page.focus(chatInputSelector);
        await page.type(chatInputSelector, 'https://meet.google.com/msy-jdrn-qsn');
        await page.click(sendButtonSelector);
        console.log('Đã gửi tin nhắn phản hồi.');

        // Dừng kiểm tra sau khi đã gửi tin nhắn
        clearInterval(interval);
        console.log('Dừng kiểm tra vì đã gửi tin nhắn.');

      }
      if (messageContent.startsWith('!dậy đi ông cháu ơi')) {

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
      if (messageContent.startsWith('ngu vc')) {

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

      //in note
      // if (messageContent.startsWith('#')) {

      //   // Gửi tin nhắn phản hồi
      //   const logFileName = `vmq${currentDate}_log.txt`;

      //   // Đọc nội dung note
      //   const filePath = path.join(__dirname, 'note.txt');

      //   fs.readFile(filePath, 'utf8', async (err, data) => {
      //     if (err) {
      //       console.error('Lỗi khi đọc file note:', err);
      //     } else {
      //       const chatInputSelector = 'div[aria-label="Message"]';
      //       const sendButtonSelector = 'div[aria-label="Press Enter to send"]';

      //       // tim key trong file note
      //       const logLines = data.split('\n');
      //       const key = messageContent.slice(1);
      //       const lines = data.split('\n');
      //       const foundEntry = lines.find(line => line.startsWith(`${key}:`));

      //       if (foundEntry) {
      //         const value = foundEntry.split(':')[1];
      //         await sendMessageToChat(page, value);
      //       } else {
      //         await sendMessageToChat(page, `Không tìm thấy giá trị cho key: ${key}`);
      //       }
      //     }
      //   });
      // }

      if (messageContent.startsWith('gọi hải') || messageContent.startsWith('hải đâu') || messageContent.startsWith('gọi Hải') || messageContent.startsWith('Hải đâu')) {

        // Gửi tin nhắn phản hồi
        const chatInputSelector = 'div[aria-label="Message"]'; // Thay đổi selector theo ô chat
        const sendButtonSelector = 'div[aria-label="Press Enter to send"]'; // Thay đổi selector theo nút gửi
        messageContent.slice(4);
        await page.focus(chatInputSelector);
        await page.type(chatInputSelector, ' @Béhải Xinhđẹp Đángiuu');
        await page.keyboard.press('Tab');

        await page.click(sendButtonSelector);
        console.log('Đã gửi tin nhắn phản hồi.');

        // Dừng kiểm tra sau khi đã gửi tin nhắn
        clearInterval(interval);
        console.log('Dừng kiểm tra vì đã gửi tin nhắn.');
      }

      //goi meo

      if (messageContent.startsWith('gọi mèo') || messageContent.startsWith('mèo đâu') ) {

        // Gửi tin nhắn phản hồi
        const chatInputSelector = 'div[aria-label="Message"]'; // Thay đổi selector theo ô chat
        const sendButtonSelector = 'div[aria-label="Press Enter to send"]'; // Thay đổi selector theo nút gửi
        await page.focus(chatInputSelector);
        await page.type(chatInputSelector, ' @Annh');
        await page.keyboard.press('Tab');

        await page.click(sendButtonSelector);
        console.log('Đã gửi tin nhắn phản hồi.');

        // Dừng kiểm tra sau khi đã gửi tin nhắn
        clearInterval(interval);
        console.log('Dừng kiểm tra vì đã gửi tin nhắn.');
      }

      //goi mai
      if (messageContent.startsWith('gọi mai') || messageContent.startsWith('mai đâu') || messageContent.startsWith('gọi Mai') || messageContent.startsWith('Mai đâu')) {

        // Gửi tin nhắn phản hồi
        const chatInputSelector = 'div[aria-label="Message"]'; // Thay đổi selector theo ô chat
        const sendButtonSelector = 'div[aria-label="Press Enter to send"]'; // Thay đổi selector theo nút gửi
        messageContent.slice(4);
        await page.focus(chatInputSelector);
        await page.type(chatInputSelector, ' @xinh đẹp tuyệt vời ', messageContent);
        await page.keyboard.press('Tab');

        await page.click(sendButtonSelector);
        console.log('Đã gửi tin nhắn phản hồi.');

        // Dừng kiểm tra sau khi đã gửi tin nhắn
        clearInterval(interval);
        console.log('Dừng kiểm tra vì đã gửi tin nhắn.');
      }

      // in note 
     
    } catch (error) {
      console.error('Lỗi khi lấy tin nhắn:', error);
    }


  }, 1000); // Kiểm tra mỗi 5 giây

  // Thực hiện các hành động khác hoặc giữ trình duyệt mở
  console.log('Trình duyệt đang chạy và kiểm tra tin nhắn.');

  //   Để giữ trình duyệt mở
  //   await browser.close(); // Đóng trình duyệt nếu bạn muốn kết thúc ngay lập tức
})();
