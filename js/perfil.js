const fotoPerfil = document.getElementById("fotoPerfil");
const inputFotoPerfil = document.getElementById("inputFotoPerfil");
const nomeUsuario = document.getElementById("nomeUsuario");
const salvarNome = document.getElementById("salvarNome");
const emailUsuario = document.getElementById("emailUsuario");

const semanasPerfil = document.getElementById("semanasGestacaoPerfil");

const botaoCriarPasta = document.getElementById("criarPasta");
const listaPastas = document.getElementById("listaPastas");
const botaoCarteirinhaCompleta = document.getElementById("abrirCarteirinhaCompleta");

function pegarUsuarioPerfil() {
  return (
    JSON.parse(localStorage.getItem("usuarioLogado")) ||
    JSON.parse(localStorage.getItem("usuarioCadastro")) ||
    {
      nome: "Mamãe",
      email: "E-mail não encontrado"
    }
  );
}

function pegarDadosQuestionario() {
  return JSON.parse(localStorage.getItem("questionarioPrenatal")) || {};
}

function preencherTexto(id, valor) {
  const elemento = document.getElementById(id);

  if (elemento) {
    elemento.textContent = valor || "Não informado";
  }
}

function transformarData(data) {
  if (!data) {
    return null;
  }

  if (data.includes("-")) {
    return new Date(data + "T00:00:00");
  }

  if (data.includes("/")) {
    const partes = data.split("/");
    return new Date(partes[2], partes[1] - 1, partes[0]);
  }

  return null;
}

function calcularIdade(dataNascimento) {
  const nascimento = usuario.dataNascimento || questionario.dataNascimento || questionario["data-nascimento"];

preencherTexto("cardNascimento", nascimento);
preencherTexto("cardIdade", calcularIdade(nascimento));

  if (!nascimento || isNaN(nascimento.getTime())) {
    return "Não informado";
  }

  const hoje = new Date();

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return idade + " anos";
}

function calcularSemanasPorDum(dum) {
  const dataDum = transformarData(dum);

  if (!dataDum || isNaN(dataDum.getTime())) {
    return "Semanas não informadas";
  }

  const hoje = new Date();
  const diferenca = hoje - dataDum;
  const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
  const semanas = Math.floor(dias / 7);

  if (semanas < 0 || isNaN(semanas)) {
    return "Data inválida";
  }

  return String(semanas).padStart(2, "0") + " semanas";
}

function mostrarDadosUsuario() {
  const usuario = pegarUsuarioPerfil();

  if (nomeUsuario) {
    nomeUsuario.value = usuario.nome || usuario.nomeCompleto || "Mamãe";
  }

  if (emailUsuario) {
    emailUsuario.textContent = usuario.email || "E-mail não encontrado";
  }

  const fotoSalva = localStorage.getItem("fotoPerfil");

  if (fotoSalva && fotoPerfil) {
    fotoPerfil.src = fotoSalva;
  }
}

function salvarNomeUsuario() {
  const usuario = pegarUsuarioPerfil();

  usuario.nome = nomeUsuario.value;

  localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
  localStorage.setItem("usuarioCadastro", JSON.stringify(usuario));

  preencherTexto("cardNome", usuario.nome);

  alert("Nome atualizado com sucesso!");
}

function trocarFotoPerfil() {
  const arquivo = inputFotoPerfil.files[0];

  if (!arquivo) {
    return;
  }

  const leitor = new FileReader();

  leitor.onload = () => {
    fotoPerfil.src = leitor.result;
    localStorage.setItem("fotoPerfil", leitor.result);
  };

  leitor.readAsDataURL(arquivo);
}

