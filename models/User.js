import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    deviceId: {
      type: String,
      required: true,
      unique: true
    },
    deviceLocale: {
      type: String,
      default: "en"
    },
    platform: {
      type: String,
      required: true,
    },
    pushToken: {
      type: String,
      required: true,
    },
    country: {
      type: String,
    },
    deviceInfo: {
      type: Map,
    },

  },
  {
    timestamps: true,
    collection: "users",
  }
);

userSchema.statics.getMonthlyAndroidUserSize = async function () {
  try {
    const stats = await this.countDocuments(
      { subscribeStatus: "monthly", platform: "android" },
    );
    return stats;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
userSchema.statics.getMonthlyIosUserSize = async function () {
  try {
    const stats = await this.countDocuments(
      { subscribeStatus: "monthly", platform: "ios" },
    );
    return stats;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
userSchema.statics.getYearlyAndroidUserSize = async function () {
  try {
    const stats = await this.countDocuments(
      { subscribeStatus: "yearly", platform: "android" },
    );
    return stats;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
userSchema.statics.getYearlyIosUserSize = async function () {
  try {
    const stats = await this.countDocuments(
      { subscribeStatus: "yearly", platform: "ios" },
    );
    return stats;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
userSchema.statics.getWeeklyAndroidUserSize = async function () {
  try {
    const stats = await this.countDocuments(
      { subscribeStatus: "weekly", platform: "android" },
    );
    return stats;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
userSchema.statics.getWeeklyIosUserSize = async function () {
  try {
    const stats = await this.countDocuments(
      { subscribeStatus: "weekly", platform: "ios" },
    );
    return stats;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
userSchema.statics.getTodayAndroidUsersSize = async function () {
  try {
    // Get the count of users installed today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // set time to midnight
    const todayUsers = await this.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $match: { platform: { $eq: "android" } } },
      { $group: { _id: false, count: { $sum: 1 } } }
    ])
    if (todayUsers.length == 0) {
      return 0
    }
    return todayUsers[0].count;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
userSchema.statics.getTodayIosUsersSize = async function () {
  try {
    // Get the count of users installed today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // set time to midnight
    const todayUsers = await this.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $match: { platform: { $eq: "ios" } } },
      { $group: { _id: false, count: { $sum: 1 } } }
    ])
    if (todayUsers.length == 0) {
      return 0
    }
    return todayUsers[0].count;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
userSchema.statics.getUsersSize = async function () {
  try {
    const stats = await this.countDocuments(
    );
    return stats;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
userSchema.statics.getAndroidUsersSize = async function () {
  try {
    const stats = await this.countDocuments(
      { platform: "android" }
    );
    return stats;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
userSchema.statics.getIosUsersSize = async function () {
  try {
    const stats = await this.countDocuments(
      { platform: "ios" }
    );
    return stats;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
userSchema.statics.getSubUserSize = async function () {
  try {
    const stats = await this.countDocuments(
      { subscribeStatus: { $ne: "None" } },
    );
    return stats;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
userSchema.statics.getMonthlyUserSize = async function () {
  try {
    const stats = await this.countDocuments(
      { subscribeStatus: "monthly" },
    );
    return stats;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
userSchema.statics.getYearlyUserSize = async function () {
  try {
    const stats = await this.countDocuments(
      { subscribeStatus: "yearly" },
    );
    return stats;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
userSchema.statics.getTodayUsersSize = async function () {
  try {
    // Get the count of users installed today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // set time to midnight
    const todayUsers = await this.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: false, count: { $sum: 1 } } }
    ])
    if (todayUsers.length == 0) {
      return 0
    }
    return todayUsers[0].count;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
userSchema.statics.createUser = async function (data) {
  try {

    const user = await this.create(data);
    return user;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
userSchema.statics.countMessage = async function (deviceId, increment) {
  try {
    const user = await this.updateOne({ deviceId },
      {
        $inc: {
          "messageCount": increment
        },
      },
    );
    return user;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
userSchema.statics.getUserById = async function (deviceId) {
  try {
    const user = await this.aggregate([
      {
        $match: { deviceId }
      },
      {
        $lookup: {
          from: 'accounts',         // Name of the accounts collection
          localField: 'deviceId',   // Field in the users collection
          foreignField: 'deviceId', // Field in the accounts collection
          as: 'accounts'            // Name of the resulting array field
        }
      }
    ]);

    return user.length ? user[0] : null; // Check if user exists and return the first one
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getUser = async function (deviceId, updateFields) {
  // Clean up the updateFields, removing any null, empty, or undefined values
  Object.keys(updateFields).forEach(key => {
    if (updateFields[key] === "null" || updateFields[key] === null || updateFields[key] === '' || updateFields[key] === undefined) {
      delete updateFields[key];
    }
  });

  const updateQuery = { $set: updateFields };

  try {
    // First, update the user
    const updatedUser = await this.findOneAndUpdate(
      { deviceId },
      updateQuery,
      { new: true } // Return the updated document
    );

    // Perform the lookup to get the associated accounts
    const userWithAccounts = await this.aggregate([
      {
        $match: { deviceId }
      },
      {
        $lookup: {
          from: 'accounts',         // Name of the accounts collection
          localField: 'deviceId',   // Field in the users collection
          foreignField: 'deviceId', // Field in the accounts collection
          as: 'accounts'            // Name of the resulting array field
        }
      }
    ]);

    return userWithAccounts.length ? userWithAccounts[0] : updatedUser; // Return updated user with accounts
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getTotalSignUpUsers = async function () {
  try {
    const stats = await this.countDocuments(
      { userName: { $ne: null } } // Use $ne operator to find userName not equal to null
    );
    return stats;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
userSchema.statics.getAllUsers = async function (page, limit) {
  try {


    const users = await this.find().sort({ createdAt: -1 }).skip((page) * limit).limit(limit); return users



  } catch (error) {
    throw error;
  }
}
userSchema.statics.deleteUser = async function (_id,) {
  try {
    const chatBot = await this.deleteOne({ _id });
    return chatBot;
  } catch (error) {
    throw error;
  }
}
userSchema.statics.updateSubscriptionStatus = async function (deviceId, subscribeStatus, purchaseDate) {
  try {
    const user = await this.updateOne({ deviceId },
      {
        $set: {
          "subscribeStatus": subscribeStatus,
          "purchaseDate": purchaseDate
        },
      },
    );
    if (!user) throw ('No user with this id found');
    return user;
  } catch (error) {
    throw error;
  }
}
userSchema.statics.getUserByUserName = async function (userName) {
  try {
    const user = await this.aggregate([
      { $match: { userName } }
    ]).exec()


    if (user && user.length > 0) {
      return user[0];
    } else {
      // Handle no matching documents
      console.log('No matching documents found.');
      return null; // or return an appropriate value indicating no match
    }
  } catch (error) {
    throw error;
  }
}
userSchema.statics.updateUserSignUp = async function (userId, userName, password) {
  try {
    const user = await this.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          userName, password
        }
      }, { new: true }
    );
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

userSchema.statics.checkUserName = async function (userName) {
  try {
    const user = await this.findOne(
      { userName }
    );

    if (user) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log(error)
    throw error;
  }
}
export default mongoose.model("User", userSchema);