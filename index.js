const inputTarefa = document.getElementById("idTarefa")
const btnAddTarefa = document.getElementById("idBtnAddTarefa")
const campoListaTarefas = document.getElementById("idCampoListaTarefas")

const formularioEdicao = document.getElementById("idFormularioEdicao")
const formularioAdicao = document.getElementById("idFormularioAdicao")
const inputEditar = document.getElementById("idEditar")
const btnConfirmaEditar = document.getElementById("idBtnConfirmaEditar")
const btnCancelarEditar = document.getElementById("idBtnCancelarEditarTarefa")


const inputPesquisar = document.getElementById("idPesquisar")
const escolhaFiltrar = document.getElementById("idEscolha")

let todasTarefas = JSON.parse(localStorage.getItem('dbfun') || '[]')

const getItem = () => JSON.parse(localStorage.getItem('dbfun') || [])
const setItem = (db) => localStorage.setItem('dbfun', JSON.stringify(db))


document.addEventListener("DOMContentLoaded", function(evento){
    todasTarefas = getItem()
    aplicarFiltroEPesquisa()
})


btnAddTarefa.addEventListener("click",function(evento){
    
    evento.preventDefault();

    let conteudoTarefa = inputTarefa.value.trim().toLowerCase()
    
    //Validação de entrada
    if(/^[A-Za-z\s]+$/.test(conteudoTarefa)){

        //Primeria letra maiúscula
        conteudoTarefa = conteudoTarefa.charAt(0).toUpperCase() + conteudoTarefa.slice(1).toLowerCase()

        const novaTarefa = {
            id: Date.now(),
            conteudoTarefa:conteudoTarefa,
            concluido:false
        }

        todasTarefas.push(novaTarefa)

        Swal.fire({
            position: "center",
            title: `${conteudoTarefa} cadastrado(a)`,
            icon: "success",
            showConfirmButton: false,
            timer: 1500
        });

        setItem(todasTarefas)
        aplicarFiltroEPesquisa();

        inputTarefa.value = ""
    }
    else{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Campo tarefa está vazio ou incorreto!",
        });
        return
    }

})

function renderizarTarefas(tarefaAtual){

    campoListaTarefas.innerHTML = ""

    const tarefas = tarefaAtual || getItem()

    tarefas.forEach((tarefa) => {
        
        const divListaTarefas = document.createElement("div")
        divListaTarefas.classList.add("listaTarefas")
        //Usado para remover
        divListaTarefas.dataset.id = tarefa.id

        // Aplicar classe de concluído conforme seu CSS
        if (tarefa.concluido) {
            divListaTarefas.classList.add("concluida");
        }
    
        const divTexto = document.createElement("div")
        divTexto.classList.add("controleTexto")
        
    
        let pTexto = document.createElement("p")
        pTexto.innerText = tarefa.conteudoTarefa
    
        divTexto.appendChild(pTexto)
        divListaTarefas.appendChild(divTexto)
    
        const divControleBtns = document.createElement("div")
        divControleBtns.classList.add("controleBtns")
    
        const btnSelecionarTarefa = document.createElement("button")
        btnSelecionarTarefa.classList.add("btnSelecionarTarefa","bi","bi-check2-circle")
        
        const btnEditarTarefa = document.createElement("button")
        btnEditarTarefa.classList.add("btnEditarTarefa","bi","bi-pencil-square")
    
        const btnRemoverTarefa = document.createElement("button")
        btnRemoverTarefa.classList.add("btnRemoverTarefa","bi","bi-x-lg")
    
        divControleBtns.appendChild(btnSelecionarTarefa)
        divControleBtns.appendChild(btnEditarTarefa)
        divControleBtns.appendChild(btnRemoverTarefa)
    
        divListaTarefas.appendChild(divTexto)
        divListaTarefas.appendChild(divControleBtns)
    
        campoListaTarefas.appendChild(divListaTarefas)

        btnRemoverTarefa.addEventListener("click",function(evento){

            const campo = evento.target.closest(".listaTarefas")
            
            todasTarefas = todasTarefas.filter(t => t.id !== tarefa.id)

            setItem(todasTarefas)
            aplicarFiltroEPesquisa();


            Swal.fire({
                position: "center",
                title: `${tarefa.conteudoTarefa} removido(a)`,
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
            
        })

        btnEditarTarefa.addEventListener("click",function(evento){
            
            formularioEdicao.classList.remove("ocultar")
            formularioAdicao.classList.add("ocultar")

            inputEditar.value = tarefa.conteudoTarefa

            //Usado para editar
            //Cria o id para ser usado no evento de confirmar
            formularioEdicao.dataset.editarId = tarefa.id
        })


        btnSelecionarTarefa.addEventListener("click", function() {

            const todasAsTarefas = getItem();

            const index = todasAsTarefas.findIndex(t => t.id === tarefa.id);
            if (index !== -1) {

                todasAsTarefas[index].concluido = !todasAsTarefas[index].concluido;
                setItem(todasAsTarefas);
                aplicarFiltroEPesquisa();
            }
        });

    })
}

btnConfirmaEditar.addEventListener("click",function(evento){

    evento.preventDefault();

    const idParaEditar = parseInt(formularioEdicao.dataset.editarId,10)
    let novaTarefaAtualizada = inputEditar.value.trim()
    

    // Validação de entrada
    if (!/^[A-Za-z\s]+$/.test(novaTarefaAtualizada)) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Campo tarefa está vazio ou incorreto!",
        });
        return;
    }  

    novaTarefaAtualizada = novaTarefaAtualizada.charAt(0).toUpperCase() + novaTarefaAtualizada.slice(1).toLowerCase();

    // Busca no localStorage atualizado
    const tarefasAtualizadas = getItem();                   
    const editar_i = tarefasAtualizadas.findIndex(i => i.id === idParaEditar)

    if(editar_i !== -1){
        
        tarefasAtualizadas[editar_i].conteudoTarefa = novaTarefaAtualizada
        
        setItem(tarefasAtualizadas)
        aplicarFiltroEPesquisa();

        Swal.fire({
            position: "center",
            title: `${novaTarefaAtualizada} atualizado(a)`,
            icon: "success",
            showConfirmButton: false,
            timer: 1500
        });
    }


    formularioEdicao.classList.add("ocultar")
    formularioAdicao.classList.remove("ocultar")
    inputEditar.value = ""
    
})

btnCancelarEditar.addEventListener("click", function(evento) {
    evento.preventDefault();
    formularioEdicao.classList.add("ocultar");
    formularioAdicao.classList.remove("ocultar");
    inputEditar.value = "";
})



inputPesquisar.addEventListener("input", aplicarFiltroEPesquisa);
escolhaFiltrar.addEventListener("change", aplicarFiltroEPesquisa);

function aplicarFiltroEPesquisa() {
    const valorPesquisa = inputPesquisar.value.trim().toLowerCase();
    const filtroSelecionado = escolhaFiltrar.value;
    const todasAsTarefas = getItem();

    const tarefasFiltradas = todasAsTarefas.filter(t => {
        const correspondePesquisa = t.conteudoTarefa.toLowerCase().includes(valorPesquisa);
        let correspondeFiltro = true;

        switch(filtroSelecionado) {
            case 'Afazer':
                correspondeFiltro = !t.concluido;
                break;
            case 'Concluido':
                correspondeFiltro = t.concluido;
                break;
        }

        return correspondePesquisa && correspondeFiltro;
    });

    renderizarTarefas(tarefasFiltradas);
}