function fecharEdicao() {
    $('.dash').css('transform', 'translateX(-300px)')
}


function abrirEdicao() {
    $('.dash').css('transform', 'translateX(0px)')
}

function criaSelecaoDeAno() {

    $("#selecaoAno").html("")

    for (let i = -1; i <= 1; i++) {
        let option = document.createElement('option')

        option.innerHTML = new Date().getFullYear() + i
        vr.ElselectAno.append(option)
    }
    $("#selecaoAno").val(localStorage.getItem("ano")) 

}

function criaSelecaoDeMes() {
    $("#selecaoMes").html("")

    for (let i = 0; i < vr.meses.length; i++) {
        let option = document.createElement('option')

        option.innerHTML = vr.meses[i]
        option.value = i + 1
        vr.ElselectMes.append(option)

    }
    $("#selecaoMes").val(localStorage.getItem("mes"))
}

function editarDia(i) {
    
    abrirEdicao()
    criaSelecaoDeAno()

    criaSelecaoDeMes()

    let btn = $('#btnLimparBD')
    localStorage.getItem(i) ? btn.css("display", "block") : btn.css("display", "none")

    $(".ESem").html(vr.diasDaSem[descobreDia(i)])
    $(".EDia").html(i)
    $(".EProg").val(programacaoDoDia(i).prog)
    $(".EDir").val(programacaoDoDia(i).dir)
    $(".EPreg").val(programacaoDoDia(i).preg)
    $(".ata1").val(programacaoDoDia(i).ata1 ? programacaoDoDia(i).ata1 : "")
    $(".ata2").val(programacaoDoDia(i).ata2 ? programacaoDoDia(i).ata2 : "")
    $(".inf1").val(programacaoDoDia(i).inf1 ? programacaoDoDia(i).inf1 : "")
    $(".inf2").val(programacaoDoDia(i).inf2 ? programacaoDoDia(i).inf2 : "")
    $(".inf3").val(programacaoDoDia(i).inf3 ? programacaoDoDia(i).inf3 : "")
    
    $('.sugestoes').html("")

    if (descobreDia(i) == 0) {
        $(".clTopo").css("backgroundColor", "#eb4f4f")
        $(".clTopo").css("color", "#fff")

        $(".atalaiasInput").css("display", "block")
    } else {
        $(".clTopo").css("backgroundColor", "#f0f0f0")
        $(".clTopo").css("color", "#222")

        $(".atalaiasInput").css("display", "none")
    }
}

function add() {

    let arrProg = $(".EProg").val().split(",")

    cal = {
        dia: $(".EDia").html(),
        sem: $(".ESem").html().toLocaleUpperCase(),
        prog: arrProg,
        dir: $(".EDir").val(),
        preg: $(".EPreg").val(),
        ata1: $(".ata1").val(),
        ata2: $(".ata2").val(),
        inf1: $(".inf1").val(),
        inf2: $(".inf2").val(),
        inf3: $(".inf3").val(),
    }

    if (cal.prog != "" || cal.dir != "" || cal.preg != "" || cal.ata1 != "" || cal.ata2 != "" || cal.inf1 != "" || cal.inf2 != ""|| cal.inf3 != "") {
        var json = JSON.stringify(cal)
        localStorage.setItem(`${$(".EDia").html()}`, json)
        fecharEdicao()

    } else if (localStorage.getItem(`${$(".EDia").html()}`)) localStorage.removeItem(`${$(".EDia").html()}`)
}

function gerarPDF() {
    fecharEdicao()
    window.print()


}

function limparRegistro() {

    let res = confirm(`Tem certeza que deseja apagar esse registro?`)

    if (res) {

        localStorage.removeItem($(".EDia").html())

        document.querySelectorAll('.iconesEventos').forEach(i => i.innerHTML = "")
        carregaDados()
        fecharEdicao()
    }
}

vr.ElSelect.forEach((i) => {

    i.addEventListener("change", () => {
        if (i.id == "selecaoMes") {
            localStorage.setItem("mes", `${i.value}`)
            vr.ElMes.innerHTML = vr.meses[selectMes() - 1]

        } else if (i.id == "selecaoAno") {
            localStorage.setItem("ano", `${i.value}`)
        }

        listagemAniversariantes()
        $('.mes').html(selectMes() == null ? "-" : vr.meses[selectMes() - 1])

    })
})

document.querySelectorAll(".clEdit input").forEach(i => {
    const sugestoes = $('.sugestoes')

    i.addEventListener('focusin', () => {

        sugestoes.html("")
        switch (i.className) {

            case 'EProg':
                vr.eventos.forEach(i => {

                    let sugestao = document.createElement('div')
                    sugestao.innerHTML = i
                    sugestoes.append(sugestao)


                    sugestao.addEventListener('click', () => $(".EProg").val(i))
                })

                break;

            case 'EPreg':
                vr.pastores.forEach(i => {

                    let sugestao = document.createElement('div')
                    sugestao.innerHTML = i
                    sugestoes.append(sugestao)

                    sugestao.addEventListener('click', () => $(".EPreg").val(i))
                })

                break;

            case "ata1":
                vr.atalaias.forEach(i => {

                    if (i != vr.ElAta2.value) {
                        const s = document.createElement('div')
                        s.innerHTML = i
                        sugestoes.append(s)

                        s.addEventListener('click', () => $(".ata1").val(i))
                    }
                })

                break;

            case "ata2":
                vr.atalaias.forEach(i => {

                    if (i != vr.ElAta1.value) {
                        const s = document.createElement('div')
                        s.innerHTML = i
                        sugestoes.append(s)

                        s.addEventListener('click', () => $(".ata2").val(i))
                    }
                })

                break;
            case "inf1":
                vr.inf.forEach(i => {

                    if (i != vr.ElInf1.value) {
                        const s = document.createElement('div')
                        s.innerHTML = i
                        sugestoes.append(s)

                        s.addEventListener('click', () => $(".inf1").val(i))
                    }
                })

                break;
            case "inf2":
                vr.inf.forEach(i => {

                    if (i != vr.ElInf2.value) {
                        const s = document.createElement('div')
                        s.innerHTML = i
                        sugestoes.append(s)

                        s.addEventListener('click', () => $(".inf2").val(i))
                    }
                })

                break;
            case "inf3":
                vr.inf.forEach(i => {

                    if (i != vr.ElInf3.value) {
                        const s = document.createElement('div')
                        s.innerHTML = i
                        sugestoes.append(s)

                        s.addEventListener('click', () => $(".inf3").val(i))
                    }
                })

                break;
           

        }
    })

    i.addEventListener('focusout', () => i.style.border = "0")

})