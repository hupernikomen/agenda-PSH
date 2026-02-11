// js/firebase-ops.js - Operações com Firestore (agenda + aniversariantes)

import { getFirestore, collection, doc, getDoc, setDoc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
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

// ======================
// Helpers para coleções dinâmicas (baseado na igreja atual)
function getColecaoAgenda() {
  return window.colecaoAtual || "agenda-igreja1";
}

function getColecaoAniversariantes() {
  const igreja = window.colecaoAtual?.split('-')[1] || 'igreja1';
  return `aniversariantes-${igreja}`;
}

// ======================
// Agenda (cultos, dirigente, pregador, atalaias, infantil, amor)
// ======================

window.programacaoDoDia = async function (dia) {
  try {
    const colecao = getColecaoAgenda();
    const docRef = doc(collection(db, colecao), String(dia));
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : {
      prog: [], dir: "", preg: "", ata1: "", ata2: "",
      inputInf1: "", inputInf2: "", inputInf3: "", amor: ""
    };
  } catch (err) {
    console.error(`Erro ao buscar programação do dia ${dia}:`, err);
    return { prog: [], dir: "", preg: "", ata1: "", ata2: "", inputInf1: "", inputInf2: "", inputInf3: "", amor: "" };
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

    return true;
  } catch (err) {
    console.error("Erro ao salvar dia na agenda:", err);
    return false;
  }
};

window.apagarDiaNoFirestore = async function (dia) {
  try {
    const colecao = getColecaoAgenda();
    const docRef = doc(collection(db, colecao), String(dia));
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error("Erro ao apagar dia da agenda:", err);
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
      if (data.mes === parseInt(mes) && data.ano === parseInt(ano)) {
        const dia = parseInt(docSnap.id);
        programacao[dia] = data;
      }
    });
    return programacao;
  } catch (err) {
    console.error("Erro ao buscar programação do mês:", err);
    return {};
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
    console.error("Erro ao buscar aniversariantes do mês:", err);
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
    } else {
      await setDoc(docRef, { nomes }, { merge: true });
    }

    return true;
  } catch (err) {
    console.error("Erro ao remover aniversariante:", err);
    return false;
  }
};