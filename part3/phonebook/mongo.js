const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length === 4) {
  console.log('give the contact number');
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://filmrealist_db_user:${password}@cluster0.v5v5ncz.mongodb.net/phonebook?appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
  name: process.argv[3] || '',
  number: process.argv[4] || ''
})

if (contact.name && contact.number) {
  contact.save().then(result => {
    console.log(`added ${contact.name} number ${contact.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Contact.find({}).then(result => {
    console.log('phonebook:');
    result.forEach(contact => {
      console.log(`${contact.name} ${contact.number}`);
    });
    mongoose.connection.close()
  })
}

