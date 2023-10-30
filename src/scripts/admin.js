let sex = ''
let collectionForDelet = ''
async function init(){
    $("main").innerHTML = ""
    await db.collection("produtos").get().then((snapshot)=>{
        listItemsPerValue(snapshot, 'produtos', 'm')
    })
    await db.collection("perUnit").get().then((snapshot)=>{
        listItemsPerUnit(snapshot)
    })
    await db.collection("produtos_femininos").get().then((snapshot)=>{
        listItemsPerValue(snapshot, 'produtos_femininos', 'f')
    })
}

function listItemsPerValue(items, collection, inputSex){
    items.forEach(doc=>{
        let classes
        if(!doc.data().weight || !doc.data().name || !doc.data().id){
            classes =  "card warning"
        } else {
            classes =  "card"
        }
        $("main").innerHTML +=`
            <div class="${classes}">
                <h1>${doc.data().name}</h1>
                <div>
                    <ul>
                        <li>R$: ${doc.data().preçoBase.toFixed(2)}</li>
                        <li>R$: ${doc.data().preço300.toFixed(2)}</li>
                        <li>R$: ${doc.data().preço600.toFixed(2)}</li>
                        <li>R$: ${doc.data().preço1500.toFixed(2)}</li>
                    </ul>
                    <div class="inputs">
                        <input type="button" value="Alterar" onclick="setItemsPerValue('${doc.id}', '${inputSex}')">
                        <input type="button" value="Apagar" onclick="consfirDelet('${doc.id}', '${collection}')">
                    </div>
                </div>
            </div>
        `
    })
}
function listItemsPerUnit(items){
    items.forEach(doc=>{
        let classes
        if(!doc.data().weight || !doc.data().name || !doc.data().id){
            classes =  "card warning"
        } else {
            classes =  "card"
        }
        let listPrice = doc.data().amount.map((obj)=>`<li>até ${obj.min}: ${obj.price}</li>`)
        $("main").innerHTML +=`
            <div class="${classes}">
                <h1>${doc.data().name}</h1>
                <div>
                    <ul>
                        ${listPrice.join('')}
                    </ul>
                    <div class="inputs">
                        <input type="button" value="Alterar" onclick="setItemsPerUnit('${doc.id}')">
                        <input type="button" value="Apagar" onclick="consfirDelet('${doc.id}')">
                    </div>
                </div>
            </div>
        `
    })
}
function addProduct(){
    $("#modalSelect").style.display = "flex"
}

function showAddPerValue(inputSex){
    $("#titleFunction").innerHTML = "Adicionar"
    $("#itemIdPerValue").value = ""
    $("#namePerValue").value = ""
    $("#weightPerValue").value = ""
    $("#pBasePerValue").value = ""
    $("#p300PerValue").value = ""
    $("#p600PerValue").value = ""
    $("#p1500PerValue").value = ""
    $("#productIDPerValue").value = ""
    $("#modalSelect").style.display = "none"
    $("#modalPerValue").style.display = "flex"
    sex = inputSex   
    $('#selectItemPerValue').innerHTML = ''
    if(inputSex == "m"){
        categories.value_masc.forEach(category=>{
            $('#selectItemPerValue').innerHTML += `<option value="${category}">${category}</option>` 
        })
        return
    }
    categories.value_fem.forEach(category=>{
        $('#selectItemPerValue').innerHTML += `<option value="${category}">${category}</option>` 
    })
}
function showAddPerUnit(){
    $("#namePerUnit").value = ""
    $("#weightPerUnit").value = ""
    $("#itemIdPerUnit").value = ""
    $("#productIDPerUnit").value = ""
    $("#sectionPerUnit").innerHTML = `     <div>
                                                <input type="number" min="0" placeholder="Minimo da compra">
                                                <input type="number" min="0" placeholder="Preço por Unidade">
                                            </div>` 
    $("#modalSelect").style.display = "none"
    $("#modalPerUnit").style.display = "flex"
}


function addBrackPoint(){
    $("#sectionPerUnit").insertAdjacentHTML("beforeend", ` <div>
    <input type="number" min="0" placeholder="Minimo da compra">
    <input type="number" min="0" placeholder="Preço por Unidade">
</div>`
)

}  



