const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://filmrealist_db_user:${password}@cluster0.v5v5ncz.mongodb.net/?appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
  name: 'Laganica',
  number: 'totalna'
})

contact.save().then(result => {
  console.log('contact saved!')
  mongoose.connection.close()
})