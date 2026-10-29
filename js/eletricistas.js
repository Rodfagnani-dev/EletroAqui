/* Dados, busca, filtros e perfil público dos eletricistas */
const REGIOES = {
  Centro: ["Centro", "Batel", "Água Verde", "Rebouças", "Bigorrilho"],
  Norte: ["Boa Vista", "Bacacheri", "Santa Cândida", "Bairro Alto"],
  Sul: ["Boqueirão", "Xaxim", "Pinheirinho", "Sítio Cercado"],
  Leste: ["Cajuru", "Jardim das Américas", "Uberaba", "Capão da Imbuia"],
  Oeste: ["Portão", "Fazendinha", "Campo Comprido", "CIC"],
};
const TODOS_BAIRROS = Object.values(REGIOES).flat(),
  regiaoDe = (b) => Object.keys(REGIOES).find((r) => REGIOES[r].includes(b));
const ESPECIALIDADES = [
  "Instalações elétricas residenciais",
  "Instalações elétricas comerciais",
  "Manutenção elétrica",
  "Instalação de tomadas e interruptores",
  "Instalação de luminárias",
  "Troca de disjuntores",
  "Instalação e manutenção de chuveiros",
  "Quadros de distribuição",
  "Identificação e correção de curtos-circuitos",
  "Instalação de ventiladores",
  "Outros serviços elétricos",
];
const E = ESPECIALIDADES;
const HISTORICO_DEMO = {
  e1: { soma: 6100, quantidade: 40 },
  e2: { soma: 2128, quantidade: 28 },
  e3: { soma: 6750, quantidade: 50 },
  e4: { soma: 5720, quantidade: 22 },
  e5: { soma: 3565, quantidade: 31 },
  e6: { soma: 760, quantidade: 8 },
};
const AVALIACOES_EXEMPLO = {
  e1: [
    { nota: 5, comentario: "Serviço explicado com clareza." },
    { nota: 5, comentario: "Atendimento pontual e organizado." },
  ],
  e2: [
    { nota: 5, comentario: "Instalação bem finalizada." },
    { nota: 4, comentario: "Comunicação atenciosa." },
  ],
  e3: [
    { nota: 5, comentario: "Problema identificado rapidamente." },
    { nota: 4, comentario: "Orientações claras durante o atendimento." },
  ],
  e4: [
    { nota: 5, comentario: "Serviço comercial executado com cuidado." },
    { nota: 5, comentario: "Orçamento detalhado e comunicação clara." },
  ],
  e5: [
    { nota: 5, comentario: "Instalação caprichada." },
    { nota: 4, comentario: "Atendimento cordial." },
  ],
  e6: [
    { nota: 5, comentario: "Explicou as opções antes do serviço." },
    { nota: 5, comentario: "Atendimento cuidadoso e organizado." },
  ],
};
const SEED = [
  {
    id: "e1",
    tipo: "eletricista",
    nome: "Marcos Prado",
    email: "marcos.prado@demo.invalid",
    tel: "(41) 90000-0001",
    desc: "Mais de 12 anos em instalações residenciais e adequação de quadros de luz em apartamentos e casas.",
    esp: [E[0], E[5], E[7]],
    regioes: ["Centro"],
    bairros: ["Batel", "Água Verde", "Rebouças"],
    disp: "Seg a sáb, 8h às 18h",
    formacao: "Sim",
    nr10: "Sim",
    cert: "Curso técnico em eletrotécnica",
    base: { soma: 178, n: 37 },
  },
  {
    id: "e2",
    tipo: "eletricista",
    nome: "Juliana Siqueira",
    email: "juliana.siqueira@demo.invalid",
    tel: "(41) 90000-0002",
    desc: "Especialista em iluminação e pequenos reparos. Atendimento organizado e limpo.",
    esp: [E[3], E[4], E[9]],
    regioes: ["Norte"],
    bairros: ["Bacacheri", "Boa Vista"],
    disp: "Seg a sex, 9h às 17h",
    formacao: "Sim",
    nr10: "Em andamento",
    cert: "",
    base: { soma: 61, n: 14 },
  },
  {
    id: "e3",
    tipo: "eletricista",
    nome: "Rogério Tavares",
    email: "rogerio.tavares@demo.invalid",
    tel: "(41) 90000-0003",
    desc: "Chuveiros, curtos-circuitos e manutenção corretiva. Atendo emergências na região sul.",
    esp: [E[6], E[8], E[2]],
    regioes: ["Sul"],
    bairros: [],
    disp: "Todos os dias, 7h às 20h",
    formacao: "Não",
    nr10: "Não",
    cert: "",
    base: { soma: 112, n: 26 },
  },
  {
    id: "e4",
    tipo: "eletricista",
    nome: "Anderson Kowalski",
    email: "anderson.kowalski@demo.invalid",
    tel: "(41) 90000-0004",
    desc: "Projetos e manutenção para lojas, escritórios e pequenas indústrias.",
    esp: [E[1], E[7], E[2]],
    regioes: ["Leste"],
    bairros: ["Cajuru", "Uberaba"],
    disp: "Seg a sex, 8h às 18h",
    formacao: "Sim",
    nr10: "Sim",
    cert: "NR-10 e NR-35",
    base: { soma: 83, n: 18 },
  },
  {
    id: "e5",
    tipo: "eletricista",
    nome: "Patrícia Mendes",
    email: "patricia.mendes@demo.invalid",
    tel: "(41) 90000-0005",
    desc: "Instalações residenciais, tomadas e luminárias com acabamento caprichado.",
    esp: [E[0], E[3], E[4]],
    regioes: ["Oeste"],
    bairros: ["Portão", "CIC"],
    disp: "Seg a sáb, 8h às 17h",
    formacao: "Não",
    nr10: "Não",
    cert: "",
    base: { soma: 29, n: 7 },
  },
  {
    id: "e6",
    tipo: "eletricista",
    nome: "Luciano Bertoldi",
    email: "luciano.bertoldi@demo.invalid",
    tel: "(41) 90000-0006",
    desc: "Instalação de ventiladores de teto e chuveiros. Começando na plataforma.",
    esp: [E[9], E[6], E[10]],
    regioes: ["Sul", "Centro"],
    bairros: [],
    disp: "Fins de semana e noites",
    formacao: "Não",
    nr10: "Não",
    cert: "",
    base: { soma: 0, n: 0 },
  },
];
function usuarios() {
  const usuariosSalvos = store.get("eg_users", []),
    idsSalvos = new Set(usuariosSalvos.map((usuario) => usuario.id)),
    perfisAusentes = SEED.filter((perfil) => !idsSalvos.has(perfil.id)).map(
      (perfil) => ({ ...perfil }),
    ),
    todosUsuarios = [...usuariosSalvos, ...perfisAusentes];
  if (perfisAusentes.length) store.set("eg_users", todosUsuarios);
  return todosUsuarios;
}
const eletricistas = () => usuarios().filter((u) => u.tipo === "eletricista"),
  solicitacoes = () => store.get("eg_reqs", []);
