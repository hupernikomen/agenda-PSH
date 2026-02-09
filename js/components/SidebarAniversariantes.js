// js/components/SidebarAniversariantes.js - Componente da lista de aniversariantes na sidebar

class SidebarAniversariantes {
  constructor() {
    this.$info = $('.info .mens');
    this.$infoTopo = $('.info-topo .mens');
  }

  async renderizar() {
    const mes = selectMes();
    const primeiroDia = vr.diasDaSem.indexOf(vr.diasDaSem[descobreDia(1)]);
    const aniversariantes = await window.buscarAniversariantesDoMes(mes);

    this.$info.empty();
    this.$infoTopo.empty();

    let tabela;
    const deveMostrarTopo = primeiroDia >= 5;

    if (deveMostrarTopo) {
      tabela = this.$infoTopo;
      $('.info').css('display', 'none');
      $('.info-topo').css('display', 'block');
    } else {
      tabela = this.$info;
      $('.info').css('display', 'block');
      $('.info-topo').css('display', 'none');
    }

    if (Object.keys(aniversariantes).length === 0) return;

    for (let dia in aniversariantes) {
      if (aniversariantes[dia].length > 0) {
        const data = document.createElement("div");
        const lista = document.createElement("div");
        const diaEl = document.createElement("span");

        data.className = "dataNiv";
        lista.className = "listaNiv";
        diaEl.className = "diaNiv";

        diaEl.append(dia);
        data.append(diaEl, lista);
        tabela.append(data);

        aniversariantes[dia].forEach(nome => {
          const irmao = document.createElement("span");
          irmao.className = "nome";
          irmao.style.cursor = "pointer";
          irmao.append(nome);

          irmao.addEventListener("click", async () => {
            const confirmar = confirm(`Quer excluir ${nome} do dia ${dia}?`);
            if (confirmar) {
              await window.removerAniversariante(dia, mes, nome);
              await this.renderizar();  // recarrega só a sidebar
              await atualizarIconesAniversariantes();  // atualiza balões
            }
          });

          lista.append(irmao);
        });
      }
    }
  }
}

// Instancia globalmente
window.sidebarAniversariantes = new SidebarAniversariantes();
