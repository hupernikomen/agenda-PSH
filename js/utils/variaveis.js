// js/utils/variaveis.js - Constantes e estado global

window.colecaoAtual = "agenda-igreja1";  // igreja padrão

function getColecaoAgenda() {
  return window.colecaoAtual || "agenda-igreja1";
}

function getColecaoAniversariantes() {
  if (!window.colecaoAtual) return "aniversariantes-igreja1";
  return "aniversariantes-" + window.colecaoAtual.split('-')[1];
}

const vr = {
  meses: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
  diasDaSem: ["dom", "seg", "ter", "qua", "qui", "sex", "sab"],

  eventos: [
    "Reunião", "Aniv. da Igreja", "Batismo", "Bazar", "Ceia", 
    "Dia do Pastor", "EBD", "Evangelismo", "Enc. de Casais", 
    "Cinema", "Fest. de Pizza", "Mutirão", "Reunião de Ministros", "PGM's"
  ],

  pastores: ["Bruno Sousa", "Isaac Melo", "Marcio", "Paulo Leão", "Raimundo"],


};
