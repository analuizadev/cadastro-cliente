function modoDark() {
    document.body.classList.add('dark');
}

function modoLight(){
    document.body.classList.remove('dark');
}

function modalOpen(){
    const activeModal = document.querySelector('.modal');
    activeModal.classList.add('active');
}

function modalClose() {
    const activeModal = document.querySelector('.modal');
    activeModal.classList.remove('active');
    clearFields()
}

//CRUD - create read update delete

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [] //se o localstorage n existir vai retornar vazio;
//json.parse transforma uma string em json; esta const vai pegar um item do local storage que recebe a key 'db_client';
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient));
//json.stringify transforma o objeto em string;

//create - add o dados a tabela
const createClient = (client) => {
    const dbClient = getLocalStorage();
    dbClient.push(client) //push add uma coisa dentro do array;
    setLocalStorage(dbClient);
}

const readClient = () => getLocalStorage()

const updateClient = (index, client) => {
    //pega o index do array + o client
    const dbClient = readClient()
    //lê qual o client que está sendo selecionado
    dbClient[index] = client
    //edita a partir do index, add o novo valor ao client
    setLocalStorage(dbClient)
    //salva a edição no localstorage
}

const delClient = (index) =>{
    const dbClient = readClient()
    dbClient.splice(index, 1)
    //splice vai selecionar o index e somente 1 a partir dele, no caso ele mesmo, e vai excluir;
    setLocalStorage(dbClient)
}

const isValidFields = () =>{
    return document.getElementById('form').reportValidity()
    //retorna se todos os inputs foram preenchidos
}

const clearFields = () =>{
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = '')
    //vai limpar os campos
}

//interação com o layout
const saveClient = () =>{
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        
        if(index == 'new'){
            createClient(client);
            updateTable()
            modalClose()
        } else {
            updateClient(index, client)
            updateTable()
            modalClose()
        }
        
    }
}

const createRow = (client, index) =>{
    const newRow = document.createElement('tr')
    //add uma nova linha na tabela
    newRow.innerHTML = `
    <td>${client.nome}</td>
    <td>${client.email}</td>
    <td>${client.celular}</td>
    <td>${client.cidade}</td>
    <td>
        <button class="green" type="button" id="edit-${index}">editar</button>
        <button class="red" type="button" id="delete-${index}">excluir</button>
    </td>
    `
    //essa nova linha vai receber esse td
    document.querySelector('#tbClient>tbody').appendChild(newRow)
}

const clearTable = () =>{
    const rows = document.querySelectorAll('#tbClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () =>{
    const dbClient = readClient()
    clearTable() //para não duplicar as informações da tabela, ela limpa primeiro o db
    dbClient.forEach(createRow)
}

const fillFields = (client) =>{
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) =>{
    const client = readClient()[index]
    //ele vai ler os dados do cliente do index determinado
    client.index = index //quando mandar o cliente para o fill o index vai junto
    fillFields(client)
    modalOpen()
}

const editDelete = (event) =>{
    if(event.target.type == 'button'){
        
        const [action, index] = event.target.id.split('-')
        
        if(action == 'edit'){
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
            if (response){
                delClient(index)
                updateTable()
            }
        }
    }
}

updateTable()

document.querySelector('#tbClient>tbody').addEventListener('click', editDelete)