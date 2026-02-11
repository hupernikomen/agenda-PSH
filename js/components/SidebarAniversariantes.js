// js/components/SidebarAniversariantes.js - Lista de aniversariantes na sidebar

class SidebarAniversariantes {
  constructor() {
    this.$info = $('.info .mens');
    this.$infoTopo = $('.info-topo .mens');
  }

  async renderizar() {
    const mes = selectMes();
    const ano = selectAno();

    // Calcula o dia da semana do primeiro dia do mês
    const primeiroDiaSemana = new Date(ano, mes - 1, 1).getDay();
    const aniversariantes = await window.buscarAniversariantesDoMes(mes);

    // Limpa as duas áreas possíveis
    this.$info.empty();
    this.$infoTopo.empty();

    // Decide onde posicionar a lista (topo ou inferior) para melhor visualização
    let $tabela;
    const deveMostrarNoTopo = primeiroDiaSemana >= 5; // Mês começa tarde na semana → usa topo

    if (deveMostrarNoTopo) {
      $tabela = this.$infoTopo;
      $('.info').css('display', 'none');
      $('.info-topo').css('display', 'block');
    } else {
      $tabela = this.$info;
      $('.info').css('display', 'block');
      $('.info-topo').css('display', 'none');
    }

    // Se não tiver aniversariantes no mês, sai cedo
    if (Object.keys(aniversariantes).length === 0) return;

    // Cria elementos em memória para performance
    const fragment = document.createDocumentFragment();

    Object.entries(aniversariantes).forEach(([dia, nomes]) => {
      if (!nomes?.length) return;

      const dataEl = document.createElement('div');
      dataEl.className = 'dataNiv';

      const diaEl = document.createElement('span');
      diaEl.className = 'diaNiv';
      diaEl.textContent = dia;

      const listaEl = document.createElement('div');
      listaEl.className = 'listaNiv';

      dataEl.append(diaEl, listaEl);
      fragment.appendChild(dataEl);

      nomes.forEach(nome => {
        const nomeEl = document.createElement('span');
        nomeEl.className = 'nome';
        nomeEl.style.cursor = 'pointer';
        nomeEl.textContent = nome;

        nomeEl.addEventListener('click', async () => {
          if (confirm(`Quer excluir ${nome} do dia ${dia}?`)) {
            await window.removerAniversariante(dia, mes, nome);
            await this.renderizar(); // recarrega só essa sidebar
          }
        });

        listaEl.appendChild(nomeEl);
      });
    });

    // Insere tudo de uma vez
    $tabela.append(fragment);
  }
}

// Instancia global
window.sidebarAniversariantes = new SidebarAniversariantes();