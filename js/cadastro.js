const formCadastro = document.querySelector("form");

formCadastro.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const campos = formCadastro.querySelectorAll("input");

  const nome = campos[0].value;
  const dataNascimento = campos[1].value;
  const email = campos[2].value;
  const telefone = campos[3].value;
  const senha = campos[4].value;
  const confirmarSenha = campos[5].value;

  if (senha !== confirmarSenha) {
    alert("As senhas não são iguais.");
    return;
  }

  const usuario = {
    nome: nome,
    dataNascimento: dataNascimento,
    email: email,
    telefone: telefone,
    senha: senha
  };

  localStorage.setItem("usuarioCadastro", JSON.stringify(usuario));
  localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

  alert("Cadastro realizado com sucesso!");

  window.location.href = "Questionario.html";
});