function preencherCarteirinhaPequena() {
  const usuario = pegarUsuarioPerfil();
  const questionario = pegarDadosQuestionario();

  const nome = usuario.nome || questionario.nome || questionario["nome-completo"];
  const email = usuario.email || questionario.email;
  const telefone = usuario.telefone || questionario.telefone;
  const nascimento = usuario.dataNascimento || questionario.dataNascimento || questionario["data-nascimento"];

  preencherTexto("cardNome", nome);
  preencherTexto("cardNascimento", nascimento);
  preencherTexto("cardIdade", calcularIdade(nascimento));
  preencherTexto("cardSangue", questionario["tipo-sanguineo"] || questionario.tipoSanguineo);
  preencherTexto("cardEmail", email);
  preencherTexto("cardTelefone", telefone);

  preencherTexto("cardDum", questionario.dum);
  preencherTexto("cardDpp", questionario.dpp);
  preencherTexto("cardGestacoes", questionario["outras-gestacoes"] || questionario.gestacoes);
  preencherTexto("cardPartos", questionario["parto-normal-quantidade"] || questionario["cesarea-quantidade"] || questionario.partos);
  preencherTexto("cardAbortos", questionario["aborto-quantidade"] || questionario.aborto);
  preencherTexto("cardAlergias", questionario.alergias);

preencherTexto("cardAltura", questionario.altura);
preencherTexto("cardPeso", questionario.peso);
preencherTexto("cardCidade", questionario.cidade);
preencherTexto("cardUnidadeSaude", questionario["unidade-saude"]);
preencherTexto("cardDiabetes", questionario.diabetes);
preencherTexto("cardHipertensao", questionario.hipertensao);

  const semanas = calcularSemanasPorDum(questionario.dum);

  if (semanasPerfil) {
    semanasPerfil.textContent = semanas;
  }
}

