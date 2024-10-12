// utils
import makeValidation from '@withvoid/make-validation';
// models
import User from '../models/User.js';
import Order from '../models/Order.js';
import axios from 'axios';
import Api from '../utils/Api.js';
import decrypt from '../utils/decrypt.js';
import Account from '../models/Account.js';
const api = new Api();
export default {
    onGetAllUsers: async (req, res) => {
        try {
            var page = req.query.page || 0;
            var limit = req.query.limit || 100;

            const users = await User.getAllUsers(page, limit);
            return res.status(200).json({ success: true, users });

        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },
    onGetUser: async (req, res) => {
        try {

            const validation = makeValidation(types => ({
                payload: req.body,
                checks: {
                    deviceId: { type: types.string },
                    deviceLocale: { type: types.string },
                    pushToken: { type: types.string },
                    platform: { type: types.string },
                }
            }));
            if (!validation.success) return res.status(400).json({ ...validation });
            const { deviceId, pushToken } = req.body;

            const user = await User.getUserById(deviceId,pushToken);
       
            if (user) {
                return res.status(200).json({ success: true, user });

            } else {
                const user = await User.createUser(req.body);
                return res.status(200).json({ success: true, user });
            }
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },
    onDeleteUser: async (req, res) => {
        try {
            const id = req.params.id;

            var user = await User.deleteUser(id)

            if (user.deletedCount == 0) {
                return res.status(200).json({ success: false, error: "No user found" });
            } else {
                return res.status(200).json({ success: true });
            }


        } catch (error) {

        }
    }, onAddOrder: async (req, res) => {
        try {
            const validation = makeValidation(types => ({
                payload: req.body,
                checks: {
                    deviceId: { type: types.string },
                    type: { type: types.string },
                    link: { type: types.string },
                    userName: { type: types.string },
                    count: { type: types.string },
                    app: { type: types.string },
                }
            }));
            if (!validation.success) return res.status(400).json({ ...validation });

            const { deviceId, type, link, count, app, userName } = req.body;

            const user = await User.getUserById(deviceId);
            if (user) {

                console.log(type);
                var lastOrder = await Order.getUserLastOrder(user._id, type);
                console.log(lastOrder);
                if (lastOrder) {
                    return res.status(200).json({ success: false, error: "Yeni bir sipariş oluşturabilmek için en az 4 saat geçmelidir." });
                }
                var service;
                if (app == 0) {
                    if (type == "follow") {
                        service = 647
                    } else if (type == "like") {
                        service = 648
                    } else if (type == "view") {
                        service = 717
                    }
                } else {
                    if (type == "follow") {
                        service = 652
                    } else if (type == "like") {
                        service = 653
                    } else if (type == "view") {
                        service = 654
                    }
                }



                const apiResponse = await api.order({
                    service: service,
                    link: link,
                    quantity: count
                });
                if (apiResponse['error'] != null && apiResponse['error'] != undefined) {
                    return res.status(200).json({ success: false, error: apiResponse['error'] });
                }
                var orderId = apiResponse['order']
                var data = { userId: user._id, link: link, type: type, count: parseInt(count), app: parseInt(app), userName: userName, orderId };

                if (!apiResponse) {
                    return res.status(500).json({ success: false, error: "External API failed" });
                } else {
                    var order = await Order.createOrder(data);
                }



                return res.status(200).json({ success: true, order });
            } else {
                return res.status(200).json({ success: false, error: "No user found" });
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, error: error.message });
        }
    },
    onGetLastOrders: async (req, res) => {
        try {
            const validation = makeValidation(types => ({
                payload: req.body,
                checks: {
                    deviceId: { type: types.string },
                }
            }));
            if (!validation.success) return res.status(400).json({ ...validation });
            const { deviceId } = req.body;

            const user = await User.getUserById(deviceId,);
            if (user) {
                var followOrder = await Order.getUserLastOrder(user._id, "follow") || null;
                var viewOrder = await Order.getUserLastOrder(user._id, "view") || null;
                var likeOrder = await Order.getUserLastOrder(user._id, "like") || null;
                var orders = [];

                if (followOrder != null) {
                    orders.push(followOrder)
                }
                if (viewOrder != null) {
                    orders.push(viewOrder)
                }
                if (likeOrder != null) {
                    orders.push(likeOrder)
                }
                return res.status(200).json({ success: true, orders });
            } else {
                return res.status(200).json({ success: false, error: "No user found" });
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, error: error })
        }
    },
    onGetAllOrders: async (req, res) => {
        try {
            const validation = makeValidation(types => ({
                payload: req.body,
                checks: {
                    deviceId: { type: types.string },
                }
            }));
            if (!validation.success) return res.status(400).json({ ...validation });
            const { deviceId } = req.body;

            const user = await User.getUserById(deviceId,);
            if (user) {
                var orders = await Order.getUserOrders(user._id);
                var orderIds = orders.map((order) => order.orderId);


                var orderStatus = await api.multiStatus(orderIds);


                // Merge orderStatus into _doc of each order
                var mergedOrders = orders.map((order) => {
                    // Find the status information based on orderId
                    const status = orderStatus[order.orderId];

                    // Merge order with its corresponding status
                    return {
                        ...order._doc,  // Keep existing _doc fields
                        status: status ? status.status : 'Unknown',  // Add status field
                        charge: status ? status.charge : null,
                        start_count: status ? status.start_count : null,
                        remains: status ? status.remains : null,
                        currency: status ? status.currency : null,
                    }
                });

                console.log(mergedOrders);
                return res.status(200).json({ success: true, orders: mergedOrders });
            } else {
                return res.status(200).json({ success: false, error: "No user found" });
            }


        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, error: error })
        }
    },
    onAddAccount: async (req, res) => {
        try {
            const validation = makeValidation(types => ({
                payload: req.body,
                checks: {
                    deviceId: { type: types.string },
                    cookie: { type: types.string },
                    userName: { type: types.string },
                }
            }));
            if (!validation.success) return res.status(400).json({ ...validation });
            const { deviceId, cookie, userName } = req.body;

            var cookieResult = parseCookies(cookie)

            var data = {
                userName: userName,
                deviceId: deviceId,
                cookie: cookie
            }

            if (cookieResult.type instanceof String) {
                // Your code here
            } else {
                data['csrfToken'] = cookieResult['csrftoken']
                data['userId'] = cookieResult['userId']
            }


            const existingAccount = await Account.getAccount(userName);
            console.log(existingAccount)
            if (existingAccount) {
                const updatedAccount = await Account.updateAccount(userName, data);
                return res.status(200).json({ success: true, "account": updatedAccount });
            } else {
                const createdAccount = await Account.createAccount(data);
                return res.status(200).json({ success: true, "account": createdAccount });
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, error: error })
        }
    },
    onTiktokSearch: async (req, res) => {
        try {
            const validation = makeValidation(types => ({
                payload: req.body,
                checks: {
                    keyword: { type: types.string },
                }
            }));
            if (!validation.success) return res.status(400).json({ ...validation });

            const { keyword } = req.body;

            // Make the request to the TikTok API
            const response = await axios.get('https://www.tiktok.com/api/search/general/preview/', {
                params: {
                    WebIdLastTime: '1712570594',
                    aid: '1988',
                    app_language: 'tr',
                    app_name: 'tiktok_web',
                    browser_language: 'tr-TR',
                    browser_name: 'Mozilla',
                    browser_online: 'true',
                    browser_platform: 'Win32',
                    browser_version: '5.0 (Windows)',
                    channel: 'tiktok_web',
                    cookie_enabled: 'true',
                    data_collection_enabled: 'true',
                    device_id: "7355434532391667205",
                    device_platform: 'web_pc',
                    focus_state: 'true',
                    from_page: 'fyp',
                    history_len: '3',
                    is_fullscreen: 'false',
                    is_page_visible: 'true',
                    keyword: keyword,
                    odinId: '7130244077908804614',
                    os: 'windows',
                    priority_region: '',
                    referer: '',
                    region: 'TR',
                    screen_height: '960',
                    screen_width: '1707',
                    tz_name: 'Europe/Istanbul',
                    user_is_login: 'true',
                    webcast_language: 'tr-TR'
                }
            });

            return res.status(200).json({ success: true, data: response.data });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }, onGetTiktokUser: async (req, res) => {
        try {
            const { username } = req.query;
            if (username) {


                // Make the request to the TikTok API
                const response = await axios.get('https://savefrom.life/tikFeed.php', {
                    params: {
                        username: username,
                    }
                });
                return res.status(200).json({ success: true, data: response.data });
            } else {
                return res.status(200).json({ success: false, message: "enter username" });
            }

        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    },
    onDeleteAccount: async (req, res) => {
        try {
            const id = req.params.id;

            var account = await Account.deleteAccount(id)

            if (account.deletedCount == 0) {
                return res.status(200).json({ success: false, error: "No account found" });
            } else {
                return res.status(200).json({ success: true });
            }


        } catch (error) {

        }
    }


}
// Cookie'yi ayıran fonksiyon
function parseCookies(cookieString) {
    try {
        const cookies = {};

        // Her bir cookie'yi ayır
        cookieString.split(';').forEach(cookie => {
            const [name, value] = cookie.split('=').map(c => c.trim());
            if (name && value) {
                cookies[name] = value;
            }
        });

        return cookies;
    } catch (error) {
        return cookieString
    }

}

var followServiceIds = [647, 649, 652, 655,];

var viewServiceIds = [654, 670, 717];

var likeServiceIds = [648, 653, 656,];