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
        const lastOrder = await this.findOne({ userId, type })
            .sort({ createdAt: -1 }) // Sorting by 'createdAt' in descending order
            .exec();
        return lastOrder;
    } catch (error) {
        throw error;
    }
};

export default mongoose.model("Order", orderSchema);