(function () {
  const form = document.getElementById("form-register");
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
    const senha2 = document.getElementById("senha2").value;

    if (senha !== senha2) {
      showMessage("As senhas não coincidem.", "err");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showMessage(data.message || "Não foi possível cadastrar.", "err");
        return;
      }

      showMessage(data.message || "Conta criada! Redirecionando…", "ok");
      setTimeout(() => {
        window.location.href = "./index.html";
      }, 1200);
    } catch {
      showMessage("Erro de conexão. O servidor está rodando? (npm start)", "err");
    }
  });
})();
