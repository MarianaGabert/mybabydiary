const formQuestionario = document.getElementById("formQuestionario");
const etapas = document.querySelectorAll(".etapa-questionario");
const bolinhas = document.querySelectorAll(".etapa-bolinha");
const btnAnterior = document.getElementById("btnAnterior");
const btnProximo = document.getElementById("btnProximo");
const btnFinalizar = document.getElementById("btnFinalizar");
const camposData = document.querySelectorAll(".campo-data");

let etapaAtual = 0;

camposData.forEach((campo) => {
  campo.addEventListener("input", () => {
    let valor = campo.value.replace(/\D/g, "");

    if (valor.length > 8) {
      valor = valor.slice(0, 8);
    }

    if (valor.length > 4) {
      valor = valor.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
    } else if (valor.length > 2) {
      valor = valor.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    }

    campo.value = valor;
  });
});

function mostrarEtapa() {
  etapas.forEach((etapa, index) => {
    etapa.classList.toggle("ativa", index === etapaAtual);
  });

  bolinhas.forEach((bolinha, index) => {
    bolinha.classList.toggle("ativa", index === etapaAtual);
  });

  btnAnterior.style.display = etapaAtual === 0 ? "none" : "inline-block";
  btnProximo.style.display = etapaAtual === etapas.length - 1 ? "none" : "inline-block";
  btnFinalizar.style.display = etapaAtual === etapas.length - 1 ? "inline-block" : "none";
}

function validarEtapaAtual() {
  const campos = etapas[etapaAtual].querySelectorAll("input, select, textarea");

  for (let campo of campos) {
    if (!campo.checkValidity()) {
      campo.reportValidity();
      return false;
    }
  }

  return true;
}

function salvarQuestionario() {
  const dadosQuestionario = {};
  const campos = formQuestionario.querySelectorAll("input, select, textarea");

  campos.forEach((campo) => {
    const nome = campo.name || campo.id;

    if (!nome) {
      return;
    }

    if (campo.type === "radio") {
      if (campo.checked) {
        dadosQuestionario[nome] = campo.value;
      }

      return;
    }

    if (campo.type === "checkbox") {
      dadosQuestionario[nome] = campo.checked ? "Sim" : "Não";
      return;
    }

    dadosQuestionario[nome] = campo.value;
  });

  localStorage.setItem("questionarioPrenatal", JSON.stringify(dadosQuestionario));
}

btnProximo.addEventListener("click", () => {
  if (!validarEtapaAtual()) {
    return;
  }

  if (etapaAtual < etapas.length - 1) {
    etapaAtual++;
    mostrarEtapa();
  }
});

btnAnterior.addEventListener("click", () => {
  if (etapaAtual > 0) {
    etapaAtual--;
    mostrarEtapa();
  }
});

formQuestionario.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validarEtapaAtual()) {
    return;
  }

  salvarQuestionario();

  alert("Questionário salvo com sucesso!");

  window.location.href = "inicio.html";
});

mostrarEtapa();