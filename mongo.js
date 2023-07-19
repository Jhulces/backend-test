const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Usage: node mongo.js <password> [content] [important]')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://jhulces:${password}@cluster0.6orrxxu.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

const noteSchema = new mongoose.Schema({
    content: String,  
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

mongoose.connect(url)
    .then(() => {
        if (process.argv.length === 3) {
            // Mostrar todos los ítems existentes en la base de datos
            Note.find({})
                .then(note => {
                    console.log('notes:')
                    note.forEach(note => {
                        console.log(note)
                    })
                    mongoose.connection.close()
                })
                .catch(error => {
                    console.error('Error:', error.message)
                    mongoose.connection.close()
                })
        } else if (process.argv.length === 5) {
            // Añadir nueva entrada a la base de datos
            const content = process.argv[3]
            const important = process.argv[4]

            const newNote = new Note({
                content: content,
                date: new Date(),
                important: important,
            })

            newNote.save()
                .then(() => {
                    console.log(`added ${content} with importance ${important} to notes`)
                    mongoose.connection.close()
                })
                .catch(error => {
                    console.error('Error:', error.message)
                    mongoose.connection.close()
                })
        } else {
            console.log('Usage: node mongo.js <password> [content] [important]')
            mongoose.connection.close()
        }
    })
    .catch(error => {
        console.error('Connection error:', error.message)
        mongoose.connection.close()
    })