function mediaValores(e, servico) {
  const concluidos = solicitacoes().filter(
    (r) =>
      r.eletId === e.id &&
      r.status === "Concluída" &&
      Number.isFinite(Number(r.valorCobrado)) &&
      Number(r.valorCobrado) > 0 &&
      (!servico || r.servico === servico),
  );
  const historicoDemo =
    !servico && e.email?.endsWith("@demo.invalid")
      ? (e.historicoValoresDemo ?? HISTORICO_DEMO[e.id])
      : null;
  const somaDemo = Number(historicoDemo?.soma) || 0;
  const quantidadeDemo = Number(historicoDemo?.quantidade) || 0;
  const somaReal = concluidos.reduce(
    (soma, r) => soma + Number(r.valorCobrado),
    0,
  );
  const quantidade = quantidadeDemo + concluidos.length;
  return {
    quantidade,
    quantidadeDemo,
    quantidadeReal: concluidos.length,
    media: quantidade ? (somaDemo + somaReal) / quantidade : null,
  };
}
const moeda = (valor) =>
  Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
function media(e) {
  const av = solicitacoes().filter((r) => r.eletId === e.id && r.avaliacao),
    b = e.base || { soma: 0, n: 0 },
    n = b.n + av.length;
  return {
    n,
    media: n ? (b.soma + av.reduce((s, r) => s + r.avaliacao.nota, 0)) / n : 0,
  };
}
function atende(e, { regiao, bairro }) {
  if (bairro)
    return e.bairros.includes(bairro) || e.regioes.includes(regiaoDe(bairro));
  if (regiao)
    return (
      e.regioes.includes(regiao) ||
      e.bairros.some((b) => REGIOES[regiao].includes(b))
    );
  return true;
}
const avatar = (e, g) =>
  e.foto
    ? `<img class="av ${g ? "g" : ""}" src="${e.foto}" alt="Foto de ${esc(e.nome)}">`
    : `<div class="av ${g ? "g" : ""}" aria-hidden="true">${esc(
        e.nome
          .split(" ")
          .map((p) => p[0])
          .slice(0, 2)
          .join(""),
      )}</div>`;
