// Número de WhatsApp da GabiVeda (DDI 55 + DDD 11 + número)
const WHATSAPP_NUMBER = "5511989115258";

// Catálogo editável: basta atualizar nomes, ervas, pesos e preços aqui
const produtos = [
  {
    id: 1,
    nome: "Chá Calmaria Vata",
    categoria: "cha",
    categoriaLabel: "Chá Terapêutico",
    ervas: "Camomila, Erva-Doce, Canela e Gengibre Suave",
    descricao: "Infusão acolhedora que aquece e aquieta a mente agitada, ideal para o fim da tarde.",
    peso: "Pacote 30g",
    preco: 22.00
  },
  {
    id: 2,
    nome: "Chá Frescor Pitta",
    categoria: "cha",
    categoriaLabel: "Chá Terapêutico",
    ervas: "Hortelã, Hibisco, Capim-Limão e Cardamomo",
    descricao: "Blend refrescante e digestivo que equilibra o excesso de calor e traz leveza após as refeições.",
    peso: "Pacote 30g",
    preco: 22.00
  },
  {
    id: 3,
    nome: "Chá Energia Kapha",
    categoria: "cha",
    categoriaLabel: "Chá Terapêutico",
    ervas: "Chá Verde, Gengibre, Cravo e Casca de Laranja",
    descricao: "Combinação aromática e estimulante para despertar a disposição e renovar a vitalidade.",
    peso: "Pacote 30g",
    preco: 24.00
  },
  {
    id: 4,
    nome: "Escalda-Pés Sono Sereno",
    categoria: "escalda-pes",
    categoriaLabel: "Escalda-Pés",
    ervas: "Sal Grosso, Lavanda, Camomila e Melissa",
    descricao: "Ritual relaxante para descarregar a tensão do dia e preparar o corpo para um sono profundo.",
    peso: "Pacote 100g",
    preco: 18.00
  },
  {
    id: 5,
    nome: "Escalda-Pés Pés Leves & Revigorantes",
    categoria: "escalda-pes",
    categoriaLabel: "Escalda-Pés",
    ervas: "Sal Grosso, Alecrim, Hortelã e Anis-Estrelado",
    descricao: "Alivia o cansaço físico, ativa a circulação e renova as energias após dias intensos.",
    peso: "Pacote 100g",
    preco: 18.00
  }
];

let sacola = [];

const productsGrid = document.getElementById("productsGrid");
const cartCount = document.getElementById("cartCount");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function renderizarProdutos(filtro = "todos") {
  const filtrados = filtro === "todos"
    ? produtos
    : produtos.filter(p => p.categoria === filtro);

  productsGrid.innerHTML = filtrados.map(produto => `
    <article class="product-card">
      <div>
        <span class="product-tag">${produto.categoriaLabel}</span>
        <h3 class="product-title">${produto.nome}</h3>
        <p class="product-herbs">🌿 ${produto.ervas}</p>
        <p class="product-desc">${produto.descricao}</p>
      </div>
      <div class="product-bottom">
        <div class="product-price">
          ${formatarMoeda(produto.preco)}
          <span class="product-weight">${produto.peso}</span>
        </div>
        <button class="add-btn" onclick="adicionarNaSacola(${produto.id})">+ Adicionar</button>
      </div>
    </article>
  `).join("");
}

function adicionarNaSacola(id) {
  const itemExistente = sacola.find(item => item.id === id);
  if (itemExistente) {
    itemExistente.qtd += 1;
  } else {
    const produto = produtos.find(p => p.id === id);
    sacola.push({ ...produto, qtd: 1 });
  }
  atualizarSacola();
  abrirSacola();
}

function alterarQuantidade(id, delta) {
  const item = sacola.find(i => i.id === id);
  if (!item) return;

  item.qtd += delta;
  if (item.qtd <= 0) {
    sacola = sacola.filter(i => i.id !== id);
  }
  atualizarSacola();
}

function atualizarSacola() {
  const totalItens = sacola.reduce((acc, item) => acc + item.qtd, 0);
  const valorTotal = sacola.reduce((acc, item) => acc + (item.preco * item.qtd), 0);

  cartCount.textContent = totalItens;
  cartTotalEl.textContent = formatarMoeda(valorTotal);

  if (sacola.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-cart">Sua sacola está vazia. Adicione um chá ou escalda-pés!</p>`;
    return;
  }

  cartItemsContainer.innerHTML = sacola.map(item => `
    <div class="cart-item-row">
      <div class="cart-item-info">
        <strong>${item.nome}</strong>
        <span>${formatarMoeda(item.preco)} cada</span>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="alterarQuantidade(${item.id}, -1)">-</button>
        <span>${item.qtd}</span>
        <button class="qty-btn" onclick="alterarQuantidade(${item.id}, 1)">+</button>
      </div>
    </div>
  `).join("");
}

function abrirSacola() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
}

function fecharSacola() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
}

// Filtros
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderizarProdutos(btn.dataset.filter);
  });
});

// Eventos da Sacola
document.getElementById("openCartBtn").addEventListener("click", abrirSacola);
document.getElementById("closeCartBtn").addEventListener("click", fecharSacola);
cartOverlay.addEventListener("click", fecharSacola);

// Finalizar pedido no WhatsApp
document.getElementById("checkoutWhatsappBtn").addEventListener("click", () => {
  if (sacola.length === 0) {
    alert("Adicione pelo menos um produto na sacola antes de enviar o pedido.");
    return;
  }

  const nomeCliente = document.getElementById("customerName").value.trim();
  const saudacao = nomeCliente ? `Olá Gabi! Meu nome é *${nomeCliente}* e` : `Olá Gabi!`;

  const listaItens = sacola.map(item =>
    `• ${item.qtd}x ${item.nome} (${formatarMoeda(item.preco * item.qtd)})`
  ).join("\n");

  const total = sacola.reduce((acc, item) => acc + (item.preco * item.qtd), 0);

  const mensagem = `${saudacao} gostaria de fazer um pedido pelo site da *GabiVeda*:\n\n${listaItens}\n\n*Total estimado:* ${formatarMoeda(total)}\n\nComo podemos combinar o pagamento e a entrega?`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
});

// Inicialização
renderizarProdutos();
