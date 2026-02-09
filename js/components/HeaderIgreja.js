// js/components/HeaderIgreja.js - Header com título, pastor e botão toggle de igreja

class HeaderIgreja {
  constructor() {
    this.$logo = $('#logo');
    this.$nomePastor = $('#nomePastor');
    this.$btnToggle = $('#btnToggleIgreja');

    this.bindEvents();
    this.inicializar();
  }

  inicializar() {
    // Verifica se há igreja salva no localStorage
    const igrejaSalva = localStorage.getItem('igrejaAtual');
    if (igrejaSalva === 'agenda-igreja2') {
      this.isIgreja1 = false;
    } else {
      this.isIgreja1 = true;
    }

    this.atualizarUI();
  }

  bindEvents() {
    this.$btnToggle.on('click', () => {
      this.isIgreja1 = !this.isIgreja1;
      this.atualizarUI();
      this.recargaTudo();
    });
  }

  atualizarUI() {
    if (this.isIgreja1) {
      window.colecaoAtual = 'agenda-igreja1';
      localStorage.setItem('igrejaAtual', 'agenda-igreja1');  // Salva no localStorage
      this.$btnToggle.text('Igreja Batista no PSH');
      this.$logo.text('Igreja Batista no PSH');
      this.$nomePastor.html('<span class="material-icons">arrow_right</span>Pr. Bruno Sousa');
    } else {
      window.colecaoAtual = 'agenda-igreja2';
      localStorage.setItem('igrejaAtual', 'agenda-igreja2');  // Salva no localStorage
      this.$btnToggle.text('Igreja Batista em Árvores Verdes');
      this.$logo.text('Igreja Batista em Árvores Verdes');
      this.$nomePastor.html('<span class="material-icons">arrow_right</span>Pr. Raimundo Pereira');
    }

    this.$btnToggle.toggleClass('ativo', true);
  }

  async recargaTudo() {
    try {
      // Limpa tudo antes de recarregar (para evitar dados antigos)
      $('.tabelaCalendario').empty();
      $('.divAtalaias div').empty();
      $('.divInf div').empty();
      $('.info .mens, .info-topo .mens').empty();

      await new Promise(resolve => setTimeout(resolve, 100));  // pequeno delay para DOM atualizar

      if (window.calendario) await window.calendario.renderizar();
      if (window.sidebarAtalaias) await window.sidebarAtalaias.renderizar();
      if (window.sidebarInfantil) await window.sidebarInfantil.renderizar();
      if (window.sidebarAniversariantes) await window.sidebarAniversariantes.renderizar();
      if (window.atualizarIconesAniversariantes) await window.atualizarIconesAniversariantes();

      console.log(`Igreja trocada para ${window.colecaoAtual} - tudo recarregado`);
    } catch (err) {
      console.error("Erro ao recarregar após troca de igreja:", err);
    }
  }
}

// Instancia globalmente
window.headerIgreja = new HeaderIgreja();
