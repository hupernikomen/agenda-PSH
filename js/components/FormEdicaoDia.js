// js/components/FormEdicaoDia.js - Componente do painel lateral de edição

class FormEdicaoDia {
  constructor() {
    this.$sugestoes = $('.sugestoes');
    this.$btnRegistrar = $('#btnRegistrar');
    this.$btnLimpar = $('#btnLimparBD');
    this.$btnSalvarAniv = $('#btnSalvarAniv');

    this.bindEvents();
  }

  // Função auxiliar interna: descobre o dia da semana (0=dom, 1=seg, ..., 6=sáb)
  descobreDia(dia) {
    const mes = selectMes();
    const ano = selectAno();
    return new Date(ano, mes - 1, dia).getDay();
  }

  criarSelecaoAno() {
    $("#selecaoAno").empty();
    for (let i = -1; i <= 1; i++) {
      $("#selecaoAno").append(`<option>${new Date().getFullYear() + i}</option>`);
    }
    $("#selecaoAno").val(localStorage.getItem("ano"));
  }

  criarSelecaoMes() {
    $("#selecaoMes").empty();
    vr.meses.forEach((mes, idx) => {
      $("#selecaoMes").append(`<option value="${idx + 1}">${mes}</option>`);
    });
    $("#selecaoMes").val(localStorage.getItem("mes"));
  }

  async carregarDia(i) {
    this.criarSelecaoAno();
    this.criarSelecaoMes();

    const progDia = await programacaoDoDia(i) || {};

    // Ajusta texto do botão Registrar
    this.$btnRegistrar.val(
      progDia.dir || progDia.preg || progDia.prog?.length > 0 ||
      progDia.ata1 || progDia.ata2 || progDia.inputInf1 ||
      progDia.inputInf2 || progDia.inputInf3 || progDia.amor
        ? "Atualizar Dia"
        : "Registrar Dia"
    );

    // Mostra/esconde botão Limpar
    this.$btnLimpar.css("display",
      progDia.dir || progDia.preg || progDia.prog?.length > 0 ||
      progDia.ata1 || progDia.ata2 || progDia.inputInf1 ||
      progDia.inputInf2 || progDia.inputInf3 || progDia.amor
        ? "block"
        : "none"
    );

    // Mostra dia da semana e número do dia
    $(".ESem").text(vr.diasDaSem[this.descobreDia(i)]);  // ← usa a versão interna
    $(".EDia").text(i);

    // Preenche os campos
    $(".EProg").val((progDia.prog || []).join(", ") || "");
    $(".EDir").val(progDia.dir || "");
    $(".EPreg").val(progDia.preg || "");
    $(".ata1").val(progDia.ata1 || "");
    $(".ata2").val(progDia.ata2 || "");
    $("#inputInf1").val(progDia.inputInf1 || "");
    $("#inputInf2").val(progDia.inputInf2 || "");
    $("#inputInf3").val(progDia.inputInf3 || "");
    $("#amor").val(progDia.amor || "");

    this.$sugestoes.empty();

    $('.form-fixo').addClass('visivel');

    // Mostra inputs de atalaias apenas no domingo
    if (this.descobreDia(i) === 0) {  // ← usa interna
      $(".clTopo").css({ backgroundColor: "#eb4f4f", color: "#fff" });
    } else {
      $(".clTopo").css({ backgroundColor: "#f0f0f0", color: "#222" });
    }
  }

