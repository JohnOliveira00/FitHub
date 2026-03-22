(function () {
  const form = document.getElementById("form-login");
  const msg = document.getElementById("msg");

  function showMessage(text, type) {
    msg.hidden = false;
    msg.textContent = text;
    msg.className = "msg " + (type === "ok" ? "msg--ok" : "msg--err");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.hidden = true;

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showMessage(
          data.message || "Não foi possível entrar. Verifique email e senha.",
          "err"
        );
        return;
      }

      showMessage(data.message || "Bem-vindo!", "ok");
    } catch {
      showMessage("Erro de conexão. Use http://localhost:3000 e rode npm start.", "err");
    }
  });
})();
