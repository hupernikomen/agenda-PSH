if (!localStorage.getItem('mes') || !localStorage.getItem('ano')) {
    localStorage.setItem('mes', new Date().getMonth() + 1)
    localStorage.setItem("ano", new Date().getFullYear())


}
$('.mes').html(selectMes() == null ? "-" : vr.meses[selectMes() - 1])

function criacaoDoDia() {

    let primeiroDia = vr.diasDaSem.indexOf(vr.diasDaSem[descobreDia(1)])

    document.querySelectorAll('.tabelaCalendario td').forEach(x => x.innerHTML = "")

    for (let i = 0; i < vr.diasDaSem.length; i++) {
        let td = document.createElement('td')
        td.className = vr.diasDaSem[i]
        vr.ElTbCalendario.append(td)
    }

    listagemAniversariantes(primeiroDia)
    avisos(primeiroDia)
    blocosInvisiveis(primeiroDia)

    for (let i = 1; i <= UltimoDiaDoMes(); i++) {

        let colunaSemana = document.querySelector(`.${vr.diasDaSem[descobreDia(i)]}`)
        let blocoDia = document.createElement('div')
        blocoDia.className = 'blocoDia'
        blocoDia.id = vr.diasDaSem[descobreDia(i)] + i

        blocoDia.append(topoDoDia(i, vr.diasDaSem[descobreDia(i)]), corpoDoDia(i), containerIcones(i))
        colunaSemana.append(blocoDia)

        document.querySelector(`#${vr.diasDaSem[descobreDia(i)]}${i}`)
            .addEventListener("click", () => {

                if (vr.ElEDia.innerHTML != i)
                    fecharEdicao()

                setTimeout(() => {
                    editarDia(i)
                }, 250);

            })
    }
}

function topoDoDia(dia, semana) {

    let tagTopoDia = document.createElement("span")
    let tagTopoSemana = document.createElement("span")
    let topo = document.createElement('div')

    topo.className = "topo"
    semana == "dom" ? topo.id = "domRed" : topo.id = "semNorm"

    tagTopoDia.append(dia)
    tagTopoSemana.append(semana)
    topo.append(tagTopoSemana, tagTopoDia)

    return topo

}

function corpoDoDia(dia) {

    let programacaoDoDia = document.createElement('span')
    programacaoDoDia.className = "programacao"
    programacaoDoDia.id = `programacao${dia}`

    let dirigenteDoDia = document.createElement('span')
    dirigenteDoDia.className = ""
    dirigenteDoDia.id = `dirigente${dia}`

    let pregadorDoDia = document.createElement('span')
    pregadorDoDia.className = "pregador"
    pregadorDoDia.id = `pregador${dia}`

    let corpo = document.createElement('div')
    corpo.className = "corpo"
    corpo.append(dirigenteDoDia, pregadorDoDia, programacaoDoDia)

    return corpo

}

function containerIcones(dia) {

    let icones = document.createElement('div')
    icones.className = "icones"
    icones.id = `ic${vr.diasDaSem[descobreDia(dia)]}${dia}`

    let containerIconesEventos = document.createElement('div')
    containerIconesEventos.className = 'iconesEventos'
    icones.prepend(containerIconesEventos)

    if (vr.listaAniversariantes[0][selectMes()][dia] != null) {

        let containerAniv = document.createElement('div')
        let iconeAniversario = document.createElement("img")
        iconeAniversario.src = "../img/balao.ico"
        containerAniv.append(iconeAniversario)
        icones.append(containerAniv)
    }

    return icones
}

