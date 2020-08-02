// Dependences
const express = require('express')

// Configurated connection to database function
const connectToDatabase = require('./config/db')

// Connection to Database
connectToDatabase()

const PORT = process.env.PORT || 5000

const app = express()

// Init Middleware
app.use(express.json({ extended: false }))

// Root
app.get('/', (req, res) => res.send('API is running.'))

// Custom routes
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/users', require('./routes/api/users'))

// Running the server
app.listen(PORT, () => {
	console.log('Server has been started at port ' + PORT + '.')
})
