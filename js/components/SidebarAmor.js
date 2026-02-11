// js/components/SidebarAmor.js - Lista de Ministério Amor na sidebar

class SidebarAmor {
  constructor() {
    this.$section = $('.divAmor');          // div pai completa (título + conteúdo)
    this.$container = $('.divAmor div');    // container dos itens
  }

  // Função auxiliar interna: último dia do mês
  UltimoDiaDoMes(mes = selectMes(), ano = selectAno()) {
    return new Date(ano, mes, 0).getDate();
  }

  async renderizar() {
    if (!this.$container.length) {
      console.warn("Container .divAmor div não encontrado");
      return;
    }

    this.$container.empty();

    const mes = selectMes();
    const ano = selectAno();

    const progMes = await window.buscarProgramacaoDoMes?.(mes, ano) || {};

    const fragment = document.createDocumentFragment();
    let encontrou = false;

    // Usa a versão interna do método
    for (let dia = 1; dia <= this.UltimoDiaDoMes(mes, ano); dia++) {
      const prog = progMes[dia] || {};
      const itens = [];

      if (prog.amor?.trim()) itens.push(prog.amor.trim());

      if (itens.length > 0) {
        encontrou = true;
        const linha = this.criarLinha(dia, itens);
        fragment.appendChild(linha);
      }
    }

    // Insere os itens encontrados
    this.$container.append(fragment);

    // Esconde a seção inteira se não houver nenhum registro de Amor no mês
    if (encontrou) {
      this.$section.show();
    } else {
      this.$section.hide();
    }
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