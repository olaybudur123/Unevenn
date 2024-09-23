import mongoose from 'mongoose'
import dotenv from 'dotenv';

dotenv.config({ path: "./config.env" });
const url = process.env.MONGODB_URI
const dbName = process.env.DB_NAME
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: dbName
})

//ailangugollc
//JYjtCP7CWZVTAxmG
mongoose.connection.on('connected', () => {
  console.log('Mongo has connected succesfully')
  
})
mongoose.connection.on('reconnected', () => {
  console.log('Mongo has reconnected')
})
mongoose.connection.on('error', error => {
  console.log('Mongo connection has an error', error)
  mongoose.disconnect()
})
mongoose.connection.on('disconnected', () => {
  console.log('Mongo connection is disconnected')
})

export default url;