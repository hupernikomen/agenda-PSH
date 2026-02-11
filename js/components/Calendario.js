// js/components/Calendario.js - Componente que cria e gerencia a tabela do calendário

class Calendario {
  constructor() {
    this.$tabela = $('.tabelaCalendario');
    this.$mes = $('.mes');
  }

  // Função auxiliar interna: dia da semana (0=dom, 1=seg, ..., 6=sáb)
  descobreDia(dia, mes = selectMes(), ano = selectAno()) {
    return new Date(ano, mes - 1, dia).getDay();
  }

  // Função auxiliar interna: último dia do mês
  UltimoDiaDoMes(mes = selectMes(), ano = selectAno()) {
    return new Date(ano, mes, 0).getDate();
  }

  async renderizar() {
    const tabela = document.querySelector('.tabelaCalendario');
    if (!tabela) {
      console.error("Tabela .tabelaCalendario não encontrada");
      return;
    }

    tabela.innerHTML = "";  // Limpa tudo antes

    const mes = selectMes();
    const ano = selectAno();
    const primeiroDia = this.descobreDia(1, mes, ano);  // ← usa a versão interna

    // Atualiza título do mês
    this.$mes.html(vr.meses[mes - 1] || "-");

    // Cabeçalho da tabela (dias da semana)
    const trHeader = document.createElement('tr');
    vr.diasDaSem.forEach(diaSem => {
      const td = document.createElement('td');
      td.className = diaSem;
      trHeader.append(td);
    });
    tabela.append(trHeader);

    // Linha inicial
    let trAtual = document.createElement('tr');
    tabela.append(trAtual);

    // Blocos invisíveis iniciais
    for (let i = 0; i < primeiroDia; i++) {
      const td = document.createElement('td');
      td.className = vr.diasDaSem[i];
      const blocoInvisivel = document.createElement('div');
      blocoInvisivel.className = 'blocoInvisivel';
      td.append(blocoInvisivel);
      trAtual.append(td);
    }

    // Carrega programação do mês inteiro de uma vez
    const progMes = await window.buscarProgramacaoDoMes?.(mes, ano) || {};
    const aniversariantes = await window.buscarAniversariantesDoMes(mes);

    // Cria e atualiza todos os dias
    const promisesAtualizacao = [];
    for (let i = 1; i <= this.UltimoDiaDoMes(mes, ano); i++) {  // ← usa interna
      const semana = vr.diasDaSem[this.descobreDia(i, mes, ano)];  // ← interna
      const diaObj = new Dia(i, semana);

      const td = document.createElement('td');
      td.className = semana;
      td.append(diaObj.elemento);

      trAtual.append(td);

      // Nova linha a cada 7 dias
      if ((primeiroDia + i) % 7 === 0 && i < this.UltimoDiaDoMes(mes, ano)) {
        trAtual = document.createElement('tr');
        tabela.append(trAtual);
      }

      const progDia = progMes[i] || { prog: [], dir: "", preg: "", ata1: "", ata2: "", inputInf1: "", inputInf2: "", inputInf3: "", amor: "" };
      const aniversariantesDoDia = aniversariantes[i] || [];
      promisesAtualizacao.push(diaObj.atualizar(progDia, aniversariantesDoDia));
    }

    await Promise.all(promisesAtualizacao);

    // Atualiza sidebar de aniversariantes
    await this.atualizarSidebarAniversariantes(primeiroDia, aniversariantes);
  }

  async atualizarSidebarAniversariantes(primeiroDia, aniversariantes) {
    $(".info .mens, .info-topo .mens").empty();

    let tabela;
    const deveMostrarTopo = primeiroDia >= 5;

    if (deveMostrarTopo) {
      tabela = $(".info-topo .mens");
      $(".info").hide();
      $(".info-topo").show();
    } else {
      tabela = $(".info .mens");
      $(".info").show();
      $(".info-topo").hide();
    }

    if (Object.keys(aniversariantes).length === 0) return;

    for (let dia in aniversariantes) {
      if (aniversariantes[dia].length > 0) {
        const data = document.createElement("div");
        const lista = document.createElement("div");
        const diaEl = document.createElement("span");

        data.className = "dataNiv";
        lista.className = "listaNiv";
        diaEl.className = "diaNiv";

        diaEl.append(dia);
        data.append(diaEl, lista);
        tabela.append(data);

        aniversariantes[dia].forEach(nome => {
          const irmao = document.createElement("span");
          irmao.className = "nome";
          irmao.style.cursor = "pointer";
          irmao.append(nome);

          irmao.addEventListener("click", async () => {
            const confirmar = confirm(`Quer excluir ${nome} do dia ${dia}?`);
            if (confirmar) {
              await window.removerAniversariante(dia, selectMes(), nome);
              await this.renderizar(); // recarrega completo nesse caso
            }
          });

          lista.append(irmao);
        });
      }
    }
  }
}

// Instancia global
window.calendario = new Calendario();