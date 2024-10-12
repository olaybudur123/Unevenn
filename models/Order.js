import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
const orderSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, ""),
        },
        userId: {
            type: String
        },
        userName: {
            type: String,
            required: true
        },
        count: {
            type: Number,
            required: true
        },
        link: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        }, app: {
            type: Number,
            required: true
        }, orderId: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
        collection: "orders",
    }
);

orderSchema.statics.createOrder = async function (data) {
    try {
        const order = await this.create(data);
        return order;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

orderSchema.statics.getUserOrders = async function (userId) {
    try {
        const orders = await this.find({ userId });
        return orders
    } catch (error) {
        throw error;
    }
}

orderSchema.statics.getUserLastOrder = async function (userId, type) {
    try {
        const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000); // 4 saat önceki zaman

        const lastOrder = await this.findOne({
            userId,
            type,
            createdAt: { $gte: fourHoursAgo } // Son 4 saat içinde oluşturulmuş mu?
        })
            .sort({ createdAt: -1 }) // 'createdAt' alanına göre azalan sıralama
            .exec();

        return lastOrder; // Eğer son 4 saatte order yoksa null döner
    } catch (error) {
        throw error;
    }
};

orderSchema.statics.getUsersWithRecentOrders = async function () {
    try {
        const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000); // 4 saat önceki zaman

        const users = await this.aggregate([
            {
                $match: {
                    createdAt: { $gte: fourHoursAgo } // Son 4 saat içindeki siparişler
                }
            },
            {
                $group: {
                    _id: "$userId" // Benzersiz kullanıcılar için gruplama
                }
            },
            {
                $lookup: {
                    from: "users", // User koleksiyonu ile eşleştir
                    localField: "_id", // order.userId
                    foreignField: "_id", // user._id
                    as: "userInfo" // Eşleşen kullanıcı bilgileri
                }
            },
            {
                $unwind: "$userInfo" // userInfo alanını aç
            },
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    deviceId: "$userInfo.deviceId",
                    platform: "$userInfo.platform",
                    pushToken: "$userInfo.pushToken",
                    deviceLocale: "$userInfo.deviceLocale",
                    country: "$userInfo.country",
                    createdAt: "$userInfo.createdAt"
                }
            }
        ]);

        return users; // [{ userId, deviceId, platform, ... }]
    } catch (error) {
        throw error;
    }
};

export default mongoose.model("Order", orderSchema);