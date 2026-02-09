// js/components/SidebarInfantil.js - Componente da lista de Ministério Infantil na sidebar

class SidebarInfantil {
  constructor() {
    this.$container = $('.divInf div');
  }

  async renderizar() {
    if (!this.$container.length) {
      console.warn("Container .divInf div não encontrado");
      return;
    }

    this.$container.empty();

    for (let i = 1; i <= UltimoDiaDoMes(); i++) {
      const prog = await programacaoDoDia(i);
      const itens = [];

      if (prog.inf1?.trim()) itens.push(prog.inf1.trim());
      if (prog.inf2?.trim()) itens.push(prog.inf2.trim());

      if (itens.length > 0) {
        const linha = this.criarLinha(i, itens);
        this.$container.append(linha);
      }
    }
  }

  criarLinha(dia, itens) {
    const linha = document.createElement('div');
    linha.className = 'infList';

    const diaEl = document.createElement('div');
    diaEl.className = 'diaInf';
    diaEl.textContent = dia;

    const containerItens = document.createElement('div');
    containerItens.className = 'containerLista';

    itens.forEach((item, idx) => {
      const span = document.createElement('span');
      span.className = 'inf' + (idx + 1);
      span.textContent = item;
      containerItens.append(span);
    });

    linha.append(diaEl, containerItens);
    return linha;
  }
}

// Instancia globalmente para ser chamado de outros arquivos
window.sidebarInfantil = new SidebarInfantil();
