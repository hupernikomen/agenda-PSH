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
    let icones = document.createElement('div');
    icones.className = "icones";
    icones.id = `ic${vr.diasDaSem[descobreDia(dia)]}${dia}`;

    let containerIconesEventos = document.createElement('div');
    containerIconesEventos.className = 'iconesEventos';
    icones.prepend(containerIconesEventos);

    if (vr.listaAniversariantes[0][selectMes()][dia] != null) {
        let containerAniv = document.createElement('div');
        let iconeAniversario = document.createElement("ion-icon");
        iconeAniversario.setAttribute("name", "balloon"); // Ícone de balão para aniversário
        iconeAniversario.style.color = "#d40404ff"; // Cor inline (vermelho para teste)
        iconeAniversario.style.fontSize = "12px"; // Tamanho inline
        iconeAniversario.style.marginRight = "4px"; // Tamanho inline
        containerAniv.append(iconeAniversario);
        icones.append(containerAniv);
    }

    return icones;
}

function iconesEventos(dia) {
    if (programacaoDoDia(dia).prog && programacaoDoDia(dia).prog.length > 0) {
        let icones = document.querySelector(`#ic${vr.diasDaSem[descobreDia(dia)]}${dia} .iconesEventos`);
        if (!icones) return; // Sai se o container não existe

        // Limpa todos os ícones existentes no container
        icones.innerHTML = "";

        programacaoDoDia(dia).prog.forEach((evento) => {
            let icone = document.createElement("ion-icon");

            switch (evento) {
                case "Aniv. da Igreja":
                    icone.setAttribute("name", "star-outline"); // Ícone de casa/igreja
                    icones.append(icone);
                    break;
                case "Reunião":
                    icone.setAttribute("name", "chatbubbles-outline"); // Ícone de casa/igreja
                    icones.append(icone);
                    break;
                case "Ceia":
                    icone.setAttribute("name", "wine-outline"); // Ícone de vinho/cálice
                    icones.append(icone);
                    break;

                case "Enc. de Casais":
                    icone.setAttribute("name", "heart-outline"); // Ícone de coração
                    icones.append(icone);
                    break;

                case "Bazar":
                    icone.setAttribute("name", "bag-handle-outline"); // Ícone de sacola
                    icones.append(icone);
                    break;

                case "Fest. de Pizza":
                    icone.setAttribute("name", "pizza-outline"); // Ícone de pizza
                    icones.append(icone);
                    break;

                case "Cinema":
                    icone.setAttribute("name", "film-outline"); // Ícone de filme
                    icones.append(icone);
                    break;

                case "Enc. de Jovens":
                    icone.setAttribute("name", "people-circle"); // Ícone de grupo jovem
                    icones.append(icone);
                    break;

                case "Batismo":
                    icone.setAttribute("name", "water-outline"); // Ícone de água
                    icones.append(icone);
                    break;

                case "Dia do Pastor":
                    icone.setAttribute("name", "person-outline"); // Ícone simbólico (escola/cruz)
                    icones.append(icone);
                    break;

                case "Mutirão":
                    icone.setAttribute("name", "hammer-outline"); // Ícone de mão ajudando
                    icones.append(icone);
                    break;


                case "Evangelismo":
                    icone.setAttribute("name", "footsteps-outline"); // Ícone de mão ajudando
                    icones.append(icone);
                    break;
                case "PGM's":
                    icone.setAttribute("name", "megaphone-outline"); // Ícone de mão ajudando
                    icones.append(icone);
                    break;


                default:
                    return; // Não adiciona nada para eventos desconhecidos
            }
        });
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
            document.querySelector(`#pregador${i}`).style.padding = "0px 4px"
            document.querySelector(`#pregador${i}`).style.marginBottom = "2px"
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