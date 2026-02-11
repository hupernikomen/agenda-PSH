// Modal de seleção de mês/ano
$(document).ready(function () {
  const $mesDisplay = $('.mes');
  const $modal = $('#modalMesAno');
  const $mesSelect = $('#modalSelecaoMes');
  const $anoSelect = $('#modalSelecaoAno');

  // Preenche os selects (executa uma vez)
  function preencherSelects() {
    vr.meses.forEach((mesNome, idx) => {
      $mesSelect.append(`<option value="${idx + 1}">${mesNome}</option>`);
    });

    const anoAtual = new Date().getFullYear();
    for (let i = anoAtual - 10; i <= anoAtual + 10; i++) {  // mais anos para escolha
      $anoSelect.append(`<option value="${i}">${i}</option>`);
    }
  }

  preencherSelects();

  // Abre o modal ao clicar no mês
  $mesDisplay.on('click', function () {
    // Preenche com valores atuais
    $mesSelect.val(localStorage.getItem('mes') || (new Date().getMonth() + 1));
    $anoSelect.val(localStorage.getItem('ano') || new Date().getFullYear());

    $modal.fadeIn(200);
  });

  // Confirma e atualiza tudo
  $('#btnConfirmarMesAno').on('click', async function () {
    const novoMes = parseInt($mesSelect.val());
    const novoAno = parseInt($anoSelect.val());

    if (novoMes && novoAno) {
      // Salva no localStorage
      localStorage.setItem('mes', novoMes);
      localStorage.setItem('ano', novoAno);

      // Atualiza o display do mês imediatamente
      $('.mes').text(vr.meses[novoMes - 1]);

      // Força atualização completa do calendário e sidebars
      await window.calendario?.renderizar();           // chama diretamente o render do calendário
      await window.sidebarAtalaias?.renderizar();
      await window.sidebarInfantil?.renderizar();
      await window.sidebarAmor?.renderizar();
      await window.sidebarAniversariantes?.renderizar();

      // Fecha o modal com animação
      $modal.fadeOut(200);
    }
  });

  // Cancela / fecha
  $('#btnCancelarMesAno').on('click', function () {
    $modal.fadeOut(200);
  });

  // Fecha ao clicar fora do conteúdo
  $modal.on('click', function (e) {
    if (e.target === this) {
      $modal.fadeOut(200);
    }
  });
});