let items= {produtos:{},produtos_femininos:{},perUnit:{}}
let shopping = [{},{},{},{}]
let tProd = $("#tableProduct")
let tProdH = tProd.children[0]
let tProdB = tProd.children[1]
let tProdF = tProd.children[2]
let valueTot = 0 
let valueMascTot = 0 
let valueFemTot = 0  
let weightTot = 0 
let weightMascTot = 0 
let weightFemTot = 0 
let form = ""
let bonus = ""
let textEmail = ""
let transport = {mode:"", transportValue: "", totValue: "", box: "", cep:""}
let isCalculated = false
let basePriceArrey = [
    {base:"preço300", min:300, before:"preçoBase", title:"Tabela R$ 300,00", color:"#2296D3"}, 
    {base:"preço600", min:600, before:"preço300", title:"Tabela R$ 600,00", color:"#3A917E"}, 
    {base:"preço1500", min:1500, before:"preço600", title:"Tabela R$ 1500,00", color:"#6155FF"}
]
let tHeadPerValue = `
    <tr>
        <td colspan="6" class="center">
            <h1>Produtos Por preço</h1>
        </td>
    </tr>   
    <tr class="lable">
        <th>código</th>
        <th>Nome do produto</th>
        <th>Quantidade</th>
        <th class="price" colspan="2">V. unid</th>
        <th class="price">V. Tot</th>
    </tr>`

let tHeadPerUnit = `
    <tr>
        <td colspan="6" class="center">
            <h1>Produtos Por Unidade</h1>
        </td>
    </tr> 
    <tr class="lable">
        <th>código</th>
        <th>Nome do produto</th>
        <th>Quantidade</th>
        <th>V. min</th>
        <th>V. unid</th>
        <th>V. Tot</th>
    </tr>`

async function init(){
    await getItems()
    if(localStorage.getItem("shopping")){
        $("#MSave").style.display = "flex"
    }
    listing()
}
function saveLocalStore(){
    $("#MSave").style.display = "none"
    shopping = JSON.parse(localStorage.getItem("shopping"))
    listing()
    calculate("preçoBase", "#CCBC2D")
}
function descartLocalStore(){
    $("#MSave").style.display = "none"
    localStorage.removeItem("shopping")
    listing()
}

