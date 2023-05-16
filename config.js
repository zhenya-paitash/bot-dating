const mongoose = require('mongoose')

const dbconnect = async () => {
  try {
    const uri = process.env.MONGO_URI
    const connect = await mongoose.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })

    console.log(`Mongodb connected: ${connect.connection.host}`.cyan.underline)
  } catch (e) {
    console.error(`MongodbError: ${e.message}`.red.underline.bold)
  }
}

module.exports = dbconnect
