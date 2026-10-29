/* Utilitários gerais, cabeçalho/rodapé e área de solicitações */
const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k, d) {
    try {
      return JSON.parse(localStorage.getItem(k)) ?? d;
    } catch {
      return d;
    }
  },
  set(k, v) {
    localStorage.setItem(k, JSON.stringify(v));
  },
};
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const norm = (s) =>
  String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const hoje = () => new Date().toISOString().slice(0, 10);
const fmtData = (d) => (d ? d.split("-").reverse().join("/") : "");
function toast(m, t = "ok") {
  let c = $("#toasts");
  if (!c) {
    c = document.createElement("div");
    c.id = "toasts";
    c.setAttribute("aria-live", "polite");
    c.setAttribute("aria-relevant", "additions");
    document.body.append(c);
  }
  const d = document.createElement("div");
  const erro = t === "err",
    icon = document.createElement("span"),
    texto = document.createElement("span"),
    fechar = document.createElement("button");
  d.className = `toast ${erro ? "err" : "ok"}`;
  d.setAttribute("role", erro ? "alert" : "status");
  icon.className = "toast-icone";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = erro ? "!" : "✓";
  texto.className = "toast-texto";
  texto.textContent = m;
  fechar.className = "toast-fechar";
  fechar.type = "button";
  fechar.setAttribute("aria-label", "Fechar notificação");
  fechar.textContent = "×";
  fechar.addEventListener("click", () => d.remove());
  d.append(icon, texto, fechar);
  c.append(d);
  setTimeout(() => d.remove(), 5500);
}
const flash = (m, t = "ok") => store.set("eg_flash", { m, t });
function avisos(form, lista) {
  let b = $(".alert", form);
  if (!b) {
    b = document.createElement("div");
    b.className = "alert";
    b.setAttribute("role", "alert");
    form.prepend(b);
  }
  b.hidden = !lista.length;
  b.innerHTML = lista.length
    ? '<div class="alert-titulo"><span aria-hidden="true">!</span><strong>Confira estes campos</strong></div><ul>' +
      lista.map((x) => `<li>${esc(x)}</li>`).join("") +
      "</ul>"
    : "";
  if (lista.length) b.scrollIntoView({ block: "center" });
}
function lerImagem(file, max = 600) {
  return new Promise((ok, no) => {
    if (!file.type.startsWith("image/"))
      return no(new Error("O arquivo precisa ser uma imagem."));
    const r = new FileReader();
    r.onerror = () => no(new Error("Falha ao ler a imagem."));
    r.onload = () => {
      const i = new Image();
      i.onerror = () => no(new Error("Imagem inválida."));
      i.onload = () => {
        const k = Math.min(1, max / Math.max(i.width, i.height)),
          c = document.createElement("canvas");
        c.width = i.width * k;
        c.height = i.height * k;
        c.getContext("2d").drawImage(i, 0, 0, c.width, c.height);
        ok(c.toDataURL("image/jpeg", 0.7));
      };
      i.src = r.result;
    };
    r.readAsDataURL(file);
  });
}
const TERMOS = {
  termos: [
    "Termos de uso",
    "A plataforma conecta clientes e eletricistas. As qualificações são informadas pelos profissionais e devem ser conferidas pelo contratante antes da contratação. A plataforma não garante a execução dos serviços.",
  ],
  privacidade: [
    "Política de privacidade",
    "Os dados inseridos ficam armazenados localmente neste navegador e não são enviados a um servidor. Evite inserir informações sensíveis.",
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  const u = Auth.user(),
    pg = document.body.dataset.page;
  $("#topo").innerHTML =
    `<div class="wrap bar"><a class="logo" href="index.html" aria-label="EletroAqui, página inicial">⚡ EletroAqui<small>Curitiba</small></a>
 ${pg === "home" ? "" : '<form class="busca" action="index.html" role="search"><input type="search" name="q" aria-label="Buscar eletricista ou serviço" placeholder="Buscar eletricista ou serviço"><button class="btn" aria-label="Buscar">🔍</button></form>'}
 <button class="menu" aria-expanded="false" aria-controls="nav">Menu</button>
 <nav id="nav" aria-label="Principal"><a href="index.html">Eletricistas</a>${u?.tipo === "eletricista" ? '<a href="cadastro-eletricista.html">Editar perfil</a>' : u ? "" : '<a href="cadastro-eletricista.html">Anunciar serviços</a>'}
 ${u ? `<a href="solicitacoes.html">Solicitações</a><span class="ola">Olá, ${esc(u.nome.split(" ")[0])}</span><button class="btn ghost peq" id="sair">Sair</button>` : '<a class="btn ghost" href="login.html">Entrar</a><a class="btn" href="cadastro-cliente.html">Cadastrar-se</a>'}</nav></div>`;
  $("#rodape").innerHTML =
    `<div class="wrap"><div><h3>⚡ EletroAqui</h3><p>Esta é uma versão demo.</p></div>
 <div><h3>Legal</h3><p><button class="link" data-termo="termos">Termos de uso</button><br><button class="link" data-termo="privacidade">Política de privacidade</button></p></div></div>
 <dialog id="dlg"><h2></h2><p></p><form method="dialog"><button class="btn">Fechar</button></form></dialog>
 <dialog id="dlg-sair" class="confirm-dialog" aria-labelledby="dlg-sair-titulo" aria-describedby="dlg-sair-texto"><div class="confirm-icon" aria-hidden="true">?</div><h2 id="dlg-sair-titulo">Sair da sua conta?</h2><p id="dlg-sair-texto">Você precisará entrar novamente para acessar suas solicitações e conversas.</p><form method="dialog" class="confirm-actions"><button class="btn ghost" value="cancelar">Continuar conectado</button><button class="btn btn-sair" id="confirmar-sair" value="sair">Sair da conta</button></form></dialog>`;
  const nav = $("#nav"),
    mb = $(".menu");
  mb.onclick = () =>
    mb.setAttribute("aria-expanded", nav.classList.toggle("open"));
  $("#sair")?.addEventListener("click", () => {
    $("#dlg-sair").showModal();
  });
  $("#confirmar-sair").addEventListener("click", () => {
    Auth.sair();
    flash("Você saiu da conta.");
    location.href = "index.html";
  });
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-termo]");
    if (!t) return;
    const d = $("#dlg"),
      [h, p] = TERMOS[t.dataset.termo];
    $("h2", d).textContent = h;
    $("p", d).textContent = p;
    d.showModal();
  });
  const fl = store.get("eg_flash");
  if (fl) {
    localStorage.removeItem("eg_flash");
    toast(fl.m, fl.t);
  }
  if (pg === "sol") solInit();
  if (pg === "chat") chatInit();
});