const nota = (e) => {
  const m = media(e);
  return m.n
    ? `★ ${m.media.toFixed(1).replace(".", ",")} <small>(${m.n} avaliações)</small>`
    : "★ Novo na plataforma";
};
const local = (e) =>
  [...e.regioes.map((r) => "Região " + r), ...e.bairros].join(", ") || "—";
function card(e, servico) {
  const valores = mediaValores(e, servico),
    tituloMedia = servico
      ? `Média de ${esc(servico)}`
      : "Média geral de valores";
  return `<article class="card"><div class="head">${avatar(e)}<div><h3 style="margin:0">${esc(e.nome)}</h3><p class="stars">${nota(e)}</p></div></div>
<div class="chips">${e.esp
    .slice(0, 3)
    .map((s) => `<span>${esc(s)}</span>`)
    .join(
      "",
    )}</div><p class="mut">📍 ${esc(local(e))}</p><p class="price">${tituloMedia}: ${valores.media === null ? "Sem histórico" : `${moeda(valores.media)} (${valores.quantidade} atendimentos)`}</p>
<div class="acoes"><a class="btn ghost peq" style="color:var(--azul)" href="perfil.html?id=${e.id}">Ver perfil</a><a class="btn peq" href="perfil.html?id=${e.id}#orcamento">Solicitar orçamento</a></div></article>`;
}

function listaInit() {
  const f = Object.fromEntries(
    ["q", "regiao", "bairro", "esp", "nota", "media", "ordem"].map((i) => [
      i,
      $("#" + i),
    ]),
  );
  f.q.value = new URLSearchParams(location.search).get("q") || "";
  f.regiao.innerHTML =
    '<option value="">Todas as regiões</option>' +
    Object.keys(REGIOES)
      .map((r) => `<option>${r}</option>`)
      .join("");
  f.esp.innerHTML =
    '<option value="">Todas</option>' +
    E.map((s) => `<option>${s}</option>`).join("");
  const bairros = () =>
    (f.bairro.innerHTML =
      '<option value="">Todos os bairros</option>' +
      (f.regiao.value ? REGIOES[f.regiao.value] : TODOS_BAIRROS)
        .map((b) => `<option>${b}</option>`)
        .join(""));
  const render = () => {
    const q = norm(f.q.value.trim());
    const servicoMedia = f.esp.value || undefined;
    const l = eletricistas().filter((e) => {
      const mediaPreco = mediaValores(e, servicoMedia).media;
      return (
        (!q || norm([e.nome, e.desc, ...e.esp].join(" ")).includes(q)) &&
        atende(e, { regiao: f.regiao.value, bairro: f.bairro.value }) &&
        (!f.esp.value || e.esp.includes(f.esp.value)) &&
        media(e).media >= +f.nota.value &&
        (!+f.media.value ||
          (mediaPreco !== null && mediaPreco <= +f.media.value))
      );
    });
    l.sort((a, b) =>
      f.ordem.value === "media"
        ? (mediaValores(a, servicoMedia).media ?? Infinity) -
          (mediaValores(b, servicoMedia).media ?? Infinity)
        : f.ordem.value === "nota"
          ? media(b).media - media(a).media
          : media(b).n - media(a).n,
    );
    $("#contagem").textContent =
      `${l.length} ${l.length === 1 ? "eletricista encontrado" : "eletricistas encontrados"}`;
    $("#lista").innerHTML = l.length
      ? l.map((e) => card(e, servicoMedia)).join("")
      : '<div class="vazio"><p>Nenhum eletricista atende a esses filtros.</p><button class="btn" id="limpar2">Limpar filtros</button></div>';
  };
  const limpar = () => {
    $("#filtros").reset();
    f.q.value = "";
    bairros();
    render();
  };
  bairros();
  render();
  f.regiao.onchange = () => {
    bairros();
    render();
  };
  ["q", "bairro", "esp", "nota", "media", "ordem"].forEach((i) =>
    f[i].addEventListener(i === "q" ? "input" : "change", render),
  );
  $("#limpar").onclick = limpar;
  $("#lista").addEventListener("click", (e) => {
    if (e.target.id === "limpar2") limpar();
  });
  const top = [
    "Instalações elétricas residenciais",
    "Instalação e manutenção de chuveiros",
    "Troca de disjuntores",
    "Instalação de luminárias",
    "Identificação e correção de curtos-circuitos",
    "Quadros de distribuição",
  ];
  $("#categorias").innerHTML = top
    .map((s) => `<button type="button">${s}</button>`)
    .join("");
  $("#categorias").onclick = (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    f.esp.value = b.textContent;
    render();
    $("#resultados").scrollIntoView({ behavior: "smooth" });
  };
}

