// js/components/SidebarInfantil.js - Lista de Ministério Infantil na sidebar

class SidebarInfantil {
  constructor() {
    this.$section = $('.divInf');          // div pai completa (título + conteúdo)
    this.$container = $('.divInf div');    // container dos itens
  }

  // Função auxiliar interna: último dia do mês
  UltimoDiaDoMes(mes = selectMes(), ano = selectAno()) {
    return new Date(ano, mes, 0).getDate();
  }

  async renderizar() {
    if (!this.$container.length) {
      console.warn("Container .divInf div não encontrado");
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

      if (prog.inputInf1?.trim()) itens.push(prog.inputInf1.trim());
      if (prog.inputInf2?.trim()) itens.push(prog.inputInf2.trim());
      if (prog.inputInf3?.trim()) itens.push(prog.inputInf3.trim());

      if (itens.length > 0) {
        encontrou = true;
        const linha = this.criarLinha(dia, itens);
        fragment.appendChild(linha);
      }
    }

    // Insere os itens encontrados
    this.$container.append(fragment);

    // Esconde a seção inteira se não houver nenhum registro de Infantil no mês
    if (encontrou) {
      this.$section.show();
    } else {
      this.$section.hide();
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
      containerItens.appendChild(span);
    });

    linha.appendChild(diaEl);
    linha.appendChild(containerItens);

    return linha;
  }
}

// Instancia globalmente
window.sidebarInfantil = new SidebarInfantil();