/* ---------- Área de solicitações (cliente e eletricista) ---------- */
const FLUXO = {
  Pendente: ["Aceita", "Recusada"],
  Aceita: ["Em andamento"],
  "Em andamento": ["Concluída"],
};
const VERBO = {
  Aceita: "Aceitar",
  Recusada: "Recusar",
  "Em andamento": "Iniciar atendimento",
  Concluída: "Concluir serviço",
};
const chatAberto = (r) => ["Recusada", "Cancelada"].includes(r.status);
const formatarReais = (valor) =>
  Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
function valorAtualSolicitacao(r) {
  const valor = r.valorAcordado ?? r.valorPropostoCliente ?? r.valorInicial;
  return Number.isFinite(Number(valor)) && Number(valor) > 0
    ? Number(valor)
    : null;
}
function mensagensHtml(r, u, us) {
  const mensagens = Array.isArray(r.chat) ? r.chat : [];
  if (!mensagens.length)
    return '<p class="mut chat-vazio">Ainda não há mensagens. Envie uma mensagem para iniciar a conversa.</p>';
  return mensagens
    .map((m) => {
      const remetente = us.find((x) => x.id === m.remetenteId),
        propria = m.remetenteId === u.id,
        horario = Number.isFinite(m.criado)
          ? new Date(m.criado).toLocaleString("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
            })
          : "";
      return `<article class="chat-mensagem${propria ? " propria" : ""}"><p><strong>${esc(remetente?.nome || "Participante")}</strong><time>${esc(horario)}</time></p><div>${esc(m.texto)}</div></article>`;
    })
    .join("");
}
function solInit() {
  const u = Auth.user();
  if (!u) {
    flash("Entre na sua conta para ver as solicitações.", "err");
    location.href = "login.html";
    return;
  }
  const ele = u.tipo === "eletricista",
    box = $("#sol");
  $("#titulo").textContent = ele
    ? "Solicitações recebidas"
    : "Minhas solicitações";
  const draw = () => {
    const us = usuarios(),
      all = solicitacoes()
        .filter((r) => (ele ? r.eletId === u.id : r.clienteId === u.id))
        .sort((a, b) => b.criado - a.criado);
    if (ele) {
      const m = media(u),
        av = all.filter((r) => r.avaliacao);
      $("#extra").innerHTML =
        `<div class="box"><p><a href="perfil.html?id=${u.id}">Ver meu perfil público</a> · <a href="cadastro-eletricista.html">Editar perfil e regiões</a></p><h2>Minhas avaliações</h2><p class="stars">★ ${m.n ? m.media.toFixed(1).replace(".", ",") : "Sem notas"} (${m.n} avaliações)</p>${av.length ? av.map((r) => `<p>${"★".repeat(r.avaliacao.nota)} ${esc(r.avaliacao.comentario) || '<span class="mut">Sem comentário</span>'}</p>`).join("") : '<p class="mut">Nenhuma avaliação recebida ainda.</p>'}</div><h2 style="margin-top:20px">Pedidos</h2>`;
    }
    box.innerHTML = all.length
      ? all
          .map((r) => {
            const o = us.find((x) => x.id === (ele ? r.clienteId : r.eletId)),
              acs = [];
            if (ele)
              (FLUXO[r.status] || []).forEach((s) =>
                acs.push(
                  `<button class="btn peq ${s === "Recusada" ? "ghost" : ""}" data-id="${r.id}" data-s="${s}">${VERBO[s]}</button>`,
                ),
              );
            else if (["Pendente", "Aceita"].includes(r.status))
              acs.push(
                `<button class="btn peq ghost" data-id="${r.id}" data-s="Cancelada" style="color:var(--err)">Cancelar solicitação</button>`,
              );
            const aval =
              !ele && r.status === "Concluída"
                ? r.avaliacao
                  ? `<p class="stars">Sua avaliação: ${"★".repeat(r.avaliacao.nota)} <span class="mut">${esc(r.avaliacao.comentario)}</span></p>`
                  : `<form class="aval" data-id="${r.id}"><label>Nota<select name="nota"><option value="">Escolha</option>${[5, 4, 3, 2, 1].map((n) => `<option value="${n}">${n} ${n > 1 ? "estrelas" : "estrela"}</option>`).join("")}</select></label><label>Comentário<textarea name="c" rows="2" maxlength="400"></textarea></label><button class="btn peq">Enviar avaliação</button></form>`
                : "";
            const valorAtual = valorAtualSolicitacao(r),
              propostas = Array.isArray(r.propostasValor)
                ? r.propostasValor
                : [],
              propostaAtual = propostas[propostas.length - 1],
              propostaCliente = r.valorPropostoCliente ?? null,
              propostaValor =
                propostaAtual &&
                `<div class="proposta-valor"><h4>${propostas.length > 1 ? "Contraproposta do prestador" : "Primeiro orçamento do prestador"}</h4>${propostaAtual.valorAnterior != null ? `<p>Orçamento anterior: <strong>${formatarReais(propostaAtual.valorAnterior)}</strong></p>` : ""}<p>Valor total proposto: <strong>${formatarReais(propostaAtual.valor)}</strong></p><p><strong>Detalhes:</strong> ${esc(propostaAtual.motivo)}</p><p class="proposta-status">Status: <strong>${esc(propostaAtual.status)}</strong></p>${!ele && propostaAtual.status === "Em negociação" ? '<p class="mut">Negociação iniciada no chat. O prestador poderá enviar uma contraproposta.</p>' : ""}${!ele && propostaAtual.status === "Pendente" ? `<p class="mut">Você pode negociar pelo chat ou aceitar o orçamento.</p><div class="acoes"><a class="btn ghost peq" href="chat.html?id=${encodeURIComponent(r.id)}" target="_blank" rel="noopener">Negociar pelo chat</a><button type="button" class="btn peq" data-proposta="aceitar" data-id="${esc(r.id)}">Aceitar orçamento</button><button type="button" class="btn ghost peq" data-proposta="recusar" data-id="${esc(r.id)}">Recusar orçamento</button></div>` : ""}</div>`,
              podePropor =
                ele &&
                r.status === "Pendente" &&
                propostaAtual?.status !== "Pendente" &&
                propostaAtual?.status !== "Aceita",
              formularioProposta = podePropor
                ? `<form class="form-proposta" data-id="${esc(r.id)}"><h4>${propostaAtual ? "Enviar nova contraproposta" : "Enviar primeiro orçamento"}</h4><p class="mut">${propostaAtual ? "O solicitante iniciou uma negociação no chat. Informe seu novo valor total e os detalhes." : "Informe o valor total do serviço e os detalhes do orçamento."}</p><div class="dois"><label>Valor total (R$)<input type="number" name="valor" min="0.01" step="0.01" required></label><label>Detalhes do orçamento<textarea name="motivo" rows="2" minlength="10" maxlength="500" required placeholder="Descreva o que está incluído no valor"></textarea></label></div><button class="btn peq">Enviar orçamento</button></form>`
                : "";
            return `<article class="card"><div class="head"><h3 style="margin:0">${esc(r.servico)}</h3><span class="badge st-${r.status}">${r.status}</span></div>
   <p class="mut">${ele ? "Cliente" : "Eletricista"}: ${o ? esc(o.nome) : "—"}${ele && o && ["Aceita", "Em andamento", "Concluída"].includes(r.status) ? " · Contato: " + esc(o.tel) : ""}</p>
   <p>${esc(r.desc)}</p><p class="mut">📍 ${esc(r.bairro)}${r.endereco ? " · " + esc(r.endereco) : ""} · 📅 ${fmtData(r.data)} (${esc(r.periodo)})</p>${propostaCliente === null ? "" : `<p class="valor-servico">Proposta inicial do solicitante: <strong>${formatarReais(propostaCliente)}</strong></p>`}${r.valorAcordado == null ? "" : `<p class="valor-servico">Valor acordado: <strong>${formatarReais(r.valorAcordado)}</strong></p>`}${Number(r.valorCobrado) > 0 ? `<p class="valor-servico">Valor final cobrado: <strong>${formatarReais(r.valorCobrado)}</strong></p>` : ""}${propostaValor || (!propostaCliente && !propostaAtual && ele ? '<p class="mut">Aguardando o prestador enviar o primeiro orçamento.</p>' : "")}${formularioProposta}
   ${r.fotos?.length ? `<div class="fotos">${r.fotos.map((f) => `<img src="${f}" alt="Foto anexada à solicitação">`).join("")}</div>` : ""}${aval}<div class="acoes">${acs.join("")}<a class="btn ghost peq" href="chat.html?id=${encodeURIComponent(r.id)}" target="_blank" rel="noopener">Abrir conversa (${Array.isArray(r.chat) ? r.chat.length : 0})</a></div></article>`;
          })
          .join("")
      : `<div class="vazio"><p>${ele ? "Você ainda não recebeu solicitações." : "Você ainda não fez nenhuma solicitação."}</p>${ele ? "" : '<a class="btn" href="index.html">Encontrar eletricistas</a>'}</div>`;
  };
  box.addEventListener("click", (e) => {
    const propostaBtn = e.target.closest("[data-proposta]");
    if (propostaBtn) {
      const rs = solicitacoes(),
        r = rs.find((x) => x.id === propostaBtn.dataset.id),
        propostas = Array.isArray(r?.propostasValor) ? r.propostasValor : [],
        proposta = propostas[propostas.length - 1],
        acao = propostaBtn.dataset.proposta;
      if (
        !r ||
        ele ||
        r.clienteId !== u.id ||
        !proposta ||
        r.status !== "Pendente" ||
        proposta.status !== "Pendente"
      )
        return toast("Esta proposta não pode mais ser respondida.", "err");
      if (!["aceitar", "recusar"].includes(acao)) return;
      proposta.status = acao === "aceitar" ? "Aceita" : "Recusada";
      proposta.respondida = Date.now();
      if (acao === "aceitar") r.valorAcordado = proposta.valor;
      try {
        store.set("eg_reqs", rs);
      } catch {
        return toast("Não foi possível salvar sua resposta.", "err");
      }
      toast(
        acao === "aceitar"
          ? "Orçamento aceito. O prestador ainda precisa aceitar a solicitação."
          : "Orçamento recusado. Você pode negociar pelo chat.",
      );
      draw();
      return;
    }
    const b = e.target.closest("[data-s]");
    if (!b) return;
    const rs = solicitacoes(),
      r = rs.find((x) => x.id === b.dataset.id),
      s = b.dataset.s;
    if (!r || !confirm(`Confirmar: ${VERBO[s] || "cancelar solicitação"}?`))
      return;
    const ok = ele
      ? (FLUXO[r.status] || []).includes(s)
      : ["Pendente", "Aceita"].includes(r.status) && s === "Cancelada";
    if (!ok) return toast("Ação não permitida para este status.", "err");
    const propostaPendente = Array.isArray(r.propostasValor)
      ? r.propostasValor.some((p) => p.status === "Pendente")
      : false;
    const propostaAtual = Array.isArray(r.propostasValor)
      ? r.propostasValor[r.propostasValor.length - 1]
      : null;
    const propostaAceita = propostaAtual?.status === "Aceita";
    if (ele && s === "Aceita" && propostaPendente)
      return toast(
        "Aguarde a resposta do solicitante ao seu orçamento antes de aceitar o serviço.",
        "err",
      );
    if (
      ele &&
      s === "Aceita" &&
      !propostaAceita &&
      !(r.valorAcordado > 0 && r.valorPropostoCliente == null)
    )
      return toast(
        "Envie seu orçamento e aguarde o solicitante aceitá-lo antes de aceitar o serviço.",
        "err",
      );
    let valorCobrado;
    if (ele && s === "Concluída") {
      const entrada = prompt(
        "Informe o valor total realmente cobrado pelo serviço (R$):",
        String(
          r.valorAcordado ?? r.valorPropostoCliente ?? r.valorInicial ?? "",
        ).replace(".", ","),
      );
      if (entrada === null) return;
      const valorDigitado = entrada.trim().replace(/[^\d,.-]/g, ""),
        valorNormalizado = valorDigitado.includes(",")
          ? valorDigitado.replace(/\./g, "").replace(",", ".")
          : valorDigitado;
      valorCobrado = Number(valorNormalizado);
      if (!Number.isFinite(valorCobrado) || valorCobrado <= 0)
        return toast("Informe um valor cobrado válido, maior que zero.", "err");
    }
    r.status = s;
    if (valorCobrado !== undefined) r.valorCobrado = valorCobrado;
    store.set("eg_reqs", rs);
    toast("Status atualizado: " + s);
    draw();
  });
  box.addEventListener("submit", (e) => {
    const propostaForm = e.target.closest(".form-proposta");
    if (propostaForm) {
      e.preventDefault();
      const rs = solicitacoes(),
        r = rs.find((x) => x.id === propostaForm.dataset.id),
        valor = Number(propostaForm.elements.valor.value),
        motivo = propostaForm.elements.motivo.value.trim(),
        propostas = Array.isArray(r?.propostasValor) ? r.propostasValor : [],
        ultima = propostas[propostas.length - 1],
        atual = r ? valorAtualSolicitacao(r) : 0;
      if (!r || !ele || r.eletId !== u.id || r.status !== "Pendente")
        return toast(
          "O orçamento só pode ser enviado antes de aceitar o serviço.",
          "err",
        );
      if (ultima?.status === "Pendente")
        return toast(
          "Aguarde a resposta do solicitante ao orçamento atual.",
          "err",
        );
      if (ultima?.status === "Aceita")
        return toast(
          "O solicitante já aceitou seu orçamento. Aceite o serviço para continuar.",
          "err",
        );
      if (ultima && !["Recusada", "Em negociação"].includes(ultima.status))
        return toast(
          "Aguarde o solicitante iniciar a negociação pelo chat.",
          "err",
        );
      if (!Number.isFinite(valor) || valor <= 0)
        return toast("Informe um valor maior que zero.", "err");
      if (motivo.length < 10)
        return toast("Explique o motivo com pelo menos 10 caracteres.", "err");
      if (motivo.length > 500)
        return toast("O motivo deve ter no máximo 500 caracteres.", "err");
      propostas.push({
        valorAnterior: ultima?.valor ?? null,
        valor,
        motivo,
        status: "Pendente",
        criado: Date.now(),
      });
      r.propostasValor = propostas;
      try {
        store.set("eg_reqs", rs);
      } catch {
        return toast("Não foi possível salvar a proposta.", "err");
      }
      toast("Proposta enviada para aprovação do solicitante.");
      draw();
      return;
    }
    const f = e.target.closest(".aval");
    if (!f) return;
    e.preventDefault();
    const rs = solicitacoes(),
      r = rs.find((x) => x.id === f.dataset.id),
      n = +f.nota.value;
    if (!r || r.clienteId !== u.id || r.status !== "Concluída")
      return toast("Só é possível avaliar serviços concluídos.", "err");
    if (r.avaliacao) return toast("Esta solicitação já foi avaliada.", "err");
    if (!n) return toast("Escolha uma nota de 1 a 5.", "err");
    r.avaliacao = { nota: n, comentario: f.c.value.trim() };
    store.set("eg_reqs", rs);
    toast("Avaliação registrada. Obrigado!");
    draw();
  });
  window.addEventListener("storage", (e) => {
    if (e.key === "eg_reqs") draw();
  });
  draw();
}