function iconesEventos(dia) {
    if (programacaoDoDia(dia).prog) {

        let icones = document.querySelector(`#ic${vr.diasDaSem[descobreDia(dia)]}${dia} .iconesEventos`)

        programacaoDoDia(dia).prog.forEach((evento) => {

            icones.innerHTML = ""

            switch (evento) {

                case "Aniv. da Igreja":
                    let iconeAnivIgreja = document.createElement("img")
                    iconeAnivIgreja.src = "../img/star.ico"
                    icones.append(iconeAnivIgreja)
                    break

                case "Confraternização":
                    let iconeConfraternizacao = document.createElement("img")
                    iconeConfraternizacao.src = "../img/confra.ico"
                    icones.append(iconeConfraternizacao)
                    break

                case "Ceia":
                    let iconeCeia = document.createElement("img")
                    iconeCeia.src = "../img/ceia.ico"
                    icones.append(iconeCeia)
                    break

                case "Enc. de Casais":
                    let iconeCasais = document.createElement("img")
                    iconeCasais.src = "../img/coracao.ico"
                    icones.append(iconeCasais)
                    break

                case "Bazar":
                    let bazar = document.createElement("img")
                    bazar.src = "../img/bazar.ico"
                    icones.append(bazar)
                    break

                case "Fest. de Pizza":
                    let iconePizza = document.createElement("img")
                    iconePizza.src = "../img/pizza.ico"
                    icones.append(iconePizza)
                    break

                case "Cinema":
                    let cinema = document.createElement("img")
                    cinema.src = "../img/cinema.ico"
                    icones.append(cinema)
                    break

                case "Enc. de Jovens":
                    let jovens = document.createElement("img")
                    jovens.src = "../img/jovens.ico"
                    icones.append(jovens)
                    break

                case "Batismo":
                    let batismo = document.createElement("img")
                    batismo.src = "../img/batismo.ico"
                    icones.append(batismo)
                    break

                case "Dia do Pastor":
                    let iconePastor = document.createElement("img")
                    iconePastor.src = "../img/pastor.ico"
                    icones.append(iconePastor)
                    break

                case "Mutirão":
                    let iconeMultirao = document.createElement("img")
                    iconeMultirao.src = "../img/mutirao.ico"
                    icones.append(iconeMultirao)
                    break
            }
        })
    }
}

function avisos(primeiroDia) {
    if (primeiroDia >= 5) {
        $(".info").css("display", "none")
        $(".info-topo").css("display", "block")
    } else {
        $(".info").css("display", "block")
        $(".info-topo").css("display", "none")
    }

}

function listagemAniversariantes(primeiroDia) {

    let tabela = document.querySelector(".mens")

    if (primeiroDia >= 5) {
        tabela = document.querySelector(".info-topo .mens")
        $(".info").css("display", "none")
        $(".info-topo").css("display", "block")
    } else {
        tabela = document.querySelector(".info .mens")
        $(".info").css("display", "block")
        $(".info-topo").css("display", "none")
    }

    tabela.innerHTML = ""


    for (let i = 1; i <= UltimoDiaDoMes(); i++) {

        if (vr.listaAniversariantes[0][selectMes()][i]) {

            let data = document.createElement("div")
            let lista = document.createElement("div")
            let dia = document.createElement("span")


            data.className = "dataNiv"
            lista.className = "listaNiv"
            dia.className = "diaNiv"

            dia.append(i)
            data.append(dia, lista)

            tabela.append(data)

            for (let x = 0; x < vr.listaAniversariantes[0][selectMes()][i].length; x++) {

                let irmao = document.createElement("span")
                irmao.className = "nome"

                irmao.append(vr.listaAniversariantes[0][selectMes()][i][x])
                lista.append(irmao)

            }
        }
    }
}



function blocosInvisiveis(primeiroDia) {
    for (let i = 0; i < primeiroDia; i++) {

        let colunaSemana = document.querySelector(`.${vr.diasDaSem[i]}`)
        let item = document.createElement('div')
        item.className = 'blocoInvisivel'
        colunaSemana.prepend(item)
    }
}

function verificaTitulo(nome) {

    switch (nome) {
        case "Raimundo":
        case "Isaac Melo":
        case "Bruno Sousa":
        case "Pereira":
            return `Pr. ${nome}`
        case "Rui":
        case "Marcio":
        case "Paulo":
            return `Miss. ${nome}`
        case "":
            return ""
        case "UMMAV":
        case "MCMAV":
        case "MCCAV":
        case "JUBAV":
        case "MIAV":
            return `${nome}`

        default:
            return `Ir. ${nome}`
    }
}

function carregaDados() {


    for (let i = 1; i <= UltimoDiaDoMes(); i++) {

        document.querySelector(`#programacao${i}`).innerHTML = programacaoDoDia(i).prog
        document.querySelector(`#dirigente${i}`).innerHTML = verificaTitulo(programacaoDoDia(i).dir)
        document.querySelector(`#pregador${i}`).innerHTML = verificaTitulo(programacaoDoDia(i).preg)

        if (verificaTitulo(programacaoDoDia(i).preg)) {
            document.querySelector(`#pregador${i}`).style.padding = "1px 5px"
            document.querySelector(`#pregador${i}`).style.marginBottom = "5px"
            document.querySelector(`#pregador${i}`).style.marginTop = "2px"
        } else {
            document.querySelector(`#pregador${i}`).style.padding = "0"

        }

        iconesEventos(i)
    }

    listagemDeAtalaias()
    listagemInf()
    listagemAmor()
    listagemAniversariantes()
}