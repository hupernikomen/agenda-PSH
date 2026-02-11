// js/utils/helpers.js - Funções auxiliares reutilizáveis em vários componentes

/**
 * Pega o mês atual salvo no localStorage (ou mês corrente)
 * @returns {number} Mês (1 a 12)
 */
function selectMes() {
  return parseInt(localStorage.getItem("mes")) || (new Date().getMonth() + 1);
}

/**
 * Pega o ano atual salvo no localStorage (ou ano corrente)
 * @returns {number} Ano (ex: 2025)
 */
function selectAno() {
  return parseInt(localStorage.getItem("ano")) || new Date().getFullYear();
}

/**
 * Formata nomes com títulos apropriados (Pr., Miss., Ir.)
 * @param {string} nome - Nome da pessoa
 * @returns {string} Nome formatado com título
 */
function verificaTitulo(nome) {
  if (!nome || nome.trim() === "") return "";

  const nomeTrim = nome.trim();

  switch (nomeTrim) {
    case "Raimundo":
    case "Isaac Melo":
    case "Bruno Sousa":
    case "Pereira":
      return `Pr. ${nomeTrim}`;
    case "Rui":
    case "Marcio":
      return `Miss. ${nomeTrim}`;
    case "UMMAV":
    case "MCMAV":
    case "MCCAV":
    case "JUBAV":
    case "MIAV":
      return nomeTrim;
    default:
      return `Ir. ${nomeTrim}`;
  }
}

// Expõe as funções mais usadas globalmente (se necessário em outros arquivos)
window.selectMes = selectMes;
window.selectAno = selectAno;
window.verificaTitulo = verificaTitulo;