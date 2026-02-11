// js/utils/variaveis.js - Constantes globais e configurações fixas

// Coleção padrão (pode ser sobrescrita pelo HeaderIgreja)
window.colecaoAtual = "agenda-igreja1";

// Objeto principal com listas e arrays fixos
const vr = {
  meses: [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ],

  diasDaSem: ["dom", "seg", "ter", "qua", "qui", "sex", "sab"],

  // Sugestões para o campo de Eventos/Programação
  eventos: [
    "Reunião",
    "Aniv. da Igreja",
    "Batismo",
    "Bazar",
    "Ceia",
    "Dia do Pastor",
    "EBD",
    "Evangelismo",
    "Enc. de Casais",
    "Cinema",
    "Fest. de Pizza",
    "Mutirão",
    "Reunião de Ministros",
    "PGM's"
  ],

  // Sugestões para o campo de Pregador
  pastores: [
    "Bruno Sousa",
    "Isaac Melo",
    "Marcio",
    "Paulo Leão",
    "Raimundo"
  ],

  // Se houver outras listas fixas (ex: atalaias, infantil), podem ser adicionadas aqui no futuro
  // atalaias: ["Nome1", "Nome2", ...],
  // infantil: ["NomeA", "NomeB", ...],
};

// Expõe globalmente (já era usado assim em vários arquivos)
window.vr = vr;