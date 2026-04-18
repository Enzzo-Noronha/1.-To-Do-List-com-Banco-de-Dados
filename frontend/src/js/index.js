const form = document.getElementById('form')
const tabela = document.getElementById('tabela')
let editandoId = null

// ============ CARREGAR AO INICIAR ============
async function carregar() {
    const res = await fetch('http://localhost:3000/tarefas')
    const tarefas = await res.json()
    renderizar(tarefas)
}

// ============ CRIAR / ATUALIZAR ============
form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const escrito = document.getElementById('tarefa').value.trim()
    const dificuldade = document.getElementById('dificuldade').value

    if (!escrito) return

    if (editandoId !== null) {
        await fetch(`http://localhost:3000/tarefas/${editandoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ escrito, dificuldade })
        })
        editandoId = null
        form.querySelector('button').textContent = 'Adicionar'
    } else {
        await fetch('http://localhost:3000/tarefas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ escrito, dificuldade })
        })
    }

    form.reset()
    carregar()
})

// ============ RENDERIZAR ============
function renderizar(tarefas) {
    tabela.innerHTML = ''

    tarefas.forEach((tarefa) => {
        const badgeClass = {
            'Fácil': 'badge-facil',
            'Médio': 'badge-medio',
            'Difícil': 'badge-dificil'
        }[tarefa.dificuldade]

        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td>${tarefa.escrito}</td>
            <td><span class="badge ${badgeClass}">${tarefa.dificuldade}</span></td>
            <td>
                <div class="btn-acoes">
                    <button class="btn-editar" onclick="editar(${tarefa.id}, '${tarefa.escrito}', '${tarefa.dificuldade}')">Editar</button>
                    <button class="btn-deletar" onclick="deletar(${tarefa.id})">Deletar</button>
                </div>
            </td>
        `
        tabela.appendChild(tr)
    })
}

// ============ EDITAR ============
function editar(id, escrito, dificuldade) {
    document.getElementById('tarefa').value = escrito
    document.getElementById('dificuldade').value = dificuldade
    editandoId = id
    form.querySelector('button').textContent = 'Salvar'
}

// ============ DELETAR ============
async function deletar(id) {
    await fetch(`http://localhost:3000/tarefas/${id}`, { method: 'DELETE' })
    carregar()
}

carregar()