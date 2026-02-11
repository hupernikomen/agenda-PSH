// js/main.js - Inicialização principal e eventos globais

document.addEventListener('DOMContentLoaded', async () => {
  try {
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
    const dia = $(".EDia").text().trim();

    if (!dia) {
      alert("Nenhum dia selecionado para apagar.");
      return;
    }

    if (!confirm(`Tem certeza que deseja apagar o registro do dia ${dia}?`)) return;

    const sucesso = await window.apagarDiaNoFirestore(dia);
    if (sucesso) {
      await renderizarTudo();
      console.log(`Registro do dia ${dia} apagado`);
    } else {
      alert("Erro ao apagar registro. Veja o console.");
    }
  });

  // Botão Gerar PDF
  $("#btnSalvar").on("click", () => {
    window.print();
  });

  // Função central de renderização completa
  async function renderizarTudo() {
    await Promise.all([
      window.calendario?.renderizar(),
      window.sidebarAniversariantes?.renderizar(),
      window.sidebarAtalaias?.renderizar(),
      window.sidebarInfantil?.renderizar(),
      window.sidebarAmor?.renderizar()
    ]);

    // Atualiza ícones de aniversariantes se necessário
    if (window.atualizarIconesAniversariantes) {
      await window.atualizarIconesAniversariantes();
    }
  }
});