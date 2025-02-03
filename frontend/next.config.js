require('dotenv').config();

module.exports = {
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.BACKEND_URL    
  }
};