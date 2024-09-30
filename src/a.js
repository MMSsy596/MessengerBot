const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

// Khóa API ChatGPT
const OPENAI_API_KEY = "sk-ivK_5U7IMb2dYwBxgwMUdVD-G0mIAiAore5TEDeb_iT3BlbkFJkFT7jyghSQ4AD2IEWC_K6oUxVfJGN5_f06ejg_8hUA";

// Hàm để gọi API ChatGPT
async function getChatGPTResponse(userMessage) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        prompt: userMessage,
        max_tokens: 100,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const gptResponse = response.data.choices[0].text.trim();
    console.log('Phản hồi từ ChatGPT:', gptResponse);
    return gptResponse;
  } catch (error) {
    console.error('Lỗi khi gọi API ChatGPT:', error);
    return '';
  }
}

// Hàm sử dụng Puppeteer để truy cập trang và gửi tin nhắn
async function sendMessageWithPuppeteer(url, message) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  // Tìm ô nhập tin nhắn trên trang
  const chatInputSelector = 'div[aria-label="Message"]'; // Chỉnh selector tùy thuộc vào trang web
  const sendButtonSelector = 'div[aria-label="Press Enter to send"]';

  // Nhập tin nhắn và gửi đi
  await page.type(chatInputSelector, message);
  await page.click(sendButtonSelector);

  console.log('Đã gửi tin nhắn: ', message);
  await browser.close();
}

// Hàm chính để tích hợp cả ChatGPT và Puppeteer
(async () => {
  const userMessage = 'Hello, can you help me with something?';
  
  // Gọi API ChatGPT để lấy phản hồi
  const chatGPTMessage = await getChatGPTResponse(userMessage);

  // Gửi tin nhắn bằng Puppeteer (ví dụ: vào Messenger hoặc một nền tảng khác)
  const targetURL = 'https://www.messenger.com'; // URL của trang web bạn muốn tự động hóa
//   await sendMessageWithPuppeteer(targetURL, chatGPTMessage);
console.log(chatGPTMessage);
})();
