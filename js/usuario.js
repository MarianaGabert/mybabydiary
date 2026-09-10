function salvarUsuario(usuario) {
  localStorage.setItem("usuarioCadastro", JSON.stringify(usuario));
}

function buscarUsuario() {
  const usuarioSalvo = localStorage.getItem("usuarioCadastro");

  if (usuarioSalvo) {
    return JSON.parse(usuarioSalvo);
  }

  return null;
}