function abrirCarteirinhaCompleta() {
  const usuario = pegarUsuarioPerfil();
  const questionario = pegarDadosQuestionario();

  const modalAntigo = document.getElementById("modalCarteirinhaCompleta");

  if (modalAntigo) {
    modalAntigo.remove();
  }

  const modal = document.createElement("div");
  modal.id = "modalCarteirinhaCompleta";
  modal.classList.add("modal-carteirinha-completa");

  modal.innerHTML = `
    <div class="modal-carteirinha-conteudo">
      <button class="fechar-modal-carteirinha" type="button">×</button>

      <h2>Carteirinha do Pré-natal</h2>
      <p>Todos os dados preenchidos pela gestante.</p>

      <div class="dados-completos-carteirinha">
        <div>
          <h3>Dados pessoais</h3>
          <p><strong>Nome:</strong> ${usuario.nome || questionario.nome || "Não informado"}</p>
          <p><strong>E-mail:</strong> ${usuario.email || questionario.email || "Não informado"}</p>
          <p><strong>Telefone:</strong> ${usuario.telefone || questionario.telefone || "Não informado"}</p>
          <p><strong>Data de nascimento:</strong> ${usuario.dataNascimento || questionario["data-nascimento"] || "Não informado"}</p>
          <p><strong>Tipo sanguíneo:</strong> ${questionario["tipo-sanguineo"] || "Não informado"}</p>
          <p><strong>Altura:</strong> ${questionario.altura || "Não informado"}</p>
          <p><strong>Peso:</strong> ${questionario.peso || "Não informado"}</p>
          <p><strong>Cidade:</strong> ${questionario.cidade || "Não informado"}</p>
          <p><strong>Unidade de saúde:</strong> ${questionario["unidade-saude"] || "Não informado"}</p>
        </div>

        <div>
          <h3>Gestação</h3>
          <p><strong>Semanas:</strong> ${calcularSemanasPorDum(questionario.dum)}</p>
          <p><strong>DUM:</strong> ${questionario.dum || "Não informado"}</p>
          <p><strong>DPP:</strong> ${questionario.dpp || "Não informado"}</p>
          <p><strong>DPP por ultrassom:</strong> ${questionario["dpp-ultrassom"] || "Não informado"}</p>
          <p><strong>Outras gestações:</strong> ${questionario["outras-gestacoes"] || "Não informado"}</p>
          <p><strong>Parto normal:</strong> ${questionario["parto-normal"] || "Não informado"}</p>
          <p><strong>Quantidade parto normal:</strong> ${questionario["parto-normal-quantidade"] || "Não informado"}</p>
          <p><strong>Cesárea:</strong> ${questionario.cesarea || "Não informado"}</p>
          <p><strong>Quantidade cesárea:</strong> ${questionario["cesarea-quantidade"] || "Não informado"}</p>
          <p><strong>Aborto:</strong> ${questionario.aborto || "Não informado"}</p>
          <p><strong>Quantidade aborto:</strong> ${questionario["aborto-quantidade"] || "Não informado"}</p>
        </div>

        <div>
          <h3>Saúde</h3>
          <p><strong>Hipertensão:</strong> ${questionario.hipertensao || "Não informado"}</p>
          <p><strong>Diabetes:</strong> ${questionario.diabetes || "Não informado"}</p>
          <p><strong>Cardiopatia:</strong> ${questionario.cardiopatia || "Não informado"}</p>
          <p><strong>Anemia:</strong> ${questionario.anemia || "Não informado"}</p>
          <p><strong>Outra condição:</strong> ${questionario["outra-condicao"] || "Não informado"}</p>
          <p><strong>Infecção urinária:</strong> ${questionario["infeccao-urinaria"] || "Não informado"}</p>
          <p><strong>Hospitalizada:</strong> ${questionario.hospitalizada || "Não informado"}</p>
          <p><strong>Sangramento:</strong> ${questionario.sangramento || "Não informado"}</p>
        </div>

        <div>
          <h3>Exames</h3>
          <p><strong>Glicemia de jejum:</strong> ${questionario["glicemia-jejum"] || "Não informado"}</p>
          <p><strong>Teste de glicose:</strong> ${questionario["teste-glicose"] || "Não informado"}</p>
          <p><strong>Sífilis:</strong> ${questionario.sifilis || "Não informado"}</p>
          <p><strong>HIV:</strong> ${questionario.hiv || "Não informado"}</p>
          <p><strong>Hepatite B:</strong> ${questionario["hepatite-b"] || "Não informado"}</p>
          <p><strong>Toxoplasmose:</strong> ${questionario.toxoplasmose || "Não informado"}</p>
          <p><strong>Hemograma:</strong> ${questionario.hemograma || "Não informado"}</p>
          <p><strong>Exame de urina:</strong> ${questionario["exame-urina"] || "Não informado"}</p>
          <p><strong>Urocultura:</strong> ${questionario.urocultura || "Não informado"}</p>
          <p><strong>Ultrassonografia:</strong> ${questionario.ultrassonografia || "Não informado"}</p>
        </div>

        <div>
          <h3>Vacinas e orientações</h3>
          <p><strong>Vacina tétano:</strong> ${questionario["vacina-tetano"] || "Não informado"}</p>
          <p><strong>Vacina hepatite B:</strong> ${questionario["vacina-hepatite-b"] || "Não informado"}</p>
          <p><strong>Vacina influenza:</strong> ${questionario["vacina-influenza"] || "Não informado"}</p>
          <p><strong>Vacina dTpa:</strong> ${questionario["vacina-dtpa"] || "Não informado"}</p>
          <p><strong>Tratamento sífilis:</strong> ${questionario["tratamento-sifilis"] || "Não informado"}</p>
          <p><strong>Malária:</strong> ${questionario.malaria || "Não informado"}</p>
          <p><strong>Visita à maternidade:</strong> ${questionario["visita-maternidade"] || "Não informado"}</p>
          <p><strong>Atividades educativas:</strong> ${questionario["atividades-educativas"] || "Não informado"}</p>
        </div>

        <div>
          <h3>Hábitos</h3>
          <p><strong>Fuma:</strong> ${questionario.fuma || "Não informado"}</p>
          <p><strong>Álcool:</strong> ${questionario.alcool || "Não informado"}</p>
          <p><strong>Outras drogas:</strong> ${questionario["outras-drogas"] || "Não informado"}</p>
          <p><strong>Violência doméstica:</strong> ${questionario["violencia-domestica"] || "Não informado"}</p>
          <p><strong>Intercorrência:</strong> ${questionario.intercorrencia || questionario["intercorrencia-gestacao"] || "Não informado"}</p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".fechar-modal-carteirinha").addEventListener("click", () => {
    modal.remove();
  });
}

let pastas = JSON.parse(localStorage.getItem("pastasPerfil")) || [];

function salvarPastas() {
  localStorage.setItem("pastasPerfil", JSON.stringify(pastas));
}

function mostrarPastas() {
  if (!listaPastas) {
    return;
  }

  listaPastas.innerHTML = "";

  pastas.forEach((pasta) => {
    const card = document.createElement("div");
    card.classList.add("pasta-card");

    card.innerHTML = `
      <div class="icone-pasta">📁</div>

      <h3>${pasta.nome}</h3>
      <p>${pasta.arquivos.length} arquivo(s)</p>

      <label class="botao-anexar">
        Anexar
        <input 
          type="file" 
          multiple 
          accept="image/*,.pdf,.doc,.docx" 
          data-id="${pasta.id}"
        >
      </label>

      <button class="botao-ver-arquivos" type="button" data-id="${pasta.id}">
        Ver arquivos
      </button>

      <button class="botao-excluir-pasta" type="button" data-id="${pasta.id}">
        Excluir pasta
      </button>
    `;

    listaPastas.appendChild(card);
  });
}

function abrirArquivosDaPasta(pasta) {
  const modalAntigo = document.getElementById("modalArquivos");

  if (modalAntigo) {
    modalAntigo.remove();
  }

  const modal = document.createElement("div");
  modal.id = "modalArquivos";
  modal.classList.add("modal-arquivos");

  modal.innerHTML = `
    <div class="modal-arquivos-conteudo">
      <button class="fechar-modal-arquivos" type="button">×</button>

      <h2>${pasta.nome}</h2>
      <p>Arquivos anexados nesta pasta:</p>

      <div class="lista-arquivos-modal">
        ${
          pasta.arquivos.length === 0
            ? "<p>Nenhum arquivo anexado ainda.</p>"
            : pasta.arquivos.map((arquivo) => `
              <a href="${arquivo.conteudo}" target="_blank" download="${arquivo.nome}">
                📎 ${arquivo.nome}
              </a>
            `).join("")
        }
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".fechar-modal-arquivos").addEventListener("click", () => {
    modal.remove();
  });
}

