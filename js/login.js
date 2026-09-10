const formLogin = document.querySelector("form");
const emailLogin = document.querySelector("input[name='email']");
const senhaLogin = document.querySelector("input[name='senha']");

formLogin.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const usuarioCadastrado = JSON.parse(localStorage.getItem("usuarioCadastro"));

  if (!usuarioCadastrado) {
    alert("Nenhum cadastro encontrado. Faça seu cadastro primeiro.");
    window.location.href = "Cadrasto.html";
    return;
  }

  if (
    emailLogin.value === usuarioCadastrado.email &&
    senhaLogin.value === usuarioCadastrado.senha
  ) {
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioCadastrado));

    alert("Login realizado com sucesso!");

    window.location.href = "inicio.html";
  } else {
    alert("E-mail ou senha incorretos.");
  }
});