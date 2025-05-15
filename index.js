const inputTarefa = document.getElementById("idTarefa")
const formularioAdicao = document.getElementById("idFormularioAdicao")
const campoListaTarefas = document.getElementById("idCampoListaTarefas")
const campoFormularioEdicao = document.getElementById("idFormularioEdicao")
const inputEditar = document.getElementById("idEditar")
const btnConfirmaEditar = document.getElementById("idBtnConfirmaEditar")
const btnAddTarefa = document.getElementById("idBtnAddTarefa")
const btnCancelarEditar = document.getElementById("idBtnCancelarEditarTarefa")
const inputPesquisar = document.getElementById('idPesquisar');
const selectFiltro = document.getElementById('idEscolha');

let todasTarefas = JSON.parse(localStorage.getItem('dbfun')) || [];

const getItem = () => JSON.parse(localStorage.getItem('dbfun')) || [];
const setItem = (db) => localStorage.setItem('dbfun', JSON.stringify(db));

function atualizarListaTarefas() {
    campoListaTarefas.innerHTML = '';
    
    const pesquisa = inputPesquisar.value.trim().toLowerCase();

    const filtroSelecionado = selectFiltro.value;

    const tarefasFiltradas = todasTarefas.filter(tarefa => {
        // Aplicar filtro de conclusão
        let filtro = true;

        if (filtroSelecionado === 'Afazer'){ 
            filtro = !tarefa.concluida
        }
        if (filtroSelecionado === 'Concluido') {
            filtro = tarefa.concluida
        }

        // Aplicar pesquisa
        const pesquisaAplicada = tarefa.texto.toLowerCase().includes(pesquisa);
        
        return filtro && pesquisaAplicada;
    });

    tarefasFiltradas.forEach(t => criarElementoTarefa(t));
}

//Carregar Tarefas ao Iniciar
document.addEventListener("DOMContentLoaded", function(evento) {
    todasTarefas = getItem();
    atualizarListaTarefas(); // Carrega apenas tarefas não concluídas
});


btnAddTarefa.addEventListener("click", function(evento) {
    const texto = inputTarefa.value.trim();

    if(texto) {
        const novaTarefa = {
            id: Date.now(),
            texto: texto,
            concluida: false
        };

        todasTarefas.push(novaTarefa);
        setItem(todasTarefas);
        inputTarefa.value = "";
        atualizarListaTarefas();
    }
});

// Evento de pesquisa em tempo real
inputPesquisar.addEventListener('input', () => {
    atualizarListaTarefas();
});



// Evento de mudança no filtro
selectFiltro.addEventListener('change', () => {
    atualizarListaTarefas();
});

function criarElementoTarefa(tarefa){

    let campoLista = document.createElement("div")
    campoLista.className = "listaTarefas"
    campoLista.dataset.id = tarefa.id

    if(tarefa.concluida){
        campoLista.classList.add('concluida');
    } 

    let controleTexto = document.createElement("div")
    controleTexto.classList.add("controleTexto")
    
    let textoTarefa = document.createElement("p")
    textoTarefa.innerText = tarefa.texto
    
    controleTexto.appendChild(textoTarefa)

    let controleBtns = document.createElement("div")
    controleBtns.classList.add("controleBtns")

    let btnSelecionarTarefa = document.createElement("button")
    btnSelecionarTarefa.classList.add("bi", "bi-check2-circle", "btnSelecionarTarefa")

    let btnEditarTarefa = document.createElement("button")
    btnEditarTarefa.classList.add("bi", "bi-pencil-square", "idBtnEditarTarefa")
    
    let btnRemoverTarefa = document.createElement("button")
    btnRemoverTarefa.classList.add("bi", "bi-x-lg", "btnRemoverTarefa")

    controleBtns.appendChild(btnSelecionarTarefa)
    controleBtns.appendChild(btnEditarTarefa)
    controleBtns.appendChild(btnRemoverTarefa)

    campoLista.appendChild(controleTexto)
    campoLista.appendChild(controleBtns)
    campoListaTarefas.appendChild(campoLista)

    btnEditarTarefa.addEventListener("click",function(evento){

        formularioAdicao.classList.add("ocultar")
        campoFormularioEdicao.classList.remove("ocultar")

        const campoTarefa = evento.target.closest(".listaTarefas")// busca o container pai mais próximo
        const tarefaId = campoTarefa.dataset.id

        campoFormularioEdicao.dataset.editarId = tarefaId

        // Preencher o input com o texto atual do DOM
        inputEditar.value = campoTarefa.querySelector('p').textContent;

    })

    
    btnRemoverTarefa.addEventListener("click",function(evento){
        
        const campoTarefa = evento.target.closest(".listaTarefas")// busca o container pai mais próximo
        todasTarefas = todasTarefas.filter(t => t.id !== parseInt(campoTarefa.dataset.id))
        setItem(todasTarefas)
        campoTarefa.remove()
    })

    btnSelecionarTarefa.addEventListener("click", function(evento) {
        const campoTarefa = evento.target.closest(".listaTarefas");
        const tarefaId = parseInt(campoTarefa.dataset.id);
        const index = todasTarefas.findIndex(t => t.id === tarefaId);
        
        todasTarefas[index].concluida = !todasTarefas[index].concluida;
        setItem(todasTarefas);
        
        // Em vez de remover, atualiza a lista completa
        atualizarListaTarefas();
    });

    

}



btnConfirmaEditar.addEventListener("click", function(evento) {
    const novoTexto = inputEditar.value.trim()
    if(!novoTexto) return

    const tarefaId = parseInt(campoFormularioEdicao.dataset.editarId, 10)
    if(isNaN(tarefaId)) return

    const tarefaPosicao = todasTarefas.findIndex(i => i.id === tarefaId)
    if(tarefaPosicao === -1) return

    todasTarefas[tarefaPosicao].texto = novoTexto
    setItem(todasTarefas)

    const campoTarefa = document.querySelector(`[data-id="${tarefaId}"]`)
    campoTarefa.querySelector('p').textContent = novoTexto

    formularioAdicao.classList.remove("ocultar")
    campoFormularioEdicao.classList.add("ocultar")
    inputEditar.value = ""

    atualizarListaTarefas();
})


btnCancelarEditar.addEventListener("click", function(evento) {
    formularioAdicao.classList.remove("ocultar")
    campoFormularioEdicao.classList.add("ocultar")
    inputEditar.value = ""
    
})