async function setItemsPerValue(id){
    $("#productIDPerValue").value = id
    await db.collection("produtos").doc(id).get().then((snapshot)=>{
        $("#namePerValue").value = snapshot.data().name
        $("#weightPerValue").value = snapshot.data().weight
        $("#pBasePerValue").value = snapshot.data().preçoBase
        $("#p300PerValue").value = snapshot.data().preço300
        $("#p600PerValue").value = snapshot.data().preço600
        $("#p1500PerValue").value = snapshot.data().preço1500
        $("#itemIdPerValue").value =  snapshot.data().id
        for( i of $("#selectItemPerValue").options){
            if(i.value == snapshot.data().category){
                i.selected = true
            }
        }
    })
    $("#titleFunction").innerHTML = "Alterar"
    $("#modalPerValue").style.display = "flex"
}
async function setItemsPerUnit(id){
    $("#sectionPerUnit").innerHTML = ""
    await db.collection("perUnit").doc(id).get().then((snapshot)=>{
        $("#namePerUnit").value = snapshot.data().name
        $("#weightPerUnit").value = snapshot.data().weight
        $("#itemIdPerUnit").value = snapshot.data().id
        $("#productIDPerUnit").value = id
        for( i of $("#selectItemPerUnit").options){
            if(i.value == snapshot.data().category){
                i.selected = true
            }
        }
        snapshot.data().amount.forEach(obj=>{
            $("#sectionPerUnit").insertAdjacentHTML("beforeend", ` 
                <div>
                    <input type="number" min="0" placeholder="Minimo da compra" value="${obj.min}">
                    <input type="number" min="0" placeholder="Preço por Unidade" value="${obj.price}">
                </div>`)
        })
    })
    $("#modalPerUnit").style.display = "flex"
}
function sendPerUnit(){
    let name =  $("#namePerUnit").value
    let weight = Number($("#weightPerUnit").value)
    let select = $("#selectItemPerUnit")
    let category = select.options[select.selectedIndex].value
    let id = Number($("#itemIdPerUnit").value)
    let amount = []
    for( element of $("#sectionPerUnit").children){
        if(element.children[0].value > 0){
            let obj = {min: Number(element.children[0].value), price: Number(element.children[1].value)}
            amount.push(obj)
        }
        amount.sort((a,b)=>{
            if(a.min>b.min) return 1;
            if(a.min<b.min) return -1;
            return 0
        })
    }
    if($("#productIDPerUnit").value == ""){
        db.collection("perUnit").add({
            name, weight, category, id, amount
        }).then(()=>{
            location.reload()
        })
    } else {
        db.collection("perUnit").doc($("#productIDPerUnit").value).set({
            name, weight, category, id, amount
        }).then(()=>{
            location.reload()
        })
    }
}

function sendPerValue(){
    let collection
    if(sex == 'm'){
        collection = 'produtos'
    } else {
        collection = 'produtos_femininos'
    }
    if($("#productIDPerValue").value == ""){
        let select = $("#selectItemPerValue")
        db.collection(collection).add({
            name: $("#namePerValue").value,
            weight: Number($("#weightPerValue").value),
            preçoBase: Number($("#pBasePerValue").value),
            preço300: Number($("#p300PerValue").value),
            preço600: Number($("#p600PerValue").value),
            preço1500: Number($("#p1500PerValue").value),
            id: Number($("#itemIdPerValue").value),
            category: select.options[select.selectedIndex].value
        }).then(()=>{
            location.reload()
        })
    } else {
        let select = $("#selectItemPerValue")
        db.collection(collection).doc($("#productIDPerValue").value).set({
            name: $("#namePerValue").value,
            weight: Number($("#weightPerValue").value),
            preçoBase: Number($("#pBasePerValue").value),
            preço300: Number($("#p300PerValue").value),
            preço600: Number($("#p600PerValue").value),
            preço1500: Number($("#p1500PerValue").value),
            id: Number($("#itemIdPerValue").value),
            category: select.options[select.selectedIndex].value
        }).then(()=>{
            location.reload()
        })
    }
}
function consfirDelet(id, collection){
    collectionForDelet = collection
    $("#modalDelet").style.display = "flex"
    $("#deletId").value = id
}
function delet(){
    db.collection(collectionForDelet).doc($("#deletId").value).delete().then(()=>{
        location.reload()
    })
}


init()