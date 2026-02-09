// js/components/SidebarAtalaias.js - Otimizado para velocidade

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

    const mes = selectMes();
    const ano = selectAno();

    // Carrega TODA a programação do mês de uma vez (batch)
    const progMes = await window.buscarProgramacaoDoMes?.(mes, ano) || {};

    // Se não houver dados, mostra mensagem
    if (Object.keys(progMes).length === 0) {
      this.$container.append('<p style="color: #abffdf; font-size: 0.8rem;">Nenhuma escala de atalaias registrada.</p>');
      return;
    }

    // Constrói tudo em memória com DocumentFragment (muito mais rápido)
    const fragment = document.createDocumentFragment();

    for (let dia = 1; dia <= UltimoDiaDoMes(mes, ano); dia++) {
      const prog = progMes[dia] || {};
      const itens = [];

      if (prog.ata1?.trim()) itens.push(prog.ata1.trim());
      if (prog.ata2?.trim()) itens.push(prog.ata2.trim());

      if (itens.length > 0) {
        const linha = this.criarLinha(dia, itens);
        fragment.appendChild(linha);
      }
    }

    // Insere tudo de uma única vez no DOM
    this.$container.append(fragment);
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
      containerItens.appendChild(span);
    });

    linha.appendChild(diaEl);
    linha.appendChild(containerItens);

    return linha;
  }
}

// Instancia globalmente
window.sidebarAtalaias = new SidebarAtalaias();