async function getItems(){
    await db.collection("produtos").get().then((snapshot)=>{
        snapshot.forEach(async doc=>{
            items.produtos[doc.id] = doc.data()
        })
    })
    await db.collection("produtos_femininos").get().then((snapshot)=>{
        snapshot.forEach(async doc=>{
            items.produtos_femininos[doc.id] = doc.data()
        })
    })
    await db.collection("perUnit").get().then((snapshot)=>{
        snapshot.forEach(async doc=>{
            items.perUnit[doc.id] = doc.data()
        })
    })
} 
function listing(){
    tProdB.innerHTML = tHeadPerValue
    categories.value_masc.forEach((category)=>{
        tProdB.innerHTML += `   <tr>
                                    <td colspan="6" class="category">${category}</td>
                                </tr>`
        Object.keys(items.produtos).forEach((produto, i)=>{
            if(items.produtos[produto].category == category){
                tProdB.innerHTML += `<tr id="item-${produto}">
                                        <td>${items.produtos[produto].id}</td>
                                        <td>${items.produtos[produto].name}</td>
                                        <td class="tdInput"><input type="number" onInput="update('${produto}', 0)" min="0" value="${shopping[0][produto]?shopping[0][produto].unit:''}"/></td>
                                        <td class="price" colspan="2">${items.produtos[produto].preçoBase.toFixed(2).replace(".", ",")}</td>
                                        <td class="price"></td>
                                    </tr>`
            }
        })
    })
    
    tProdB.innerHTML += tHeadPerUnit
    tProdB.innerHTML += `   <tr>
                                <td colspan="6" class="category">Minoxiplus</td>
                            </tr>`
    Object.keys(items.perUnit).forEach((produto, i)=>{
        if(items.perUnit[produto].category == "Minoxiplus"){
        tProdB.innerHTML += `<tr id="item-${produto}">
                                <td>${items.perUnit[produto].id}</td>
                                <td>${items.perUnit[produto].name}</td>
                                <td class="tdInput"><input type="number" onInput="update('${produto}', 1)" min="${items.perUnit[produto].amount[0].min}" value="${shopping[1][produto]?shopping[1][produto].unit:''}"/></td>
                                <td>${items.perUnit[produto].amount[0].min}</td>
                                <td>${items.perUnit[produto].amount[0].price.toFixed(2).replace(".", ",")}</td>
                                <td></td>
                            </tr>` }
    })
    categories.unit.forEach((category)=>{
        tProdB.innerHTML += `   <tr>
                                    <td colspan="3" class="category">${category}</td>
                                    <td class="category quantCategory">Quan.</td>
                                    <td colspan="2" class="category" id="amountPerfume">0</td>
                                </tr>`
        Object.keys(items.perUnit).forEach((produto, i)=>{
            if(items.perUnit[produto].category == category){
                tProdB.innerHTML += `<tr id="item-${produto}">
                                        <td>${items.perUnit[produto].id}</td>
                                        <td>${items.perUnit[produto].name}</td>
                                        <td class="tdInput"><input type="number" onInput="update('${produto}', 2)" min="${items.perUnit[produto].amount[0].min}" value="${shopping[2][produto]?shopping[2][produto].unit:''}"/></td>
                                        <td>${items.perUnit[produto].amount[0].min}</td>
                                        <td>${items.perUnit[produto].amount[0].price.toFixed(2).replace(".", ",")}</td>
                                        <td></td>
                                    </tr>` 
            }
        })
    })
    tProdB.innerHTML += `
    <tr>
        <th colspan="3" >Produto Valente</th>
        <th colspan="3" id="phaseFeminine" class="priceFem">Tabela R$ 140,00</th>
    </tr>
    <tr>
        <td colspan="6" class="center">
            <h1>Produtos Valência Feminina</h1>
        </td>
    </tr>   `
    categories.value_fem.forEach((category)=>{
        tProdB.innerHTML += `   <tr>
                                    <td colspan="6" class="categoryFem">${category}</td>
                                </tr>`
        Object.keys(items.produtos_femininos).forEach((produto, i)=>{
            if(items.produtos_femininos[produto].category == category){
                tProdB.innerHTML += `<tr id="item-${produto}">
                                        <td>${items.produtos_femininos[produto].id}</td>
                                        <td>${items.produtos_femininos[produto].name}</td>
                                        <td class="tdInput"><input type="number" onInput="update('${produto}', 3)" min="0" value="${shopping[3][produto]?shopping[3][produto].unit:''}"/></td>
                                        <td class="priceFem" colspan="2">${items.produtos_femininos[produto].preçoBase.toFixed(2).replace(".", ",")}</td>
                                        <td class="priceFem"></td>
                                    </tr>`
            }
        })
    })
}



function update(id, numArrey){
    shopping[numArrey][id] = {unit: $(`#item-${id}`).children[2].children[0].value}
    localStorage.setItem("shopping", JSON.stringify(shopping))
    $("#phase").innerHTML = "Tabela R$ 140,00"
    $("#phaseFeminine").innerHTML = "Tabela R$ 140,00"
    calculate("preçoBase", "preçoBase", "#CCBC2D", '#CCBC2D')
}