function perfilInit() {
  const box = $("#perfil"),
    e = eletricistas().find(
      (x) => x.id === new URLSearchParams(location.search).get("id"),
    ),
    u = Auth.user();
  if (!e) {
    box.innerHTML =
      '<div class="vazio" style="margin-top:28px"><p>Profissional não encontrado.</p><a class="btn" href="index.html">Ver eletricistas</a></div>';
    return;
  }
  document.title = e.nome + " — EletroAqui";
  const av = solicitacoes().filter((r) => r.eletId === e.id && r.avaliacao),
    avExemplo = e.email?.endsWith("@demo.invalid")
      ? AVALIACOES_EXEMPLO[e.id] || []
      : [],
    valoresGerais = mediaValores(e),
    valoresPorServico = e.esp
      .map((servico) => {
        const valores = mediaValores(e, servico);
        return `<li>${esc(servico)}: ${valores.media === null ? "sem histórico concluído" : `${moeda(valores.media)} (${valores.quantidadeReal} serviços concluídos)`}</li>`;
      })
      .join(""),
    nr = {
      Sim: "Sim",
      "Em andamento": "Em andamento",
      Não: "Não informado",
    }[e.nr10];
  let form;
  if (!u)
    form = `<p>Para pedir orçamento, <a href="login.html">entre</a> ou <a href="cadastro-cliente.html">cadastre-se como cliente</a>.</p>`;
  else if (u.tipo !== "cliente")
    form =
      '<p class="mut">Somente contas de cliente podem solicitar orçamentos.</p>';
  else {
    const primeiraMedia = e.esp.length ? mediaValores(e, e.esp[0]) : null,
      mediaGeral = mediaValores(e);
    form = `<form id="form-orc" class="form" novalidate><label>Tipo de serviço<select name="servico">${e.esp.map((s) => `<option>${esc(s)}</option>`).join("")}</select></label>
 <p class="referencia-valor" id="referencia-valor">${primeiraMedia?.media === null || !primeiraMedia ? `O prestador enviará o primeiro orçamento após analisar sua solicitação. Ainda não há histórico específico para este serviço.${mediaGeral.media === null ? "" : ` A média geral é ${moeda(mediaGeral.media)} em ${mediaGeral.quantidade} atendimentos.`}` : `O prestador enviará o primeiro orçamento após analisar sua solicitação. Média de ${primeiraMedia.quantidade} serviços concluídos: ${moeda(primeiraMedia.media)}.`}</p>
 <label>Descrição do problema<textarea name="desc" rows="3" required></textarea></label><label>Bairro do serviço<select name="bairro">${TODOS_BAIRROS.map((b) => `<option ${b === u.bairro ? "selected" : ""}>${b}</option>`).join("")}</select></label>
 <label>Endereço ou referência (opcional; só será necessário se o pedido for aceito)<input name="endereco"></label>
 <div class="dois"><label>Data preferida<input type="date" name="data" min="${hoje()}" required></label><label>Período<select name="periodo"><option>Manhã</option><option>Tarde</option><option>Noite</option></select></label></div>
 <label>Fotos (opcional, até 3)<input type="file" name="fotos" accept="image/*" multiple></label><button class="btn">Enviar solicitação</button></form>`;
  }
  box.innerHTML = `<div class="perfil"><div><div class="box"><div class="head">${avatar(e, 1)}<div><h1 style="margin:0;font-size:1.7rem">${esc(e.nome)}</h1><p class="stars">${nota(e)}</p>  <p class="price">Média geral de valores: ${valoresGerais.media === null ? "Sem histórico" : `${moeda(valoresGerais.media)} (${valoresGerais.quantidade} atendimentos)`}</p></div></div>
 <h2 style="margin-top:16px">Sobre</h2><p>${esc(e.desc)}</p><h2>Serviços</h2><div class="chips">${e.esp.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
 <h2 style="margin-top:16px">Média por serviço</h2><ul class="medias-servicos">${valoresPorServico}</ul>
 <h2 style="margin-top:16px">Regiões atendidas</h2><p>📍 ${esc(local(e))}</p><p><strong>Disponibilidade:</strong> ${esc(e.disp)}</p></div>
 <div class="box"><h2>Qualificações</h2><p>Formação ou curso na área: ${esc(e.formacao)}<br>NR-10: ${nr}${e.cert ? "<br>Outras: " + esc(e.cert) : ""}</p></div>
 <div class="box"><h2>Avaliações</h2>${[...avExemplo.map((avaliacao) => `<p>${"★".repeat(avaliacao.nota)} ${esc(avaliacao.comentario)}</p>`), ...av.map((r) => `<p>${"★".repeat(r.avaliacao.nota)} ${esc(r.avaliacao.comentario) || '<span class="mut">Sem comentário</span>'}</p>`)].join("") || '<p class="mut">Ainda não há avaliações.</p>'}</div></div>
 <aside><div class="box" id="orcamento"><h2>Solicitar orçamento</h2>${form}</div></aside></div>`;
  const formOrc = $("#form-orc");
  formOrc?.servico.addEventListener("change", () => {
    const valores = mediaValores(e, formOrc.servico.value),
      mediaGeral = mediaValores(e),
      referencia = $("#referencia-valor");
    referencia.textContent =
      valores.media === null
        ? `O prestador enviará o primeiro orçamento após analisar sua solicitação. Ainda não há histórico específico para este serviço.${mediaGeral.media === null ? "" : ` A média geral é ${moeda(mediaGeral.media)} em ${mediaGeral.quantidade} atendimentos.`}`
        : `O prestador enviará o primeiro orçamento após analisar sua solicitação. Média de ${valores.quantidade} serviços concluídos: ${moeda(valores.media)}.`;
  });
  formOrc?.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const f = ev.target,
      er = [];
    if (f.desc.value.trim().length < 10)
      er.push("Descreva o problema com pelo menos 10 caracteres.");
    if (!f.data.value || f.data.value < hoje())
      er.push("Escolha uma data a partir de hoje.");
    if (f.fotos.files.length > 3) er.push("Anexe no máximo 3 fotos.");
    avisos(f, er);
    if (er.length) return;
    if (
      !atende(e, { bairro: f.bairro.value }) &&
      !confirm(
        "Este profissional não informou atender " +
          f.bairro.value +
          ". Enviar mesmo assim?",
      )
    )
      return;
    if (!confirm("Enviar solicitação para " + e.nome + "?")) return;
    let fotos = [];
    try {
      fotos = await Promise.all([...f.fotos.files].map((x) => lerImagem(x)));
    } catch (x) {
      return avisos(f, [x.message]);
    }
    const rs = solicitacoes();
    rs.push({
      id: "r" + Date.now(),
      clienteId: u.id,
      eletId: e.id,
      servico: f.servico.value,
      desc: f.desc.value.trim(),
      bairro: f.bairro.value,
      endereco: f.endereco.value.trim(),
      data: f.data.value,
      periodo: f.periodo.value,
      status: "Pendente",
      valorAcordado: null,
      criado: Date.now(),
      fotos,
      avaliacao: null,
    });
    try {
      store.set("eg_reqs", rs);
    } catch {
      return avisos(f, ["Armazenamento cheio. Tente sem fotos."]);
    }
    flash("Solicitação enviada! Acompanhe o status aqui.");
    location.href = "solicitacoes.html";
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const p = document.body.dataset.page;
  if (p === "home") listaInit();
  if (p === "perfil") perfilInit();
});
