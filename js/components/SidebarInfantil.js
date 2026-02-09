// js/components/SidebarInfantil.js - Otimizado para velocidade

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

    const mes = selectMes();
    const ano = selectAno();

    // Carrega TODA a programação do mês de uma vez (batch)
    const progMes = await window.buscarProgramacaoDoMes?.(mes, ano) || {};

    // Se não houver dados, mostra mensagem
    if (Object.keys(progMes).length === 0) {
      this.$container.append('<p style="color: #abffdf; font-size: 0.8rem;">Nenhum ministério infantil registrado.</p>');
      return;
    }

    // Constrói tudo em memória com DocumentFragment (muito mais rápido)
    const fragment = document.createDocumentFragment();

    for (let dia = 1; dia <= UltimoDiaDoMes(mes, ano); dia++) {
      const prog = progMes[dia] || {};
      const itens = [];

      if (prog.inf1?.trim()) itens.push(prog.inf1.trim());
      if (prog.inf2?.trim()) itens.push(prog.inf2.trim());
      if (prog.inf3?.trim()) itens.push(prog.inf3.trim());

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