if (salvarNome) {
  salvarNome.addEventListener("click", salvarNomeUsuario);
}

if (inputFotoPerfil) {
  inputFotoPerfil.addEventListener("change", trocarFotoPerfil);
}

if (botaoCarteirinhaCompleta) {
  botaoCarteirinhaCompleta.addEventListener("click", abrirCarteirinhaCompleta);
}

if (botaoCriarPasta) {
  botaoCriarPasta.addEventListener("click", () => {
    const nomePasta = prompt("Digite o nome da nova pasta:");

    if (!nomePasta) {
      return;
    }

    const novaPasta = {
      id: Date.now(),
      nome: nomePasta,
      arquivos: []
    };

    pastas.push(novaPasta);
    salvarPastas();
    mostrarPastas();
  });
}

if (listaPastas) {
  listaPastas.addEventListener("change", (event) => {
    if (event.target.type === "file") {
      const idPasta = Number(event.target.dataset.id);
      const arquivosSelecionados = Array.from(event.target.files);
      const pasta = pastas.find((item) => item.id === idPasta);

      if (!pasta) {
        return;
      }

      arquivosSelecionados.forEach((arquivo) => {
        const leitor = new FileReader();

        leitor.onload = () => {
          pasta.arquivos.push({
            nome: arquivo.name,
            tipo: arquivo.type,
            conteudo: leitor.result
          });

          salvarPastas();
          mostrarPastas();
        };

        leitor.readAsDataURL(arquivo);
      });
    }
  });

  listaPastas.addEventListener("click", (event) => {
    if (event.target.classList.contains("botao-ver-arquivos")) {
      const idPasta = Number(event.target.dataset.id);
      const pasta = pastas.find((item) => item.id === idPasta);

      if (pasta) {
        abrirArquivosDaPasta(pasta);
      }
    }

    if (event.target.classList.contains("botao-excluir-pasta")) {
      const idPasta = Number(event.target.dataset.id);
      const confirmar = confirm("Deseja excluir esta pasta?");

      if (!confirmar) {
        return;
      }

      pastas = pastas.filter((pasta) => pasta.id !== idPasta);

      salvarPastas();
      mostrarPastas();
    }
  });
}

mostrarDadosUsuario();
preencherCarteirinhaPequena();
mostrarPastas();