function calculate(basePrice, basePriceFem, color, colorFem){
    valueMascTot = Number(calculatePerValue(basePrice))     
    valueMascTot += Number(calculatePerUnit())    
    valueMascTot += Number(calculatePerfume())    
    valueFemTot = Number(calculatePerValueFeminine(basePriceFem))     
    valueTot = Number(valueMascTot + valueFemTot)
    weightMascTot = Number(calculateWeight())
    weightFemTot = Number(calculateWeightFeminine())
    weightTot = Number(weightMascTot + weightFemTot)
    Object.keys(items.produtos).forEach((produto, i)=>{
        if($(`#item-${produto}`))$(`#item-${produto}`).children[3].innerHTML = items.produtos[produto][basePrice].toFixed(2).replace(".", ",") 
    })
    Object.keys(items.produtos_femininos).forEach((produto, i)=>{
        if($(`#item-${produto}`))$(`#item-${produto}`).children[3].innerHTML = items.produtos_femininos[produto][basePrice].toFixed(2).replace(".", ",") 
    })
    $(`#somaMasc`).innerHTML = `R$: ${valueMascTot.toFixed(2).replace(".", ",") }`
    $(`#somaFem`).innerHTML = `R$: ${valueFemTot.toFixed(2).replace(".", ",") }`
    $(`#soma`).innerHTML = `R$: ${valueTot.toFixed(2).replace(".", ",") }`
    $('#TDemand').innerHTML = `Total da sua compra sem o frete R$: ${valueTot.toFixed(2).replace(".", ",") }`
    $(`#weightMasc`).innerHTML = `Kg: ${weightMascTot.toFixed(3).replace(".", ",") }`
    $(`#weightFem`).innerHTML = `Kg: ${weightFemTot.toFixed(3).replace(".", ",") }`
    $(`#weight`).innerHTML = `Kg: ${weightTot.toFixed(3).replace(".", ",") }`
    document.querySelectorAll(".price").forEach(element=>{
        element.style.backgroundColor = color
    })
    document.querySelectorAll(".priceFem").forEach(element=>{
        element.style.backgroundColor = colorFem
    })
    if(basePrice != "preço1500"){
        checkPriceBase(basePrice, basePriceFem, colorFem)
    }
    if(basePriceFem != "preço1500"){
        checkPriceBaseFeminine(basePriceFem, basePrice, color)
    }
}
function calculatePerValue(basePrice){
    let valueReturn = 0
    Object.keys(shopping[0]).forEach((id)=>{
        let value = items.produtos[id][basePrice] * shopping[0][id].unit
        shopping[0][id].price = value
        valueReturn += Number(value)
        $(`#item-${id}`).children[4].innerHTML = value.toFixed(2).replace(".", ",") 
    })
    return valueReturn
}
function calculatePerValueFeminine(basePrice){
    let valueReturn = 0
    Object.keys(shopping[3]).forEach((id)=>{
        let value = items.produtos_femininos[id][basePrice] * shopping[3][id].unit
        shopping[3][id].price = value
        valueReturn += Number(value)
        $(`#item-${id}`).children[4].innerHTML = value.toFixed(2).replace(".", ",") 
    })
    return valueReturn
}


function calculatePerUnit(){
    let valueReturn = 0
    Object.keys(shopping[1]).forEach((id)=>{
        let value = 0
        items.perUnit[id].amount.forEach(breakPoint=>{
            if(breakPoint.min<=shopping[1][id].unit){
                value = (breakPoint.price * shopping[1][id].unit).toFixed(2)
                shopping[1][id].price = value
                if($(`#item-${id}`)){
                    $(`#item-${id}`).children[3].innerHTML = breakPoint.min
                    $(`#item-${id}`).children[4].innerHTML = breakPoint.price.toFixed(2).replace(".", ",") 
                    $(`#item-${id}`).children[5].innerHTML = Number(value).toFixed(2).replace(".", ",") 
                }
            }
        })
        valueReturn += Number(value)
    })
    return valueReturn
}

