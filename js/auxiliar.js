// Retorna o dia da semana
function descobreDia(dia) {
    return new Date(selectAno(), selectMes() - 1, dia).getDay().toString()
}

// Captura o ultimo dia do mes a partir do dia 1 do mes seguinte
function UltimoDiaDoMes() {
    return new Date(selectAno(), selectMes(), 1 - 1).getDate()
}

function selectMes() { return localStorage.getItem("mes") }

function selectAno() { return localStorage.getItem("ano") }

function programacaoDoDia(i) {

    if (localStorage.getItem(`${i}`) == null) {
        return { prog: "", preg: "", dir: "", est: "", ata1: "", ata2: "", inf1: "", inf2: ""}

    } else {

        return JSON.parse(localStorage.getItem(`${i}`))
    }
}

