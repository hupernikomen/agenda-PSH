// js/components/SidebarAtalaias.js - Lista de Atalaias na sidebar

class SidebarAtalaias {
  constructor() {
    this.$section = $('.divAtalaias');       // div pai completa
    this.$container = $('.divAtalaias div'); // container dos itens
  }

  // Função auxiliar interna: último dia do mês
  UltimoDiaDoMes(mes = selectMes(), ano = selectAno()) {
    return new Date(ano, mes, 0).getDate();
  }

  async renderizar() {
    if (!this.$container.length) {
      console.warn("Container .divAtalaias div não encontrado");
      return;
    }

    this.$container.empty();

    const mes = selectMes();
    const ano = selectAno();

    const progMes = await window.buscarProgramacaoDoMes?.(mes, ano) || {};

    const fragment = document.createDocumentFragment();
    let encontrou = false;

    // Usa a versão interna agora
    for (let dia = 1; dia <= this.UltimoDiaDoMes(mes, ano); dia++) {
      const prog = progMes[dia] || {};
      const itens = [];

      if (prog.ata1?.trim()) itens.push(prog.ata1.trim());
      if (prog.ata2?.trim()) itens.push(prog.ata2.trim());

      if (itens.length > 0) {
        encontrou = true;
        const linha = this.criarLinha(dia, itens);
        fragment.appendChild(linha);
      }
    }

    this.$container.append(fragment);

    // Esconde seção se não houver dados
    if (encontrou) {
      this.$section.show();
    } else {
      this.$section.hide();
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
      containerItens.appendChild(span);
    });

    linha.appendChild(diaEl);
    linha.appendChild(containerItens);

    return linha;
  }
}

window.sidebarAtalaias = new SidebarAtalaias();