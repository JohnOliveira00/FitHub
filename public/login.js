import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 🔥 suas credenciais
const SUPABASE_URL = "https://lptszaqkrxtliupaostb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_gyo5MIvp_QxOMuCBjrq7zw_ISxaDiPS";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

    // 🔐
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: senha,
    });

    if (error) {
      showMessage("Email ou senha inválidos.", "err");
      return;
    }

    showMessage("Login realizado com sucesso!", "ok");

    // 🚀 redirecionar (opcional)
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
  });
})();