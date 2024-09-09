const axios = require('axios');

// API key của bạn từ OpenAI
const CHATGPT_API_KEY = 'sk-uFEDHlVNcDnW_yuSDkbaNzU_htyGzapaIiBRaQq8YQT3BlbkFJAupZrNjXicSPkicPHKOwXgDee1DF8TvItKDpt-LpUA'; // Thay thế bằng API Key của bạn
const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions'; // URL của ChatGPT API

const getChatGptResponse = async (message, retries = 1) => {
  try {
    const response = await axios.post(CHATGPT_API_URL, {
        model: "gpt-3.5-turbo", // Thay đổi mô hình nếu cần
        messages: [
        { role: "user", content: message }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${CHATGPT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      console.log('Nhận lỗi 429, thử lại sau 30 giây...');
      await new Promise(resolve => setTimeout(resolve, 30000)); // Đợi 30 giây
      return getChatGptResponse(message, retries - 1);
    } else {
      console.error('Lỗi khi gửi tin nhắn tới ChatGPT:', error);
      return null;
    }
  }
};

// Ví dụ về cách sử dụng hàm
(async () => {
  const userMessage = "Hello, how are you?"; // Tin nhắn của người dùng
  const chatGptResponse = await getChatGptResponse(userMessage);
  console.log('Kết quả từ ChatGPT:', chatGptResponse);
})();