function calculatePerfume(){
    let valueReturn = 0
    let amountPerfume = 0
    Object.keys(shopping[2]).forEach((id)=>{
        amountPerfume += Number(shopping[2][id].unit)
    })
    Object.keys(shopping[2]).forEach((id)=>{
        let value = 0
        items.perUnit[id].amount.forEach(breakPoint=>{
            if(breakPoint.min<=amountPerfume){
                value = (breakPoint.price * shopping[2][id].unit).toFixed(2)
                shopping[2][id].price = value
                if($(`#item-${id}`)){
                    $(`#item-${id}`).children[3].innerHTML = breakPoint.min
                    $(`#item-${id}`).children[4].innerHTML = breakPoint.price.toFixed(2).replace(".", ",") 
                    $(`#item-${id}`).children[5].innerHTML = Number(value).toFixed(2).replace(".", ",") 
                }
            }
        })
        valueReturn += Number(value)
    })
    document.querySelectorAll("#amountPerfume").forEach(element=>{
        element.innerHTML= amountPerfume
    })
    return valueReturn
}
function calculateWeight(){
    let valueReturn = 0
    Object.keys(shopping[0]).forEach((id)=>{
        let value = items.produtos[id]['weight'] * shopping[0][id].unit
        valueReturn += Number(value)
    })
    Object.keys(shopping[1]).forEach((id)=>{
        let value = items.perUnit[id]['weight'] * shopping[1][id].unit
        valueReturn += Number(value)
    })
    Object.keys(shopping[2]).forEach((id)=>{
        let value = items.perUnit[id]['weight'] * shopping[2][id].unit
        valueReturn += Number(value)
    })
    return valueReturn
}
function calculateWeightFeminine(){
    let valueReturn = 0
    Object.keys(shopping[3]).forEach((id)=>{
        let value = items.produtos_femininos[id]['weight'] * shopping[3][id].unit
        valueReturn += Number(value)
    })
    return valueReturn
}
function checkPriceBase(basePrice, baseFem, colorFem){
    basePriceArrey.forEach(baseObj=>{
        let valueCalc = 0
        Object.keys(shopping[0]).forEach((id)=>{
            let value = items.produtos[id][baseObj.base] * shopping[0][id].unit
            valueCalc += value
        })   
        Object.keys(shopping[1]).forEach((id)=>{
            let value = 0
            items.perUnit[id].amount.forEach(breakPoint=>{
                if(breakPoint.min<=shopping[1][id].unit){
                    value = (breakPoint.price * shopping[1][id].unit).toFixed(2)
                }
            })
            valueCalc += Number(value)
        })
        let amountPerfume = 0
        Object.keys(shopping[2]).forEach((id)=>{
            amountPerfume += Number(shopping[2][id].unit)
        })
        Object.keys(shopping[2]).forEach((id)=>{
            let value = 0
            items.perUnit[id].amount.forEach(breakPoint=>{
                if(breakPoint.min<=amountPerfume){
                    value = (breakPoint.price * shopping[2][id].unit).toFixed(2)
                }
            })
            valueCalc += Number(value)
        })
        if(valueCalc >= baseObj.min && basePrice == baseObj.before){
            $("#phase").innerHTML = baseObj.title
            calculate(baseObj.base, baseFem, baseObj.color, colorFem)
        }
    })
}
function checkPriceBaseFeminine(basePrice, base, color){
    basePriceArrey.forEach(baseObj=>{
        let valueCalc = 0
        Object.keys(shopping[3]).forEach((id)=>{
            let value = items.produtos_femininos[id][baseObj.base] * shopping[3][id].unit
            valueCalc += value
        })   
        if(valueCalc >= baseObj.min && basePrice == baseObj.before){
            $("#phaseFeminine").innerHTML = baseObj.title
            calculate(base, baseObj.base, color, baseObj.color)
        }
    })
}

