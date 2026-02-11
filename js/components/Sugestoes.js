// // js/components/Sugestoes.js - Sugestões/autocomplete nos inputs do painel de edição

// class Sugestoes {
//   constructor() {
//     this.$sugestoes = $('.sugestoes');
//     this.bindEvents();
//   }

//   bindEvents() {
//     document.querySelectorAll(".clEdit input").forEach(input => {
//       input.addEventListener('focusin', () => {
//         this.mostrarSugestoes(input);
//       });

//       input.addEventListener('focusout', () => {
//         this.limparSugestoes();
//       });
//     });
//   }

//   mostrarSugestoes(input) {
//     this.$sugestoes.empty();

//     const className = input.className;

//     switch (className) {
//       case 'EProg':
//         vr.eventos.forEach(item => {
//           const el = this.criarItemSugestao(item, () => $(".EProg").val(item));
//           this.$sugestoes.append(el);
//         });
//         break;

//       case 'EPreg':
//         vr.pastores.forEach(item => {
//           const el = this.criarItemSugestao(item, () => $(".EPreg").val(item));
//           this.$sugestoes.append(el);
//         });
//         break;

//       case "ata1":
//       case "ata2":
//         const atalaiaAtual = className === "ata1" ? $(".ata2").val() : $(".ata1").val();
//         vr.atalaias.forEach(item => {
//           if (item !== atalaiaAtual) {
//             const el = this.criarItemSugestao(item, () => $(input).val(item));
//             this.$sugestoes.append(el);
//           }
//         });
//         break;

//       default:
//         break;
//     }
//   }

//   criarItemSugestao(texto, onClick) {
//     const el = document.createElement('div');
//     el.textContent = texto;
//     el.addEventListener('click', onClick);
//     return el;
//   }

//   limparSugestoes() {
//     this.$sugestoes.empty();
//   }
// }

// // Instancia globalmente
// window.sugestoes = new Sugestoes();