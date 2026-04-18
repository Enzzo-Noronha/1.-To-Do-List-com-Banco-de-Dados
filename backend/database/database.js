const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./tarefas.db', (err) =>{
    if(err){
        console.error("Error ao conectar ao banco: ", err.message)
    }else{
        console.log('Conectado no SQlite3')
    }
})

db.run(`
    CREATE TABLE IF NOT EXISTS tarefas(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        escrito TEXT NOT NULL,
        dificuldade TEXT NOT NULL
    )
    `)

module.exports = db