  async salvar() {
    const dia = $(".EDia").text().trim() || "";
    const sem = $(".ESem").text().trim().toUpperCase() || "";

    if (!dia) {
      alert("Nenhum dia selecionado.");
      return;
    }

    // Captura valores dos inputs
    const inputEDir   = document.querySelector('.EDir');
    const inputEPreg  = document.querySelector('.EPreg');
    const inputEProg  = document.querySelector('.EProg');
    const inputAta1   = document.querySelector('.ata1');
    const inputAta2   = document.querySelector('.ata2');
    const inputInf1   = document.getElementById('inputInf1');
    const inputInf2   = document.getElementById('inputInf2');
    const inputInf3   = document.getElementById('inputInf3');
    const amor        = document.getElementById('amor');

    const progValue = inputEProg?.value || "";
    const arrProg = progValue
      ? progValue.split(",").map(s => s.trim()).filter(Boolean)
      : [];

    const cal = {
      dia,
      sem: sem || undefined,
      prog: arrProg.length ? arrProg : undefined,
      dir:   inputEDir?.value?.trim()  || "",
      preg:  inputEPreg?.value?.trim() || "",
      ata1:  inputAta1?.value?.trim()  || "",
      ata2:  inputAta2?.value?.trim()  || "",
      inputInf1: inputInf1?.value?.trim() || "",
      inputInf2: inputInf2?.value?.trim() || "",
      inputInf3: inputInf3?.value?.trim() || "",
      amor:      amor?.value?.trim()      || "",
    };

    // Remove campos undefined
    Object.keys(cal).forEach(key => {
      if (cal[key] === undefined) delete cal[key];
    });

    let sucesso;
    if (Object.keys(cal).length > 2) {
      sucesso = await window.salvarDiaNoFirestore(cal);
    } else {
      sucesso = await window.apagarDiaNoFirestore(cal.dia);
    }

    if (!sucesso) {
      alert("Erro ao salvar. Veja o console.");
      return;
    }

    // Atualização seletiva
    const diaNum = parseInt(cal.dia);
    const mes = selectMes();
    const progDia = await programacaoDoDia(diaNum) || {};
    const aniversariantes = await window.buscarAniversariantesDoMes(mes);
    const aniversariantesDoDia = aniversariantes[diaNum] || [];

    const semana = vr.diasDaSem[this.descobreDia(diaNum)];  // ← usa interna
    const diaObj = new Dia(diaNum, semana);

    const tdExistente = document.querySelector(`td.${semana} #${semana}${diaNum}`);
    if (tdExistente) {
      tdExistente.innerHTML = '';
      tdExistente.appendChild(diaObj.elemento);
      await diaObj.atualizar(progDia, aniversariantesDoDia);
    } else {
      console.warn("TD do dia não encontrado → recarregando tudo");
      await window.calendario.renderizar();
    }

    // Atualiza sidebars
    await window.calendario.atualizarSidebarAniversariantes(
      vr.diasDaSem.indexOf(vr.diasDaSem[this.descobreDia(1)]),
      aniversariantes
    );

    if (window.sidebarAtalaias)  await window.sidebarAtalaias.renderizar();
    if (window.sidebarInfantil) await window.sidebarInfantil.renderizar();
    if (window.sidebarAmor)      await window.sidebarAmor.renderizar();

    // Limpa campos
    $(".EDir, .EPreg, .EProg, .ata1, .ata2, #inputInf1, #inputInf2, #inputInf3, #amor, .EAniv").val("");
    this.$btnLimpar.css("display", "none");
    this.$btnRegistrar.val("Registrar Dia");
    $('.form-fixo').removeClass('visivel');
  }

  bindEvents() {
    this.$btnRegistrar.on("click", () => this.salvar());

    this.$btnSalvarAniv.on("click", async () => {
      const nomesStr = $(".EAniv").val()?.trim() || "";
      if (!nomesStr) {
        alert("Digite pelo menos um nome.");
        return;
      }

      const nomes = nomesStr.split(",").map(n => n.trim()).filter(Boolean);
      const dia = $(".EDia").text();
      const mes = localStorage.getItem("mes");

      if (!dia || !mes) {
        alert("Dia ou mês não selecionado.");
        return;
      }

      const sucesso = await window.salvarAniversariantes(dia, mes, nomes);
      if (sucesso) {
        $(".EAniv").val("");
        await window.calendario.renderizar();  // recarrega calendário + sidebar
        alert("Aniversariante(s) salvo(s) com sucesso!");
      } else {
        alert("Erro ao salvar aniversariante. Veja o console.");
      }
    });

    // Sugestões nos inputs - abordagem com delegação de evento
this.$sugestoes.on('click', 'div', function () {
  const valor = $(this).text();
  const targetClass = $(this).data('target');  // classe do input alvo

  if (targetClass) {
    $(`.${targetClass}`).val(valor);  // preenche o input correto
  }

  this.$sugestoes.empty();  // limpa sugestões
});

// Sugestões nos inputs - versão sem focusout (clique limpa tudo)
document.querySelectorAll(".corpo input").forEach(input => {
  input.addEventListener('focusin', () => {
    const sugestoes = this.$sugestoes;
    sugestoes.empty();

    const className = input.className.trim();

    if (className === 'EProg') {
      vr.eventos.forEach(item => {
        const el = document.createElement('div');
        el.textContent = item;
        el.style.cursor = 'pointer';
        el.style.padding = '3px 6px';
        el.style.borderRadius = '6px';
        el.style.margin = '2px';
        el.style.background = '#f0f0f0';
        el.style.userSelect = 'none'; // evita seleção de texto ao clicar

        el.addEventListener('click', () => {
          input.value = item;           // preenche o input
          sugestoes.empty();            // limpa sugestões imediatamente
          input.focus();                // mantém o cursor no campo
        });

        sugestoes.append(el);
      });
      return;
    }

    if (className === 'EPreg') {
      vr.pastores.forEach(item => {
        const el = document.createElement('div');
        el.textContent = item;
        el.style.cursor = 'pointer';
        el.style.padding = '3px 6px';
        el.style.borderRadius = '6px';
        el.style.margin = '2px';
        el.style.background = '#f0f0f0';
        el.style.userSelect = 'none';

        el.addEventListener('click', () => {
          input.value = item;
          sugestoes.empty();
          input.focus();
        });

        sugestoes.append(el);
      });
      return;
    }
  });

  // REMOVIDO o focusout completamente - o clique na sugestão já limpa
  // Se quiser limpar ao clicar fora, podemos adicionar listener no document depois
});
  }
}

// Instancia global
window.formEdicaoDia = new FormEdicaoDia();