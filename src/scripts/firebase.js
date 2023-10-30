const firebaseConfig = {
    apiKey: "AIzaSyAunSOidGayGgkLZ0VgxX6QSbSE_01Qp14",
    authDomain: "tabela-valente.firebaseapp.com",
    projectId: "tabela-valente",
    storageBucket: "tabela-valente.appspot.com",
    messagingSenderId: "110126552189",
    appId: "1:110126552189:web:1df81a03c0a7c0e6a24d14"
  };
  
const app = firebase.initializeApp(firebaseConfig);
let db = app.firestore()

function $(item){
  return document.querySelector(item)
}
function cancel(){
  document.querySelectorAll('.modal').forEach(element=>{
    element.style.display = "none"
  })
}
const collection = ['produtos','produtos_femininos','perUnit']
const categories = {
  value_masc: [
    "Pomadas Modeladoras 150gr",
    "Pomadas Modeladoras 80gr",
    "Pomadas Modeladoras 25gr",
    "Gel",
    "Barba",
    "Linha MENTA e TEA TREE",
    "Progressivas",
    "Kit linha perfume SH, Cond, Balm e óleo",
    "Shampo Perfume",
    "Condicionador Perfume",
    "Balm Perfume 150Gr",
    "Balm Perfume 80Gr",
    "Óleo Perfume"
  ],
  value_fem: [
    'LINHA S.O.S',
    "LINHA D'PANTENOL",
    'LINHA MANDIOCA',
    'LINHA TEA TREE',
    'LINHA VERNIZ',
    'LINHA VIP GOLD',
    'LINHA DESMAIA CABELO',
    'LINHA DAMA MILLION',
    'PROGRESSIVA SEM FORMOL ARGAN',
    'PROGRESSIVA CACAU',
    'PROGRESSIVA DEFINITIVA GOLD',
    'PROGRESSIVA MEGA PROGRESS 24K',
    'PROGRESSIVAS DE 120GR',
    'MINOXIPLUS TEA TREE 15%',
  ],
  unit: [
    "Perfume Tradicional",
    "Perfume para barba com Minoxiplus"
  ],
}