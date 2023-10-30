function showModal(element){
    cancel()
    
    if($("#name").value == ""){
        alert("preencha seu nome completo")
        return
    } 
    if(valueTot < 140 ){
        alert("valor minimo de compre é 140R$")
        return
    }
    $("#" + element).style.display = "flex"
}

function resetSaveAndReload(){
    cancel()
    shopping = [{},{},{}]
    descartLocalStore()
    calculate("preçoBase", "#CCBC2D")
    $("#phase").innerHTML = "Tabela R$ 140,00"
}

function showBras(){
    cancel()
    $("#listBras").innerHTML = `
        <li>Peso Total: ${weightTot} Kg</li>
        <li>Numero de caixas: ${Math.ceil(weightTot / 25)}</li>
        <li>Valor total do frete: R$ ${Math.ceil(weightTot / 25) * 30}</li>
    `
    $("#MConfirmBras").style.display = "flex"
}

function confirmPref(){
    if($("#preferredShipping").value){
        transport.mode = $("#preferredShipping").value
    } else {
        alert("preencha qual o sua transportadora de preferencia")
        return
    }
    showModal("MConfirmClient")
}

function createCadastro(){
    let numero  = $("#numero").value
    let bairro  = $("#bairro").value
    let cep = $("#cep").value
    let cidade  = $("#cidade").value
    let estado  = $("#estado").value
    let tel = $("#tel").value
    let email = $("#email").value
    let address = $("#address").value
    let cpf = $("#cpf").value.replaceAll(".", "").replaceAll("-", "")
    if(numero == "" && bairro == "" && cep == "" && cidade == "" && estado == "" && tel == "" && email == "" && address == "" && cpf){
        alert("preencha todas as informações")
        return
    }
    db.collection("client").doc(cpf).get().then((doc)=>{
        if(doc.exists){
            alert("você já tem seu registro ")
            $("#modal").style.display = "none"
        } else {
            db.collection("client").doc(cpf).set({
                name: $("#name").value,
                numero,
                bairro,
                cep,
                cidade,
                estado,
                tel,
                email,
                address,
                cpf
            })
            form += `*CNPJ/CPF:*%20${cpf}%0A*Endereço:*%20${address}%20%20%20%20%20*Num:*%20${numero}%0A*Bairro:*%20${bairro}%0A*Cidade:*%20${cidade}%20%20%20%20%20*Estado:*%20${estado}%0A`
            transport.cep == "" ? transport.cep = `*CEP:*%20${cep}` : transport.cep = transport.cep
            textEmail = `*Email:*%20${email}%0A`
            showModal("MComplete")
        }
    })
}

function confirmCpf(){
    let confirmCpf = $("#confirmCpf").value.replaceAll(".", "").replaceAll("-", "")
    if(confirmCpf == ""){
        alert("Preencha com o seu Cpf")
        return
    }
    db.collection("client").doc(confirmCpf).get().then((doc)=>{
        if(doc.exists){
            form = `*CNPJ/CPF:*%20${confirmCpf}%0A*Endereço:*%20${doc.data().address}%20%20%20%20%20*Num:*%20${doc.data().numero}%0A*Bairro*:%20${doc.data().bairro}%0A*Cidade:*%20${doc.data().cidade}%20%20%20%20%20*Estado:*%20${doc.data().estado}%0A`
            transport.cep == "" ? transport.cep = `*CEP:*%20${doc.data().cep}%0A` : transport.cep = transport.cep
            textEmail = `*Email:*%20${doc.data().email}%0A`
            $("#confirmCpf").style.backgroundColor = "#83FF83"
            setTimeout(()=>{
                showModal("MComplete")
            }, 1000)
        } else {
            $("#confirmCpf").style.backgroundColor = "#F54E4C"
            setTimeout(()=>{
                alert("registro não encontrado, tente de novo pelo CNPJ ou CPF")
                showModal("MRegisterError")
            }, 1000)
        }
    })
}

function calcKangu(){
    if($("#kanguCep").value == ""){
        alert("Escreva seu cep para calcularmos")
        return
    }
    transport.cep = `*CEP:*%20${$("#kanguCep").value}%0A`
    fetch(`http://valentecosmeticos.com/api/?cepDestino=${$("#kanguCep").value}&peso=${weightTot}&valor=${valueTot}`).then(res=>res.json()).then((json)=>{
        $("#optionsKangu").innerHTML = ""
        json.forEach(element => {
            let valueFreteRef = element.vlrFrete < 35 ? 35 : element.vlrFrete
            $("#optionsKangu").innerHTML += `
            <div onclick="handleKangu('${element.transp_nome}', '${valueFreteRef}')">
                <h3>${element.transp_nome}</h3>
                <span> ${(element.prazoEnt - 1)} - ${(element.prazoEnt + 1)} dias úteis</span>
                <span>R$: ${valueFreteRef}</span>
            </div>`
        });
        showModal("MSelectKangu")
    })
}

function handleKangu(name, value){
    transport.mode = name
    transport.transportValue  = Number(value).toFixed(2)
    transport.totValue = Number(Number(valueTot) + Number(value)).toFixed(2)
    cancel()
    showBonus()
}

function showBonus(){
    showModal("MBonus")
    let brasValue = Number(transport.transportValue)
    if(brasValue <= 65){
        $("#optionsBonus").innerHTML = `
        <input type="button" value="1 Minoxiplus 15% 120ML" onclick="saveBonus('1%20Minoxiplus%2015%%20120ML')"/>
        <input type="button" value="1 Minoxiplus 15% 60ML" onclick="saveBonus('1%20Minoxiplus%2015%%2060ML')"/>
        <input type="button" value="1 Minoxiplus 8% 60ML" onclick="saveBonus('1%20Minoxiplus%208%%2060ML')"/>
        <input type="button" value="1 Pomada em pó" onclick="saveBonus('1%20Pomada%20em%20pó')"/>
        `
    }
    if(brasValue > 65 && brasValue <= 100){
        $("#optionsBonus").innerHTML = `
        <input type="button" value="2 Minoxiplus 15% 120ML" onclick="saveBonus('2%20Minoxiplus%2015%%20120ML')"/>
        <input type="button" value="2 Minoxiplus 15% 60ML" onclick="saveBonus('2%20Minoxiplus%2015%%2060ML')"/>
        <input type="button" value="2 Minoxiplus 8% 60ML" onclick="saveBonus('2%20Minoxiplus%208%%2060ML')"/>
        <input type="button" value="2 Pomada em pó" onclick="saveBonus('2%20Pomada%20em%20pó')"/>
        `
    }
    if(brasValue > 100){
        $("#optionsBonus").innerHTML = `
        <input type="button" value="3 Minoxiplus 15% 120ML" onclick="saveBonus('3%20Minoxiplus%2015%%20120ML')"/>
        <input type="button" value="3 Minoxiplus 15% 60ML" onclick="saveBonus('3%20Minoxiplus%2015%%2060ML')"/>
        <input type="button" value="3 Minoxiplus 8% 60ML" onclick="saveBonus('3%20Minoxiplus%208%%2060ML')"/>
        <input type="button" value="3 Pomada em pó" onclick="saveBonus('3%20Pomada%20em%20pó')"/>
        `
    }
}

function saveBonus(text){
    bonus = `%0A*Bonificação*:%20${text}`
    showModal("MConfirmClient")
}






