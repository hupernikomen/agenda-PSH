// js/components/HeaderIgreja.js - Gerencia título, pastor e troca de igreja

class HeaderIgreja {
  constructor() {
    this.$logo = $('#logo');
    this.$nomePastor = $('#nomePastor');
    this.$btnToggle = $('#btnToggleIgreja');

    this.bindEvents();
    this.inicializar();
  }

  inicializar() {
    // Carrega igreja salva ou usa padrão
    const igrejaSalva = localStorage.getItem('igrejaAtual');
    this.isIgreja1 = igrejaSalva !== 'agenda-igreja2';

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
      localStorage.setItem('igrejaAtual', 'agenda-igreja1');
      this.$logo.text('Igreja Batista no PSH');
      this.$nomePastor.html('<span class="material-icons">arrow_right</span>Pr. Bruno Sousa');
    } else {
      window.colecaoAtual = 'agenda-igreja2';
      localStorage.setItem('igrejaAtual', 'agenda-igreja2');
      this.$logo.text('Igreja Batista em Árvores Verdes');
      this.$nomePastor.html('<span class="material-icons">arrow_right</span>Pr. Raimundo Pereira');
    }

    // Mantém o botão sempre "ativo" visualmente (como era)
    this.$btnToggle.addClass('ativo');
  }

  async recargaTudo() {
    try {
      // Limpa conteúdos antes de recarregar para evitar flash de dados antigos
      $('.tabelaCalendario').empty();
      $('.divAtalaias div, .divInf div, .divAmor div').empty();
      $('.info .mens, .info-topo .mens').empty();

      // Aguarda um pequeno tempo para o DOM atualizar (se necessário)
      await new Promise(resolve => setTimeout(resolve, 50));

      // Recarrega componentes principais
      await Promise.all([
        window.calendario?.renderizar(),
        window.sidebarAtalaias?.renderizar(),
        window.sidebarInfantil?.renderizar(),
        window.sidebarAmor?.renderizar(),
        window.sidebarAniversariantes?.renderizar()
      ]);

      console.log(`Igreja trocada para ${window.colecaoAtual} - tudo recarregado`);
    } catch (err) {
      console.error("Erro ao recarregar após troca de igreja:", err);
    }
  }
}

// Instancia global
window.headerIgreja = new HeaderIgreja();