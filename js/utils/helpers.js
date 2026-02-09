// js/utils/helpers.js - Funções auxiliares reutilizáveis

/**
 * Descobre o dia da semana (0 = domingo, 1 = segunda, ..., 6 = sábado)
 * @param {number} dia - Dia do mês (1 a 31)
 * @returns {string} Número como string (ex: "0" para domingo)
 */
function descobreDia(dia) {
    return new Date(selectAno(), selectMes() - 1, dia).getDay().toString();
}

/**
 * Retorna o último dia do mês atual (ex: 28, 30 ou 31)
 * @returns {number} Último dia do mês
 */
function UltimoDiaDoMes() {
    return new Date(selectAno(), selectMes(), 0).getDate();
}

/**
 * Pega o mês atual do localStorage
 * @returns {number} Mês (1 a 12)
 */
function selectMes() {
    return parseInt(localStorage.getItem("mes")) || (new Date().getMonth() + 1);
}

/**
 * Pega o ano atual do localStorage
 * @returns {number} Ano (ex: 2025)
 */
function selectAno() {
    return parseInt(localStorage.getItem("ano")) || new Date().getFullYear();
}

/**
 * Formata nomes com títulos (Pr., Miss., Ir.)
 * @param {string} nome - Nome da pessoa
 * @returns {string} Nome formatado
 */
function verificaTitulo(nome) {
    switch (nome) {
        case "Raimundo":
        case "Isaac Melo":
        case "Bruno Sousa":
        case "Pereira":
            return `Pr. ${nome}`;
        case "Rui":
        case "Marcio":
            return `Miss. ${nome}`;
        case "":
            return "";
        case "UMMAV":
        case "MCMAV":
        case "MCCAV":
        case "JUBAV":
        case "MIAV":
            return nome;
        default:
            return `Ir. ${nome}`;
    }
}

/**
 * Atualiza ícones de eventos em um dia específico
 * @param {number} dia - Dia do mês
 */
async function iconesEventos(dia) {
    const progDia = await programacaoDoDia(dia);
    if (!progDia.prog || progDia.prog.length === 0) return;

    const icones = document.querySelector(`#ic${vr.diasDaSem[descobreDia(dia)]}${dia} .iconesEventos`);
    if (!icones) return;

    icones.innerHTML = "";

    progDia.prog.forEach(evento => {
        const icone = document.createElement("ion-icon");

        switch (evento) {
            case "Aniv. da Igreja": icone.setAttribute("name", "star-outline"); break;
            case "Reunião": icone.setAttribute("name", "chatbubbles-outline"); break;
            case "Ceia": icone.setAttribute("name", "wine-outline"); break;
            case "Enc. de Casais": icone.setAttribute("name", "heart-outline"); break;
            case "Bazar": icone.setAttribute("name", "bag-handle-outline"); break;
            case "Fest. de Pizza": icone.setAttribute("name", "pizza-outline"); break;
            case "Cinema": icone.setAttribute("name", "film-outline"); break;
            case "Enc. de Jovens": icone.setAttribute("name", "people-circle"); break;
            case "Batismo": icone.setAttribute("name", "water-outline"); break;
            case "Dia do Pastor": icone.setAttribute("name", "person-outline"); break;
            case "Mutirão": icone.setAttribute("name", "hammer-outline"); break;
            case "Evangelismo": icone.setAttribute("name", "footsteps-outline"); break;
            case "PGM's": icone.setAttribute("name", "megaphone-outline"); break;
            default: return;
        }

        if (icone.getAttribute("name")) {
            icones.append(icone);
        }
    });
}

/**
 * Atualiza todos os ícones de aniversariantes (balões) no calendário
 */
async function atualizarIconesAniversariantes() {
    const mes = selectMes();
    const aniversariantes = await window.buscarAniversariantesDoMes(mes);

    for (let i = 1; i <= UltimoDiaDoMes(); i++) {
        const diaSem = vr.diasDaSem[descobreDia(i)];
        const container = document.querySelector(`#ic${diaSem}${i}`);

        if (!container) continue;

        const anivContainer = container.querySelector('div:last-child');
        if (anivContainer) anivContainer.innerHTML = '';

        if (aniversariantes[i] && aniversariantes[i].length > 0) {
            const iconeAniv = document.createElement("ion-icon");
            iconeAniv.setAttribute("name", "balloon");
            iconeAniv.style.color = "#d40404ff";
            iconeAniv.style.fontSize = "12px";
            iconeAniv.style.marginRight = "4px";
            anivContainer.append(iconeAniv);
        }
    }
}
