// js/main.js - Inicialização principal do sistema e eventos globais

document.addEventListener('DOMContentLoaded', async () => {

  try {
    // Única chamada inicial de renderização completa
    await renderizarTudo();

    console.log("Sistema inicializado com sucesso");
  } catch (err) {
    console.error("Erro na inicialização:", err);
  }

  // Eventos de mudança de mês/ano
  $("#selecaoMes, #selecaoAno").on("change", async function () {
    const $this = $(this);

    if ($this.is("#selecaoMes")) {
      localStorage.setItem("mes", $this.val());
      $(".mes").text(vr.meses[$this.val() - 1]);
    } else {
      localStorage.setItem("ano", $this.val());
    }

    await renderizarTudo();
  });

  // Botão Apagar Tudo
  $("#btnLimparTudoBD").on("click", async () => {
    if (!confirm("Tem certeza que deseja apagar TODOS os registros?")) return;

    for (let i = 1; i <= 31; i++) {
      await window.apagarDiaNoFirestore(i);
    }

    await renderizarTudo();
    console.log("Todos os registros apagados");
  });

  // Botão Apagar Registro do Dia Atual
  $("#btnLimparBD").on("click", async () => {
    const dia = $(".EDia").text();  // Pega o dia atual do painel aberto

    if (!dia) {
      alert("Nenhum dia selecionado para apagar.");
      return;
    }

    if (!confirm(`Tem certeza que deseja apagar o registro do dia ${dia}?`)) return;

    const sucesso = await window.apagarDiaNoFirestore(dia);
    if (sucesso) {
      // Recarrega tudo após apagar
      await renderizarTudo();
      console.log(`Registro do dia ${dia} apagado`);
    } else {
      alert("Erro ao apagar registro. Veja o console.");
    }
  });

  // Botão Gerar PDF
  $("#btnSalvar").on("click", () => {
    // Gera o PDF (imprime a página)
    window.print();

  });

  // Função central que renderiza tudo (chamada única em todos os pontos)
  async function renderizarTudo() {

    if (window.calendario) await window.calendario.renderizar();
    if (window.sidebarAniversariantes) await window.sidebarAniversariantes.renderizar();
    if (window.sidebarAtalaias) await window.sidebarAtalaias.renderizar();
    if (window.sidebarInfantil) await window.sidebarInfantil.renderizar();

    // Atualiza ícones de aniversariantes (se ainda tiver)
    if (window.atualizarIconesAniversariantes) await window.atualizarIconesAniversariantes();

  }







});