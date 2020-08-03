const mongoose = require('mongoose')
const config = require('config')

const db = config.get('MONGO_URI')

// Conection to Database
const connectToDatabase = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useFindAndModify: false,
			useCreateIndex: true,
			useUnifiedTopology: true,
		})
		console.log('Connection to Database has been successful.')
	} catch (e) {
		console.log(e.message)
		// Terminate the process in case if connection to database
		// was unsuccessful.
		process.exit(1)
	}
}

module.exports = connectToDatabase
