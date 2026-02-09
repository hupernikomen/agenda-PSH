// js/firebase-ops.js - Todas as operações com o Firestore (agenda + aniversariantes)

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyBaKTM5jQJFY3fC4jAQyaE_p08lbyY68A8",
  authDomain: "agendaigrejas.firebaseapp.com",
  projectId: "agendaigrejas",
  storageBucket: "agendaigrejas.firebasestorage.app",
  messagingSenderId: "881520232726",
  appId: "1:881520232726:web:04e06e502c2c7f3ba16837"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Auxiliares para coleções dinâmicas
function getColecaoAgenda() {
  if (!window.colecaoAtual) {
    console.warn("Coleção de agenda não definida. Usando fallback.");
    return "agenda-igreja1";
  }
  return window.colecaoAtual;
}

function getColecaoAniversariantes() {
  if (!window.colecaoAtual) return "aniversariantes-igreja1";
  return "aniversariantes-" + window.colecaoAtual.split('-')[1];
}

// ======================
// Agenda (cultos, dirigente, pregador, atalaias, infantil)
// ======================

window.programacaoDoDia = async function (dia) {
  try {
    const colecao = getColecaoAgenda();
    const docRef = doc(collection(db, colecao), String(dia));
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : { prog: [], dir: "", preg: "", ata1: "", ata2: "", inf1: "", inf2: "" };
  } catch (err) {
    console.error(`Erro ao buscar dia ${dia}:`, err);
    return { prog: [], dir: "", preg: "", ata1: "", ata2: "", inf1: "", inf2: "" };
  }
};

window.salvarDiaNoFirestore = async function (cal) {
  if (!cal?.dia) return false;

  try {
    const colecao = getColecaoAgenda();
    const docRef = doc(collection(db, colecao), String(cal.dia));
    await setDoc(docRef, {
      ...cal,
      mes: parseInt(localStorage.getItem("mes") || (new Date().getMonth() + 1)),
      ano: parseInt(localStorage.getItem("ano") || new Date().getFullYear()),
      ultimaAtualizacao: new Date().toISOString()
    }, { merge: true });
    console.log(`Agenda salva em ${colecao} - dia ${cal.dia}`);
    return true;
  } catch (err) {
    console.error("Erro ao salvar agenda:", err);
    return false;
  }
};

window.apagarDiaNoFirestore = async function (dia) {

  console.log(dia, 'dia teste')
  try {
    const colecao = getColecaoAgenda();
    const docRef = doc(collection(db, colecao), String(dia));
    await deleteDoc(docRef);
    console.log(`Agenda apagada de ${colecao} - dia ${dia}`);
    return true;
  } catch (err) {
    console.error("Erro ao apagar agenda:", err);
    return false;
  }
};

// ======================
// Aniversariantes
// ======================

window.salvarAniversariantes = async function (dia, mes, nomesNovos) {
  if (!nomesNovos?.length) return false;

  const colecao = getColecaoAniversariantes();
  const docId = `${mes}-${dia}`;

  try {
    const docRef = doc(collection(db, colecao), docId);
    const docSnap = await getDoc(docRef);

    let nomesExistentes = docSnap.exists() ? (docSnap.data().nomes || []) : [];

    const todosNomes = [...new Set([...nomesExistentes, ...nomesNovos])];

    await setDoc(docRef, {
      dia: parseInt(dia),
      mes: parseInt(mes),
      nomes: todosNomes,
      ultimaAtualizacao: new Date().toISOString()
    }, { merge: true });

    console.log(`Aniversariantes salvos em ${colecao}: ${todosNomes.join(", ")} - ${dia}/${mes}`);
    return true;
  } catch (err) {
    console.error("Erro ao salvar aniversariantes:", err);
    return false;
  }
};

window.buscarAniversariantesDoMes = async function (mes) {
  const colecao = getColecaoAniversariantes();
  const aniversariantes = {};

  try {
    const querySnapshot = await getDocs(collection(db, colecao));
    querySnapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (data.mes === parseInt(mes)) {
        const dia = data.dia;
        if (!aniversariantes[dia]) aniversariantes[dia] = [];
        aniversariantes[dia].push(...(data.nomes || []));
      }
    });
    return aniversariantes;
  } catch (err) {
    console.error("Erro ao buscar aniversariantes:", err);
    return {};
  }
};

window.removerAniversariante = async function (dia, mes, nomeRemover) {
  const colecao = getColecaoAniversariantes();
  const docId = `${mes}-${dia}`;

  try {
    const docRef = doc(collection(db, colecao), docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return false;

    let nomes = docSnap.data().nomes || [];
    nomes = nomes.filter(n => n !== nomeRemover);

    if (nomes.length === 0) {
      await deleteDoc(docRef);
      console.log(`Documento apagado (vazio): ${docId}`);
    } else {
      await setDoc(docRef, { nomes }, { merge: true });
      console.log(`Removido ${nomeRemover} de ${docId}. Restantes: ${nomes.join(", ")}`);
    }

    return true;
  } catch (err) {
    console.error("Erro ao remover aniversariante:", err);
    return false;
  }
};


window.buscarProgramacaoDoMes = async function (mes, ano) {
  const colecao = getColecaoAgenda();
  const programacao = {};

  try {
    const querySnapshot = await getDocs(collection(db, colecao));
    querySnapshot.forEach(docSnap => {
      const data = docSnap.data();
      // Verifica se o documento é do mês e ano atual
      if (data.mes === parseInt(mes) && data.ano === parseInt(ano)) {
        const dia = parseInt(docSnap.id);
        programacao[dia] = data;
      }
    });
    console.log(`Programação do mês ${mes}/${ano} carregada: ${Object.keys(programacao).length} dias`);
    return programacao;
  } catch (err) {
    console.error("Erro ao buscar programação do mês:", err);
    return {};
  }
};