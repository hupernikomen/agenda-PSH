
document.querySelector("#selecaoMes").value = localStorage.getItem("mes")
document.querySelector("#selecaoAno").innerHTML = localStorage.getItem("ano")



function listagemDeAtalaias() {

    let containerAtalaias = document.querySelector('.divAtalaias div')
    containerAtalaias.innerHTML = ""

    for (let i = 1; i <= UltimoDiaDoMes(); i++) {

        if (programacaoDoDia(i).ata1 || programacaoDoDia(i).ata2 ) {



            let atalaia1 = document.createElement('span')
            let atalaia2 = document.createElement('span')
            let atalaias = document.createElement('div')
            var dia = document.createElement('div')

            containerAtalaias.append(atalaias)

            dia.className = 'diaAta'
            atalaia1.className = programacaoDoDia(i).ata1 && 'atalaia1'
            atalaia2.className = programacaoDoDia(i).ata2 && 'atalaia2'
            atalaias.className = 'atalaiasList'

            atalaias.append(dia, atalaia1, atalaia2)

            dia.innerHTML = programacaoDoDia(i).dia
            atalaia1.innerHTML = programacaoDoDia(i).ata1
            atalaia2.innerHTML = programacaoDoDia(i).ata2
        }
    }
}

function listagemInf() {

    let containerInf = document.querySelector('.divInf div')
    containerInf.innerHTML = ""

    for (let i = 1; i <= UltimoDiaDoMes(); i++) {
        // && descobreDia(i) == 0
        if (programacaoDoDia(i).inf1 || programacaoDoDia(i).inf2) {

            let inf1 = document.createElement('span')
            let inf2 = document.createElement('span')
            // let inf3 = document.createElement('span')
            let inf = document.createElement('div')
            let dia = document.createElement('div')
            let containerLista = document.createElement('div')

            containerInf.append(inf)

            dia.className = 'diaInf'
            containerLista.className = 'containerLista'
            inf1.className = programacaoDoDia(i).inf1 && 'inf1'
            inf2.className = programacaoDoDia(i).inf2 && 'inf2'
            // inf3.className = 'inf3'
            inf.className = 'infList'

            containerLista.append(inf1, inf2)

            inf.append(dia, containerLista)

            dia.innerHTML = programacaoDoDia(i).dia
            inf1.innerHTML = programacaoDoDia(i).inf1
            inf2.innerHTML = programacaoDoDia(i).inf2
            // inf3.innerHTML = programacaoDoDia(i).inf3
        }
    }
}
