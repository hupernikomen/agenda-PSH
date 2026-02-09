// js/components/Dia.js - Componente que representa um único dia no calendário

class Dia {
  constructor(dia, semana) {
    this.dia = dia;
    this.semana = semana;
    this.elemento = this.criarElemento();
  }

  criarElemento() {
    const blocoDia = document.createElement('div');
    blocoDia.className = 'blocoDia';
    blocoDia.id = this.semana + this.dia;

    // Topo do dia
    const topo = this.criarTopo();

    // Corpo do dia
    const corpo = this.criarCorpo();

    // Placeholder de ícones (atualizado depois)
    const icones = this.criarIconesPlaceholder();

    blocoDia.append(topo, corpo, icones);

    // Evento de clique - usa o componente FormEdicaoDia
    blocoDia.addEventListener("click", () => {
      if (window.formEdicaoDia) {
        window.formEdicaoDia.carregarDia(this.dia);
      } else {
        console.error("Componente FormEdicaoDia não encontrado");
      }
    });

    return blocoDia;
  }

  criarTopo() {
    const tagTopoDia = document.createElement("span");
    const tagTopoSemana = document.createElement("span");
    const topo = document.createElement('div');

    topo.className = "topo";
    this.semana === "dom" ? topo.id = "domRed" : topo.id = "semNorm";

    tagTopoDia.append(this.dia);
    tagTopoSemana.append(this.semana);
    topo.append(tagTopoSemana, tagTopoDia);

    return topo;
  }

  criarCorpo() {
    const programacaoEl = document.createElement('span');
    programacaoEl.className = "programacao";
    programacaoEl.id = `programacao${this.dia}`;

    const dirigenteEl = document.createElement('span');
    dirigenteEl.className = "";
    dirigenteEl.id = `dirigente${this.dia}`;

    const pregadorEl = document.createElement('span');
    pregadorEl.className = "pregador";
    pregadorEl.id = `pregador${this.dia}`;

    const corpo = document.createElement('div');
    corpo.className = "corpo";
    corpo.append(dirigenteEl, pregadorEl, programacaoEl);

    return corpo;
  }

  criarIconesPlaceholder() {
    const icones = document.createElement('div');
    icones.className = "icones";
    icones.id = `ic${this.semana}${this.dia}`;

    const containerEventos = document.createElement('div');
    containerEventos.className = 'iconesEventos';
    icones.prepend(containerEventos);

    const containerAniv = document.createElement('div');
    icones.append(containerAniv);

    return icones;
  }

  // Método para atualizar o dia após carregamento de dados
  async atualizar(progDia, aniversariantesDoDia) {
    // Atualiza programação, dirigente e pregador
    const progEl = document.querySelector(`#programacao${this.dia}`);
    if (progEl) progEl.innerHTML = (progDia.prog || []).join("<br>") || "";

    const dirEl = document.querySelector(`#dirigente${this.dia}`);
    if (dirEl) dirEl.innerHTML = verificaTitulo(progDia.dir || "") || "";

    const pregEl = document.querySelector(`#pregador${this.dia}`);
    if (pregEl) {
      pregEl.innerHTML = verificaTitulo(progDia.preg || "") || "";
      if (verificaTitulo(progDia.preg)) {
        pregEl.style.padding = "0px 4px";
        pregEl.style.marginBottom = "2px";
        pregEl.style.marginTop = "2px";
      } else {
        pregEl.style.padding = "0";
      }
    }

    // Atualiza ícones de eventos
    await this.atualizarIconesEventos(progDia.prog || []);

    // Atualiza balão de aniversariante
    const container = document.querySelector(`#ic${this.semana}${this.dia}`);
    if (container) {
      const anivContainer = container.querySelector('div:last-child');
      if (anivContainer) anivContainer.innerHTML = '';

      if (aniversariantesDoDia && aniversariantesDoDia.length > 0) {
        const iconeAniv = document.createElement("ion-icon");
        iconeAniv.setAttribute("name", "balloon");
        iconeAniv.style.color = "#d40404ff";
        iconeAniv.style.fontSize = "12px";
        iconeAniv.style.marginRight = "4px";
        anivContainer.append(iconeAniv);
      }
    }
  }

  async atualizarIconesEventos(prog) {
    if (!prog || prog.length === 0) return;

    const icones = document.querySelector(`#ic${this.semana}${this.dia} .iconesEventos`);
    if (!icones) return;

    icones.innerHTML = "";

    prog.forEach(evento => {
      const icone = document.createElement("ion-icon");

      switch (evento) {
        case "Aniv. da Igreja": icone.setAttribute("name", "star-outline"); break;
        case "Reunião": icone.setAttribute("name", "chatbubbles-outline"); break;
        case "Ceia": icone.setAttribute("name", "wine-outline"); break;
        case "Enc. de Casais": icone.setAttribute("name", "heart-outline"); break;
        case "Bazar": icone.setAttribute("name", "bag-handle-outline"); break;
        case "Fest. de Pizza": icone.setAttribute("name", "pizza-outline"); break;
        case "Cinema": icone.setAttribute("name", "film-outline"); break;
        case "Enc. de Jovens": icone.setAttribute("name", "people-circle"); break;
        case "Batismo": icone.setAttribute("name", "water-outline"); break;
        case "Dia do Pastor": icone.setAttribute("name", "person-outline"); break;
        case "Mutirão": icone.setAttribute("name", "hammer-outline"); break;
        case "Evangelismo": icone.setAttribute("name", "footsteps-outline"); break;
        case "PGM's": icone.setAttribute("name", "megaphone-outline"); break;
        default: return;
      }

      if (icone.getAttribute("name")) {
        icones.append(icone);
      }
    });
  }
}

// Exporta para uso em Calendario.js
window.Dia = Dia;