function searchItem(){
    tProdB.innerHTML = tHeadPerValue
    Object.keys(items.produtos).forEach(item=>{
        if(items.produtos[item].name.toLowerCase().includes($('#search').value.toLowerCase())){
            tProdB.innerHTML += `
                        <tr id="item-${item}">
                            <td>${items.produtos[item].id}</td>
                            <td>${items.produtos[item].name}</td>
                            <td class="tdInput"><input type="number" onInput="update('${item}', 0)" min="0" value="${shopping[0][item]?shopping[0][item].unit:''}"/></td>
                            <td class="price" colspan="2">${items.produtos[item].preçoBase.toFixed(2)}</td>
                            <td class="price"></td>
                        </tr>`
        }
    })
    tProdB.innerHTML += tHeadPerUnit
    
    Object.keys(items.perUnit).forEach(item=>{
        if(items.perUnit[item].name.toLowerCase().includes($('#search').value.toLowerCase())){
            if(items.perUnit[item].category == "Minoxiplus"){
                tProdB.innerHTML += `<tr id="item-${item}">
                                        <td>${items.perUnit[item].id}</td>
                                        <td>${items.perUnit[item].name}</td>
                                        <td class="tdInput"><input type="number" onInput="update('${item}', 1)" min="${items.perUnit[item].amount[0].min}" value="${shopping[1][item]?shopping[1][item].unit:''}"/></td>
                                        <td>${items.perUnit[item].amount[0].min}</td>
                                        <td>${items.perUnit[item].amount[0].price}</td>
                                        <td></td>
                                    </tr>` 
            }
        }
    })
    categories.unit.forEach((category)=>{
        Object.keys(items.perUnit).forEach((item, i)=>{
            if(items.perUnit[item].name.toLowerCase().includes($('#search').value.toLowerCase())){
                if(items.perUnit[item].category == category){
                    tProdB.innerHTML += `<tr id="item-${item}">
                                            <td>${items.perUnit[item].id}</td>
                                            <td>${items.perUnit[item].name}</td>
                                            <td class="tdInput"><input type="number" onInput="update('${item}', 2)" min="${items.perUnit[item].amount[0].min}" value="${shopping[2][item]?shopping[2][item].unit:''}"/></td>
                                            <td>${items.perUnit[item].amount[0].min}</td>
                                            <td>${items.perUnit[item].amount[0].price}</td>
                                            <td></td>
                                        </tr>` 
                }
            }
        })
    })
    tProdB.innerHTML += `
    <tr>
        <th colspan="3" >Produto Valente</th>
        <th colspan="3" id="phaseFeminine" class="priceFem">Tabela R$ 140,00</th>
    </tr>
    <tr>
        <td colspan="6" class="center">
            <h1>Produtos Valência Feminina</h1>
        </td>
    </tr>   `
    categories.value_fem.forEach((category)=>{
        tProdB.innerHTML += `   <tr>
                                    <td colspan="6" class="category">${category}</td>
                                </tr>`
        Object.keys(items.produtos_femininos).forEach((produto, i)=>{
            if(items.produtos_femininos[produto].name.toLowerCase().includes($('#search').value.toLowerCase())){
                tProdB.innerHTML += `<tr id="item-${produto}">
                                        <td>${items.produtos_femininos[produto].id}</td>
                                        <td>${items.produtos_femininos[produto].name}</td>
                                        <td class="tdInput"><input type="number" onInput="update('${produto}', 3)" min="0" value="${shopping[3][produto]?shopping[3][produto].unit:''}"/></td>
                                        <td class="priceFem" colspan="2">${items.produtos_femininos[produto].preçoBase.toFixed(2).replace(".", ",")}</td>
                                        <td class="priceFem"></td>
                                    </tr>`
            }
        })
    })
    if($('#search').value == ""){
        listing()
    }
    calculate("preçoBase", "rgb(255, 255, 96)")
}

function check(){
    let select = $("#shippingMode")
    let selected = select.options[select.selectedIndex].value
    if($("#payment").options[$("#payment").selectedIndex].value == ""){
        alert("Escolha sua forma de pagamento")
        return
    }
    switch (selected) {
        case "Calcular": 
            if(weightTot<30){
                showModal("MConfirmKangu");
                isCalculated = true
            } else {
                showModal("MConfirmClient"); 
                alert("Peso maior de 30Kg, iremos fazer isso manualmente")
                transport.mode = "kangu"
                transport.transportValue  = "(vamos calcular)"
                transport.totValue = "(vamos calcular)"
            }
            $('#msmCalcFrete').style.display = 'none'
            break;
        case "Preferencia": 
            showModal("MPreferredShipping");
            transport.transportValue = "(vamos calcular)"
            transport.totValue  = "(vamos calcular)"
            bonus = "%0A*Bonificação*:%20(vamos combinar)"
            break;
        case "bras": 
            showBras();
            transport.mode = "Ônibus Bras"
            transport.transportValue = Number(Math.ceil(weightTot / 25) * 30).toFixed(2)
            transport.totValue = Number(Number(Math.ceil(weightTot / 25) * 30) + valueTot).toFixed(2)
            transport.box = `%0A*Número%20de%20caixas*:%20${Math.ceil(Math.ceil(weightTot) / 25)}`
            $('#msmCalcFrete').style.display = 'none'
            break;
        default: alert('Escolha a sua forma de envio')
            break;
    }
}

