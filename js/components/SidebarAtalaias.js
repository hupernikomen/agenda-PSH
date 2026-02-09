// js/components/SidebarAtalaias.js - Componente da lista de Atalaias na sidebar

class SidebarAtalaias {
  constructor() {
    this.$container = $('.divAtalaias div');
  }

  async renderizar() {
    if (!this.$container.length) {
      console.warn("Container .divAtalaias div não encontrado");
      return;
    }

    this.$container.empty();

    for (let i = 1; i <= UltimoDiaDoMes(); i++) {
      const prog = await programacaoDoDia(i);
      const itens = [];

      if (prog.ata1?.trim()) itens.push(prog.ata1.trim());
      if (prog.ata2?.trim()) itens.push(prog.ata2.trim());

      if (itens.length > 0) {
        const linha = this.criarLinha(i, itens);
        this.$container.append(linha);
      }
    }
  }

  criarLinha(dia, itens) {
    const linha = document.createElement('div');
    linha.className = 'atalaiasList';

    const diaEl = document.createElement('div');
    diaEl.className = 'diaAta';
    diaEl.textContent = dia;

    const containerItens = document.createElement('div');
    containerItens.className = 'containerLista';

    itens.forEach((item, idx) => {
      const span = document.createElement('span');
      span.className = 'atalaia' + (idx + 1);
      span.textContent = item;
      containerItens.append(span);
    });

    linha.append(diaEl, containerItens);
    return linha;
  }
}

// Instancia globalmente para ser chamado de outros arquivos
window.sidebarAtalaias = new SidebarAtalaias();
