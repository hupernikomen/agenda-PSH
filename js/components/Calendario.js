// js/components/Calendario.js - Componente que cria e gerencia toda a tabela do calendário

class Calendario {
  constructor() {
    this.$tabela = $('.tabelaCalendario');
    this.$mes = $('.mes');
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
    const primeiroDia = vr.diasDaSem.indexOf(vr.diasDaSem[descobreDia(1, mes, ano)]);

    // Atualiza título do mês
    this.$mes.html(mes ? vr.meses[mes - 1] : "-");

    // Cria linha de cabeçalho
    const trHeader = document.createElement('tr');
    vr.diasDaSem.forEach(diaSem => {
      const td = document.createElement('td');
      td.className = diaSem;
      trHeader.append(td);
    });
    tabela.append(trHeader);

    // Cria linhas de dias
    let trAtual = document.createElement('tr');
    tabela.append(trAtual);

    // Blocos invisíveis do início do mês
    for (let i = 0; i < primeiroDia; i++) {
      const td = document.createElement('td');
      td.className = vr.diasDaSem[i];
      const blocoInvisivel = document.createElement('div');
      blocoInvisivel.className = 'blocoInvisivel';
      td.append(blocoInvisivel);
      trAtual.append(td);
    }

    // Carrega TODA a programação do mês de uma vez (otimização principal)
    const progMes = await window.buscarProgramacaoDoMes?.(mes, ano) || {};  // função nova no firebase-ops.js
    const aniversariantes = await window.buscarAniversariantesDoMes(mes);

    // Cria todos os dias em paralelo
    const promisesAtualizacao = [];
    for (let i = 1; i <= UltimoDiaDoMes(mes, ano); i++) {
      const semana = vr.diasDaSem[descobreDia(i, mes, ano)];
      const diaObj = new Dia(i, semana);

      const td = document.createElement('td');
      td.className = semana;
      td.append(diaObj.elemento);

      trAtual.append(td);

      if ((primeiroDia + i) % 7 === 0 && i < UltimoDiaDoMes(mes, ano)) {
        trAtual = document.createElement('tr');
        tabela.append(trAtual);
      }

      // Prepara atualização assíncrona (não await aqui ainda)
      const progDia = progMes[i] || { prog: [], dir: "", preg: "", ata1: "", ata2: "", inf1: "", inf2: "", inf3: "" };
      const aniversariantesDoDia = aniversariantes[i] || [];
      promisesAtualizacao.push(diaObj.atualizar(progDia, aniversariantesDoDia));
    }

    // Executa todas as atualizações dos dias em paralelo
    await Promise.all(promisesAtualizacao);

    // Atualiza sidebar de aniversariantes (última parte, rápida)
    await this.atualizarSidebarAniversariantes(primeiroDia, aniversariantes);
  }

  // Função auxiliar para calcular primeiro dia (ajustada para mês/ano específico)
  descobreDia(dia, mes = selectMes(), ano = selectAno()) {
    return new Date(ano, mes - 1, dia).getDay();
  }

  // Função auxiliar para último dia do mês (ajustada)
  UltimoDiaDoMes(mes = selectMes(), ano = selectAno()) {
    return new Date(ano, mes, 0).getDate();
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
              await this.renderizar(); // recarrega tudo só nesse caso raro
            }
          });

          lista.append(irmao);
        });
      }
    }
  }
}

// Instancia globalmente
window.calendario = new Calendario();