function enviar(){
    let name = $("#name").value
    let shopp = ""
    let shoppFem = ""
    let payment = $("#payment").options[$("#payment").selectedIndex].value
    let triggerBot = ""
    if(payment=="Pix" && isCalculated){
        triggerBot = "%23PIX"
    }
    let data = new Date()
    let day = data.getDate().toString();
    let dayF = (day.length == 1) ? '0'+day : day;
    let month  = (data.getMonth()+1).toString();
    let monthF = (month.length == 1) ? '0'+month : month;
    let yearF = data.getFullYear();
    let obs = ""
    if($("#textOBS").value != ""){
        obs = `%0A*Observação*:%20${$("#textOBS").value}`
    }
    Object.keys(shopping[0]).forEach((id)=>{
        if(shopping[0][id].unit>0)
        shopp += `COD: (${items.produtos[id].id}) ${items.produtos[id].name} %0A     Valor Unid R$: *${Number(shopping[0][id].price/shopping[0][id].unit).toFixed(2)}* Quantidade: *${shopping[0][id].unit}*%0A     Tot: *R$ ${Number(shopping[0][id].price).toFixed(2).replace(".", ",")}*%0A----------------------------------------------------%0A`
    })
    Object.keys(shopping[1]).forEach((id)=>{
        if(shopping[1][id].unit>0)
        shopp += `COD:(${items.perUnit[id].id}) ${items.perUnit[id].name} %0A     Valor Unid R$: *${Number(shopping[1][id].price/shopping[1][id].unit).toFixed(2)}* Quantidade: *${shopping[1][id].unit}*%0A     Tot: *R$ ${Number(shopping[1][id].price).toFixed(2).replace(".", ",")}*%0A----------------------------------------------------%0A`
    })
    Object.keys(shopping[2]).forEach((id)=>{
        if(shopping[2][id].unit>0)
        shopp += `COD:(${items.perUnit[id].id}) ${items.perUnit[id].name} %0A     Valor Unid R$: *${Number(shopping[2][id].price/shopping[2][id].unit).toFixed(2)}* Quantidade: *${shopping[2][id].unit}*%0A     Tot: *R$ ${Number(shopping[2][id].price).toFixed(2).replace(".", ",")}*%0A----------------------------------------------------%0A`
    })
    Object.keys(shopping[3]).forEach((id)=>{
        if(shopping[3][id].unit>0)
        shoppFem += `COD:(${items.produtos_femininos[id].id}) ${items.produtos_femininos[id].name} %0A     Valor Unid R$: *${Number(shopping[3][id].price/shopping[3][id].unit).toFixed(2)}* Quantidade: *${shopping[3][id].unit}*%0A     Tot: *R$ ${Number(shopping[3][id].price).toFixed(2).replace(".", ",")}*%0A----------------------------------------------------%0A`
    })
    location.href = `
                    https://wa.me/5511969784323?text=*Esse%20é%20meu%20pedido*%20${triggerBot}%0A------------------------------%0A*Data:*%20${dayF}%20/%20${monthF}%20/%20${yearF}%0A*Nome:*%20${name.replaceAll(" ", "%20")}%0A${form}${transport.cep}${textEmail}==============================%0A*Envio%20via:*%20${transport.mode}${transport.box}%0A*Peso%20Total:*%20${weightTot.toFixed(2).toString().replace(".", ",")}%20Kg%0A*Forma%20de%20Pagamento:*%20${payment}%0A*Valor%20Valente%20Barbearia:*%20R$%20${valueMascTot.toFixed(2).toString().replace(".", ",")}%0A*Valor%20Valência%Salon:*%20R$%20${valueFemTot.toFixed(2).toString().replace(".", ",")}%0A*Valor%20do%20frete*:%20R$%20${transport.transportValue}%0A*Total:*%20R$%20${transport.totValue}%0A==============================${obs}${bonus}%0A==============================%0A*Produtos%20Valente%20Barbearia:*%0A%0A${shopp.replaceAll(" ", "%20")}%0A==============================%0A*Produtos%20Valência%20Salon:*%0A%0A${shoppFem.replaceAll(" ", "%20")}%0A==============================%0A%0A*Nossa%20equipe%20Valente%20agradece%20seu%20pedido*%0A%0A==============================%0A
                        `
}

init()
