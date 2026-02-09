// js/components/Sugestoes.js - Componente de sugestões/autocomplete nos inputs do painel de edição

class Sugestoes {
  constructor() {
    this.$sugestoes = $('.sugestoes');
    this.bindEvents();
  }

  bindEvents() {
    document.querySelectorAll(".clEdit input").forEach(input => {
      input.addEventListener('focusin', () => {
        this.mostrarSugestoes(input);
      });

      input.addEventListener('focusout', () => {
        this.limparSugestoes();
      });
    });
  }

  mostrarSugestoes(input) {
    this.$sugestoes.empty();

    const className = input.className;

    // if (className === 'inf1' || className === 'inf2') {
    //   vr.inf.forEach(item => {
    //     const outro = className === 'inf1' ? $(".inf2").val() : $(".inf1").val();
    //     if (item !== outro) {
    //       const el = this.criarItemSugestao(item, () => {
    //         $(input).val(item);
    //         this.limparSugestoes();
    //       });
    //       this.$sugestoes.append(el);
    //     }
    //   });
    //   return;
    // }

    switch (className) {
      case 'EProg':
        vr.eventos.forEach(item => {
          const el = this.criarItemSugestao(item, () => $(".EProg").val(item));
          this.$sugestoes.append(el);
        });
        break;

      case 'EPreg':
        vr.pastores.forEach(item => {
          const el = this.criarItemSugestao(item, () => $(".EPreg").val(item));
          this.$sugestoes.append(el);
        });
        break;

      case "ata1":
      case "ata2":
        const atalaiaAtual = className === "ata1" ? $(".ata2").val() : $(".ata1").val();
        vr.atalaias.forEach(item => {
          if (item !== atalaiaAtual) {
            const el = this.criarItemSugestao(item, () => $(input).val(item));
            this.$sugestoes.append(el);
          }
        });
        break;

      default:
        // Campo desconhecido: não faz nada
        break;
    }
  }

  criarItemSugestao(texto, onClick) {
    const el = document.createElement('div');
    el.textContent = texto;
    el.addEventListener('click', onClick);
    return el;
  }

  limparSugestoes() {
    this.$sugestoes.empty();
  }
}

// Instancia globalmente (pode ser chamado de outros componentes se necessário)
window.sugestoes = new Sugestoes();
