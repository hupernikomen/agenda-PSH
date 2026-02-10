// js/components/SidebarAmor.js - Componente da lista de Min. Amor na sidebar

class SidebarAmor {
  constructor() {
    this.$section = $('.divAmor');     // a div pai inteira
    this.$container = $('.divAmor div');
  }

  async renderizar() {

    if (!this.$container.length) {
      return;
    }


    this.$container.empty();

    const mes = selectMes();
    const ano = selectAno();

    const progMes = await window.buscarProgramacaoDoMes?.(mes, ano) || {};

    let encontrou = false;
    const fragment = document.createDocumentFragment();

    for (let dia = 1; dia <= UltimoDiaDoMes(mes, ano); dia++) {
      const prog = progMes[dia] || {};

      const itens = [];
      if (prog.amor && prog.amor.trim()) {
        itens.push(prog.amor.trim());
        encontrou = true;
      }

      if (itens.length > 0) {
        const linha = this.criarLinha(dia, itens);
        fragment.appendChild(linha);
      }
    }

    if (!encontrou) {
      this.$container.append('<p style="color: orange;">Nenhum Amor neste mês (mas dados existem no banco)</p>');
    }

    this.$container.empty();  // limpa a mensagem de carregando
    this.$container.append(fragment);
  }

  criarLinha(dia, itens) {
    const linha = document.createElement('div');
    linha.className = 'amorList';

    const diaEl = document.createElement('div');
    diaEl.className = 'diaAmor';
    diaEl.textContent = dia;

    const containerItens = document.createElement('div');
    containerItens.className = 'containerLista';

    itens.forEach((item, idx) => {
      const span = document.createElement('span');
      span.className = 'amor' + (idx + 1);
      span.textContent = item;
      containerItens.appendChild(span);
    });

    linha.appendChild(diaEl);
    linha.appendChild(containerItens);
    return linha;
  }
}

// Instancia globalmente
window.sidebarAmor = new SidebarAmor();