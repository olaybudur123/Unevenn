import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
const accountSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, ""),
        },
        deviceId: {
            type: String,
            required: true,
        },
        userName: {
            type: String
        },
        cookie: {
            type: String
        },
        csrfToken: {
            type: String
        },
        userId: {
            type: String
        },
    },
    {
        timestamps: true,
        collection: "accounts",
    }
);

accountSchema.statics.createAccount = async function (data) {
    try {
        const account = await this.create(data);
        return account;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

accountSchema.statics.getAccount = async function (userName) {
    try {
        const account = await this.findOne({ userName });
        return account;
    } catch (error) {
        console.log(error)
        throw error;
    }
}
accountSchema.statics.deleteAccount = async function (_id,) {
    try {
        const account = await this.deleteOne({ _id });
        return account;
    } catch (error) {
        throw error;
    }
}
accountSchema.statics.updateAccount = async function (userName, updateFields) {
    const updateQuery = { $set: updateFields };
    Object.keys(updateFields).forEach(key => {
        if (updateFields[key] === "null" || updateFields[key] === null || updateFields[key] === '' || updateFields[key] === undefined) {
            delete updateFields[key];
        }
    });
    try {
        const account = await this.findOneAndUpdate(
            { userName },
            updateQuery, { new: true }
        );
        return account;
    } catch (error) {
        throw error;
    }
}

export default mongoose.model("Account", accountSchema);