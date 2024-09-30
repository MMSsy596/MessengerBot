const FB = require('fb');

// Đặt Access Token đã lấy được từ Facebook
FB.setAccessToken('EAAR9uoSQI2ABO7gfBn5ZC6dj9HsNMYAcnwS0FZBYTNp1A20OYf3vSbg8lttGaMyxoeW6az8ZApdq9ltoZAaBX6xgZAUkiFGJZAKxhsBsBAr0nLTlPp7SpNQElnebS9GhThlTp5vTfYl8QbJ78y04hCyq7DEgqx0QIjZCv8OdTj8OJyA7Kx3eiHDmR02bduZB9WWZA0iAMvzIsFvhdcBZC58ZBFr8ZBOT3CPZAynRphkUxBaFcGiuRBgCebKkr2QtaDAdBQQZDZD'); // Thay 'your-access-token-here' bằng Access Token của bạn

// Lấy thông tin hồ sơ của người dùng
FB.api('/me', { fields: 'id,name,email' }, function(response) {
  if (!response || response.error) {
    console.log('Lỗi khi gọi API:', response.error);
  } else {
    console.log('Thông tin người dùng:', response);
  }
});