function chatInit() {
  const box = $("#chat"),
    u = Auth.user(),
    id = new URLSearchParams(location.search).get("id");
  if (!u) {
    flash("Entre na sua conta para acessar a conversa.", "err");
    location.href = "login.html";
    return;
  }
  const render = () => {
    const r = solicitacoes().find((x) => x.id === id);
    if (!r || (u.id !== r.clienteId && u.id !== r.eletId)) {
      box.innerHTML =
        '<div class="vazio"><p>Conversa não encontrada ou você não tem acesso a ela.</p><a class="btn" href="solicitacoes.html">Voltar às solicitações</a></div>';
      return;
    }
    const us = usuarios(),
      outroId = u.id === r.clienteId ? r.eletId : r.clienteId,
      outro = us.find((x) => x.id === outroId),
      iniciais = (outro?.nome || "Participante")
        .split(/\s+/)
        .map((parte) => parte[0])
        .slice(0, 2)
        .join("");
    document.title = `Conversa com ${outro ? outro.nome : "participante"} — EletroAqui`;
    box.innerHTML = `<section class="chat-box"><header class="chat-header"><a class="chat-voltar" href="solicitacoes.html" aria-label="Voltar às solicitações">←</a><div class="chat-avatar" aria-hidden="true">${esc(iniciais)}</div><div class="chat-contato"><h1>${esc(outro?.nome || "Participante")}</h1><p>${esc(r.servico)} <span class="badge st-${esc(r.status)}">${esc(r.status)}</span></p></div></header><p class="chat-aviso">As mensagens ficam salvas neste navegador e não são sincronizadas com outros dispositivos.</p><div class="chat-mensagens" role="log" aria-live="polite" aria-label="Mensagens da solicitação">${mensagensHtml(r, u, us)}</div>${chatAberto(r) ? '<p class="chat-encerrado">Esta solicitação foi encerrada e não aceita novas mensagens.</p>' : `<form class="chat-form" data-id="${esc(r.id)}"><label class="sr-only" for="chat-texto">Mensagem</label><textarea id="chat-texto" name="texto" rows="2" maxlength="1000" required placeholder="Escreva sua mensagem..." aria-label="Mensagem (até 1000 caracteres)"></textarea><button class="btn" aria-label="Enviar mensagem">Enviar <span aria-hidden="true">➤</span></button></form>`}</section>`;
    const log = $(".chat-mensagens", box);
    log.scrollTop = log.scrollHeight;
  };
  box.addEventListener("submit", (e) => {
    const form = e.target.closest(".chat-form");
    if (!form) return;
    e.preventDefault();
    const atual = Auth.user(),
      rs = solicitacoes(),
      r = rs.find((x) => x.id === form.dataset.id),
      texto = form.elements.texto.value.trim();
    if (
      !atual ||
      !r ||
      (atual.id !== r.clienteId && atual.id !== r.eletId) ||
      chatAberto(r)
    )
      return toast(
        "Não foi possível enviar a mensagem nesta solicitação.",
        "err",
      );
    if (!texto) return toast("Escreva uma mensagem antes de enviar.", "err");
    if (!Array.isArray(r.chat)) r.chat = [];
    r.chat.push({ remetenteId: atual.id, texto, criado: Date.now() });
    const propostas = Array.isArray(r.propostasValor) ? r.propostasValor : [],
      ultimaProposta = propostas[propostas.length - 1];
    if (
      atual.id === r.clienteId &&
      ["Pendente", "Recusada"].includes(ultimaProposta?.status)
    ) {
      ultimaProposta.status = "Em negociação";
      ultimaProposta.negociacaoIniciada = Date.now();
    }
    try {
      store.set("eg_reqs", rs);
    } catch {
      return toast(
        "Não foi possível salvar a mensagem neste navegador.",
        "err",
      );
    }
    render();
  });
  window.addEventListener("storage", (e) => {
    if (e.key === "eg_reqs") render();
  });
  render();
}
