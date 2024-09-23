import axios from 'axios';

class Api {
  constructor() {
    this.apiUrl = 'https://smmvip.net/api/v2'; // API URL
    this.apiKey = '78de06f7b8728f19e588531d44dfe11c'; // Your API key
  }

  async order(data) {
    // Add order
    const postData = {
      key: this.apiKey,
      action: 'add',
      ...data
    };
    return this.connect(postData);
  }

  async connect(postData) {
    try {
      const response = await axios.post(this.apiUrl, new URLSearchParams(postData).toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error making request:', error);
      return false;
    }
  }
}

export default Api;
