const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const caminhoFrontend = path.join(__dirname, "..", "Front-End");
app.use(express.static(caminhoFrontend));

let usuarios = [
  {
    id: 1,
    nome: "Ana Carolina",
    email: "ana@email.com",
    senha: "123456",
    telefone: "(11) 98765-4321",
    dataNascimento: "1995-03-15"
  }
];

let sessoes = [];
let questionarios = [];
let medicamentos = [];
let mensagens = [];

app.get("/", (req, res) => {
  res.redirect("/Login.html");
});

app.post("/cadastro", (req, res) => {
  const {
    nome,
    dataNascimento,
    email,
    telefone,
    senha,
    confirmarSenha
  } = req.body;

  if (senha !== confirmarSenha) {
    return res.send("As senhas não conferem. <a href='/Cadrasto.html'>Voltar</a>");
  }

  const emailJaExiste = usuarios.find((usuario) => usuario.email === email);

  if (emailJaExiste) {
    return res.send("Este e-mail já está cadastrado. <a href='/Login.html'>Entrar</a>");
  }

  const novoUsuario = {
    id: usuarios.length + 1,
    nome,
    dataNascimento,
    email,
    telefone,
    senha
  };

  usuarios.push(novoUsuario);

  res.redirect("/Questionario.html");
});

app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  const usuario = usuarios.find((item) => {
    return item.email === email && item.senha === senha;
  });

  if (!usuario) {
    return res.send("E-mail ou senha incorretos. <a href='/Login.html'>Tentar novamente</a>");
  }

  sessoes.push({
    usuarioId: usuario.id,
    email: usuario.email
  });

  res.redirect("/inicio.html");
});

app.post("/questionario", (req, res) => {
  const respostas = {
    id: questionarios.length + 1,
    tipoSanguineo: req.body.tipoSanguineo,
    condicaoSaude: req.body.condicaoSaude,
    qualCondicao: req.body.qualCondicao,
    primeiraGestacao: req.body.primeiraGestacao,
    perdaGestacional: req.body.perdaGestacional,
    quantasPerdas: req.body.quantasPerdas,
    medicamentoRegular: req.body.medicamentoRegular,
    qualMedicamento: req.body.qualMedicamento,
    alergia: req.body.alergia,
    qualAlergia: req.body.qualAlergia
  };

  questionarios.push(respostas);

  res.redirect("/inicio.html");
});

app.post("/medicamentos", (req, res) => {
  const novoMedicamento = {
    id: medicamentos.length + 1,
    nome: req.body.nome,
    quantidade: req.body.quantidade,
    horario: req.body.horario,
    tomado: false
  };

  medicamentos.push(novoMedicamento);

  res.json({
    mensagem: "Medicamento adicionado com sucesso.",
    medicamento: novoMedicamento
  });
});

app.get("/medicamentos", (req, res) => {
  res.json(medicamentos);
});

app.patch("/medicamentos/:id/tomado", (req, res) => {
  const id = Number(req.params.id);

  const medicamento = medicamentos.find((item) => item.id === id);

  if (!medicamento) {
    return res.status(404).json({ mensagem: "Medicamento não encontrado." });
  }

  medicamento.tomado = !medicamento.tomado;

  res.json({
    mensagem: "Status atualizado.",
    medicamento
  });
});

app.delete("/medicamentos/:id", (req, res) => {
  const id = Number(req.params.id);

  medicamentos = medicamentos.filter((item) => item.id !== id);

  res.json({
    mensagem: "Medicamento excluído com sucesso."
  });
});

app.post("/contato", (req, res) => {
  const novaMensagem = {
    id: mensagens.length + 1,
    email: req.body.email,
    mensagem: req.body.mensagem
  };

  mensagens.push(novaMensagem);

  res.send("Mensagem enviada com sucesso. <a href='/cuidados.html'>Voltar</a>");
});

app.get("/perfil", (req, res) => {
  const usuario = usuarios[0];
  const questionario = questionarios[questionarios.length - 1];

  res.json({
    usuario,
    carteirinha: questionario || null
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});