import axios from 'axios';

class Api {
    constructor() {
        this.api_url = 'https://smmvip.net/api/v2';  // API URL
        this.api_key = '735c80aa610796c05a784a9a0a5a4189';  // Your API key
    }

    // Add order
    async order(data) {
        const postData = { key: this.api_key, action: 'add', ...data };
        return this.connect(postData);
    }

    // Get order status
    async status(orderId) {
        const postData = {
            key: this.api_key,
            action: 'status',
            order: orderId
        };
        return this.connect(postData);
    }

    // Get orders status
    async multiStatus(orderIds) {
        const postData = {
            key: this.api_key,
            action: 'status',
            orders: orderIds.join(',')
        };
        return this.connect(postData);
    }

    // Get services
    async services() {
        const postData = {
            key: this.api_key,
            action: 'services',
        };
        return this.connect(postData);
    }

    // Refill order
    async refill(orderId) {
        const postData = {
            key: this.api_key,
            action: 'refill',
            order: orderId
        };
        return this.connect(postData);
    }

    // Refill orders
    async multiRefill(orderIds) {
        const postData = {
            key: this.api_key,
            action: 'refill',
            orders: orderIds.join(',')
        };
        return this.connect(postData);
    }

    // Get refill status
    async refillStatus(refillId) {
        const postData = {
            key: this.api_key,
            action: 'refill_status',
            refill: refillId
        };
        return this.connect(postData);
    }

    // Get refill statuses
    async multiRefillStatus(refillIds) {
        const postData = {
            key: this.api_key,
            action: 'refill_status',
            refills: refillIds.join(',')
        };
        return this.connect(postData);
    }

    // Cancel orders
    async cancel(orderIds) {
        const postData = {
            key: this.api_key,
            action: 'cancel',
            orders: orderIds.join(',')
        };
        return this.connect(postData);
    }

    // Get balance
    async balance() {
        const postData = {
            key: this.api_key,
            action: 'balance',
        };
        return this.connect(postData);
    }

    // Connect method to send HTTP request
    async connect(postData) {
        try {
            const response = await axios.post(this.api_url, new URLSearchParams(postData));
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }
}

export default Api;  // Exporting the class as default