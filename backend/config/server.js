const express = require('express')
const cors = require('cors')
const db = require('../database/database')

const app = express()
app.use(cors())
app.use(express.json())

// GET - listar todas
app.get('/tarefas', (req, res) => {
    db.all('SELECT * FROM tarefas', [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message })
        res.json(rows)
    })
})

// POST - criar
app.post('/tarefas', (req, res) => {
    const { escrito, dificuldade } = req.body

    if (!escrito || !dificuldade) {
        return res.status(400).json({ erro: 'Campos obrigatórios' })
    }

    db.run(
        'INSERT INTO tarefas (escrito, dificuldade) VALUES (?, ?)',
        [escrito, dificuldade],
        function (err) {
            if (err) return res.status(500).json({ erro: err.message })
            res.status(201).json({ id: this.lastID, escrito, dificuldade })
        }
    )
})

// PUT - editar
app.put('/tarefas/:id', (req, res) => {
    const { escrito, dificuldade } = req.body
    const { id } = req.params

    db.run(
        'UPDATE tarefas SET escrito = ?, dificuldade = ? WHERE id = ?',
        [escrito, dificuldade, id],
        function (err) {
            if (err) return res.status(500).json({ erro: err.message })
            res.json({ id, escrito, dificuldade })
        }
    )
})

// DELETE - deletar
app.delete('/tarefas/:id', (req, res) => {
    const { id } = req.params

    db.run('DELETE FROM tarefas WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ erro: err.message })
        res.json({ mensagem: 'Tarefa deletada' })
    })
})

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'))