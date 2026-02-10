// js/components/FormEdicaoDia.js - Componente do painel lateral de edição

class FormEdicaoDia {
  constructor() {
    this.$sugestoes = $('.sugestoes');
    this.$btnRegistrar = $('#btnRegistrar');
    this.$btnLimpar = $('#btnLimparBD');
    this.$btnSalvarAniv = $('#btnSalvarAniv');

    this.bindEvents();
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

    this.$btnRegistrar.val(
      progDia.dir || progDia.preg || progDia.prog?.length > 0 || progDia.ata1 || progDia.ata2 || progDia.inputInf1 || progDia.inputInf2 || progDia.inputInf3 || progDia.amor
        ? "Atualizar Dia"
        : "Registrar Dia"
    );

    this.$btnLimpar.css("display",
      progDia.dir || progDia.preg || progDia.prog?.length > 0 || progDia.ata1 || progDia.ata2 || progDia.inputInf1 || progDia.inputInf2 || progDia.inputInf3 || progDia.amor
        ? "block"
        : "none"
    );

    $(".ESem").text(vr.diasDaSem[descobreDia(i)]);
    $(".EDia").text(i);

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

    if (descobreDia(i) === 0) {
      $(".clTopo").css({ backgroundColor: "#eb4f4f", color: "#fff" });
      $(".atalaiasInput").show();
    } else {
      $(".clTopo").css({ backgroundColor: "#f0f0f0", color: "#222" });
      $(".atalaiasInput").hide();
    }
  }

  async salvar() {

    // Captura do dia e semana (já funcionando)
    const dia = $(".EDia").text().trim() || "";
    const sem = $(".ESem").text().trim().toUpperCase() || "";

    if (!dia) {
      alert("Nenhum dia selecionado.");
      return;
    }

    // Captura dos valores usando querySelector (mais confiável aqui)
    const inputEDir = document.querySelector('.EDir');
    const inputEPreg = document.querySelector('.EPreg');
    const inputEProg = document.querySelector('.EProg');
    const inputAta1 = document.querySelector('.ata1');
    const inputAta2 = document.querySelector('.ata2');
    const inputInf1 = document.getElementById('inputInf1');
    const inputInf2 = document.getElementById('inputInf2');
    const inputInf3 = document.getElementById('inputInf3');
    const amor = document.getElementById('amor');



    const progValue = inputEProg ? (inputEProg.value || "") : "";
    const arrProg = progValue
      ? progValue.split(",").map(s => String(s || "").trim()).filter(Boolean)
      : [];

    const cal = {
      dia: dia,
      sem: sem || undefined,
      prog: arrProg.length ? arrProg : undefined,
      dir: inputEDir ? (inputEDir.value || "").trim() || "" : "",
      preg: inputEPreg ? (inputEPreg.value || "").trim() || "" : "",
      ata1: inputAta1 ? (inputAta1.value || "").trim() || "" : "",
      ata2: inputAta2 ? (inputAta2.value || "").trim() || "" : "",
      inputInf1: inputInf1 ? (inputInf1.value || "").trim() || "": "",
      inputInf2: inputInf2 ? (inputInf2.value || "").trim() || "": "",
      inputInf3: inputInf3 ? (inputInf3.value || "").trim() || "" : "",
      amor: amor ? (amor.value || "").trim() || "" : "", 
    };

    // Remove campos undefined
    Object.keys(cal).forEach(key => {
      if (cal[key] === undefined) {
        delete cal[key];
      }
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

    // Atualização seletiva: só recarrega o dia alterado + sidebar de aniversariantes
    const diaNum = parseInt(cal.dia);
    const mes = selectMes();

    // Busca dados atualizados só desse dia
    const progDia = await programacaoDoDia(diaNum) || {};
    const aniversariantes = await window.buscarAniversariantesDoMes(mes);
    const aniversariantesDoDia = aniversariantes[diaNum] || [];

    // Encontra o objeto Dia correspondente (você precisa expor ou acessar de alguma forma)
    // Se você não tem uma coleção global de Dias, pode recriar só esse bloco
    const semana = vr.diasDaSem[descobreDia(diaNum)];
    const diaObj = new Dia(diaNum, semana);

    // Atualiza o elemento já existente no DOM
    const tdExistente = document.querySelector(`td.${semana} #${semana}${diaNum}`);
    if (tdExistente) {
      tdExistente.innerHTML = ''; // limpa
      tdExistente.appendChild(diaObj.elemento);
      await diaObj.atualizar(progDia, aniversariantesDoDia);
    } else {
      console.warn("Não encontrou o TD do dia para atualização seletiva");
      // fallback: atualiza tudo (pode manter como estava)
      await window.calendario.renderizar();
    }

    // Atualiza apenas a parte de aniversariantes (mais rápida que calendário inteiro)
    await window.calendario.atualizarSidebarAniversariantes(
      vr.diasDaSem.indexOf(vr.diasDaSem[descobreDia(1)]),
      aniversariantes
    );

    // Atualiza as outras sidebars se necessário (são mais leves)
    if (window.sidebarAtalaias) await window.sidebarAtalaias.renderizar();
    if (window.sidebarInfantil) await window.sidebarInfantil.renderizar();
    if (window.sidebarAmor) await window.sidebarAmor.renderizar();

    // Opcional: limpar campos
    $(".EDir, .EPreg, .EProg, .ata1, .ata2, #inputInf1, #inputInf2, #inputInf3, #amor, .EAniv").val("");
    this.$btnLimpar.css("display", "none");
    this.$btnRegistrar.val("Registrar Dia");
  }

  bindEvents() {
    // Botão Registrar Dia
    this.$btnRegistrar.on("click", () => this.salvar());

    // Botão Salvar Aniversariante
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
        if (window.atualizarIconesAniversariantes) await window.atualizarIconesAniversariantes();
        if (window.calendario) await window.calendario.renderizar();
        if (window.sidebarAniversariantes) await window.sidebarAniversariantes.renderizar();
        alert("Aniversariante(s) salvo(s) com sucesso!");
      } else {
        alert("Erro ao salvar aniversariante. Veja o console.");
      }
    });

    document.querySelectorAll(".clEdit input").forEach(input => {
      input.addEventListener('focusin', () => {
        const sugestoes = this.$sugestoes;
        sugestoes.empty();

        const className = input.className;

        if (className === 'EProg') {
          vr.eventos.forEach(item => {
            const el = document.createElement('div');
            el.textContent = item;
            el.style.cursor = 'pointer';
            el.style.padding = '4px 8px';
            el.style.borderRadius = '4px';
            el.style.background = '#f0f0f0';
            el.style.margin = '2px';
            el.addEventListener('click', () => {
              $(".EProg").val(item);
              sugestoes.empty();
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
            el.style.padding = '4px 8px';
            el.style.borderRadius = '4px';
            el.style.background = '#f0f0f0';
            el.style.margin = '2px';
            el.addEventListener('click', () => {
              $(".EPreg").val(item);
              sugestoes.empty();
            });
            sugestoes.append(el);
          });
          return;
        }

      });

      input.addEventListener('focusout', () => this.$sugestoes.empty());
    });
  }
}

// Instancia o componente globalmente
window.formEdicaoDia = new FormEdicaoDia();