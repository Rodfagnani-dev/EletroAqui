/* Autenticação local (localStorage). Não é segura: use backend real em produção. */
const Auth = {
  user() {
    const id = store.get("eg_session");
    return id ? usuarios().find((x) => x.id === id) || null : null;
  },
  async hash(s, salt) {
    const b = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(salt + s),
    );
    return [...new Uint8Array(b)]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("");
  },
  async registrar(d, senha) {
    const us = usuarios();
    if (us.some((x) => x.email === d.email)) return null;
    const salt = crypto.randomUUID(),
      n = {
        ...d,
        id: "u" + Date.now(),
        salt,
        hash: await this.hash(senha, salt),
      };
    us.push(n);
    store.set("eg_users", us);
    return n;
  },
  async entrar(email, senha) {
    const u = usuarios().find((x) => x.email === email && x.hash);
    return u && (await this.hash(senha, u.salt)) === u.hash
      ? (store.set("eg_session", u.id), u)
      : null;
  },
  sair() {
    localStorage.removeItem("eg_session");
  },
};
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  telOk = (v) => {
    const d = v.replace(/\D/g, "");
    return d.length === 10 || d.length === 11;
  };
function validarConta(f, er, opcionalSenha) {
  if (f.nome.value.trim().split(/\s+/).length < 2)
    er.push("Informe o nome completo.");
  if (!emailOk(f.email.value.trim())) er.push("Informe um e-mail válido.");
  if (!telOk(f.tel.value)) er.push("Informe um telefone com DDD.");
  const s = f.senha.value;
  if (!(opcionalSenha && !s && !f.senha2.value)) {
    if (s.length < 8) er.push("A senha deve ter pelo menos 8 caracteres.");
    if (s !== f.senha2.value) er.push("A confirmação não confere com a senha.");
  }
  if (f.termos && !f.termos.checked)
    er.push("Aceite os termos de uso e a política de privacidade.");
}
const semCrypto = () =>
  window.crypto?.subtle
    ? false
    : (toast(
        "Seu navegador bloqueou a criptografia. Abra o site por localhost ou HTTPS.",
        "err",
      ),
      true);

document.addEventListener("DOMContentLoaded", () => {
  const pg = document.body.dataset.page;
  if (pg === "login")
    $("#form-login").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = e.target;
      if (semCrypto()) return;
      const u = await Auth.entrar(
        f.email.value.trim().toLowerCase(),
        f.senha.value,
      );
      if (!u) return avisos(f, ["E-mail ou senha incorretos."]);
      flash("Bem-vindo(a), " + u.nome.split(" ")[0] + "!");
      location.href = "solicitacoes.html";
    });
  if (pg === "cliente") {
    $("#bairro").innerHTML =
      '<option value="">Selecione</option>' +
      TODOS_BAIRROS.map((b) => `<option>${b}</option>`).join("");
    $("#form-cliente").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = e.target,
        er = [];
      validarConta(f, er);
      if (!f.bairro.value) er.push("Selecione seu bairro.");
      avisos(f, er);
      if (er.length || semCrypto()) return;
      const ok = await Auth.registrar(
        {
          tipo: "cliente",
          nome: f.nome.value.trim(),
          email: f.email.value.trim().toLowerCase(),
          tel: f.tel.value.trim(),
          bairro: f.bairro.value,
        },
        f.senha.value,
      );
      if (!ok) return avisos(f, ["Já existe uma conta com este e-mail."]);
      flash("Conta criada! Entre para continuar.");
      location.href = "login.html";
    });
  }
  if (pg === "eletricista") cadEletricista();
});

function cadEletricista() {
  const f = $("#form-eletricista"),
    me = Auth.user(),
    edit = me?.tipo === "eletricista";
  if (me && !edit) {
    f.innerHTML =
      '<h1>Área exclusiva para eletricistas</h1><p>Você está logada como cliente. Saia da conta para criar um perfil profissional.</p><a class="btn" href="index.html">Voltar</a>';
    return;
  }
  const chk = (n, v) =>
    `<label><input type="checkbox" name="${n}" value="${esc(v)}"> ${esc(v)}</label>`;
  $("#esps").innerHTML = E.map((s) => chk("esp", s)).join("");
  $("#regs").innerHTML = Object.keys(REGIOES)
    .map((r) => chk("reg", r))
    .join("");
  $("#bairros").innerHTML = Object.entries(REGIOES)
    .map(
      ([r, bs]) =>
        `<p class="mut" style="margin:8px 0 4px">${r}</p><div class="checks">${bs.map((b) => chk("bai", b)).join("")}</div>`,
    )
    .join("");
  if (edit) {
    $("#tit").textContent = "Editar meu perfil";
    $("#salvar").textContent = "Salvar alterações";
    $("#lt").hidden = true;
    f.termos.checked = true;
    f.email.readOnly = true;
    [
      "nome",
      "email",
      "tel",
      "desc",
      "disp",
      "formacao",
      "nr10",
      "cert",
    ].forEach((k) => (f[k].value = me[k] ?? ""));
    $$("[name=esp]").forEach((c) => (c.checked = me.esp.includes(c.value)));
    $$("[name=reg]").forEach((c) => (c.checked = me.regioes.includes(c.value)));
    $$("[name=bai]").forEach((c) => (c.checked = me.bairros.includes(c.value)));
    $$("[name^=senha]", f).forEach((i) => (i.required = false));
    f.senha.closest("label").firstChild.textContent =
      "Nova senha (deixe em branco para manter)";
  }
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    const er = [],
      val = (n) => $$(`[name=${n}]:checked`, f).map((c) => c.value);
    validarConta(f, er, edit);
    if (f.desc.value.trim().length < 20)
      er.push("Descreva sua experiência (mínimo 20 caracteres).");
    if (!val("esp").length) er.push("Selecione ao menos uma especialidade.");
    if (!val("reg").length && !val("bai").length)
      er.push("Selecione ao menos uma região ou bairro.");
    if (!f.disp.value.trim()) er.push("Informe sua disponibilidade.");
    let foto = edit ? me.foto : null;
    if (f.foto.files[0])
      try {
        foto = await lerImagem(f.foto.files[0], 240);
      } catch (x) {
        er.push(x.message);
      }
    avisos(f, er);
    if (er.length || semCrypto()) return;
    const d = {
      tipo: "eletricista",
      nome: f.nome.value.trim(),
      email: f.email.value.trim().toLowerCase(),
      tel: f.tel.value.trim(),
      desc: f.desc.value.trim(),
      esp: val("esp"),
      regioes: val("reg"),
      bairros: val("bai"),
      disp: f.disp.value.trim(),
      formacao: f.formacao.value,
      nr10: f.nr10.value,
      cert: f.cert.value.trim(),
      foto,
      base: edit ? me.base : { soma: 0, n: 0 },
    };
    if (edit) {
      if (!confirm("Salvar as alterações do perfil?")) return;
      const us = usuarios(),
        i = us.findIndex((x) => x.id === me.id);
      us[i] = { ...me, ...d };
      if (f.senha.value) {
        us[i].salt = crypto.randomUUID();
        us[i].hash = await Auth.hash(f.senha.value, us[i].salt);
      }
      store.set("eg_users", us);
      flash("Perfil atualizado.");
      location.href = "perfil.html?id=" + me.id;
      return;
    }
    const n = await Auth.registrar(d, f.senha.value);
    if (!n) return avisos(f, ["Já existe uma conta com este e-mail."]);
    store.set("eg_session", n.id);
    flash("Perfil criado! Você já entrou na sua conta.");
    location.href = "solicitacoes.html";
  });
}
