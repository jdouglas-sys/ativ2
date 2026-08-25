document.addEventListener("DOMContentLoaded", () => {
    // Elementos da pagina usados para ler entradas do usuario e mostrar resultados.
    const cardsSabores = document.querySelectorAll(".sabor-card");
    const containerSabores = document.getElementById("lista-sabores");
    const inputQtd = document.getElementById("qtd-churros");
    const inputDesconto = document.getElementById("percentual-desconto");
    const msgValidacao = document.getElementById("msg-validacao");
    const btnCalcular = document.getElementById("btn-calcular");
    const btnHover = document.getElementById("btn-hover");
    const msgHover = document.getElementById("msg-hover");
    const listaCarrinho = document.getElementById("lista-carrinho");
    const infoDesconto = document.getElementById("info-desconto");
    const statusChurros = document.getElementById("status-churros");
    const spanSabor = document.getElementById("sabor-selecionado");
    const spanPreco = document.getElementById("preco-selecionado");
    const spanTotal = document.getElementById("valor-total");

    // Estado atual do pedido e regras de desconto lidas do HTML.
    let saborAtual = "";
    let precoAtual = 0;
    const quantidadeMinimaDesconto = Number(inputDesconto.dataset.quantidadeMinima);
    const maiorDescontoPermitido = Number(inputDesconto.max);

    // Funcao auxiliar para padronizar os valores exibidos como dinheiro.
    function formatarMoeda(valor) {
        return valor.toFixed(2);
    }

    //item1
    // Operadores aritmeticos, relacionais e logicos usados na regra de desconto.
    function analisarDesconto(subtotal, quantidade, percentualDesconto) {
        const valorDesconto = subtotal * (percentualDesconto / 100);
        const totalComDesconto = calcularTotalComDesconto(subtotal, valorDesconto);
        const temQuantidadeParaDesconto = quantidade >= quantidadeMinimaDesconto;
        const descontoValido = percentualDesconto > 0 && percentualDesconto <= maiorDescontoPermitido;
        const aplicarDesconto = temQuantidadeParaDesconto && descontoValido;
        const total = aplicarDesconto ? totalComDesconto : subtotal;

        return {
            aplicarDesconto: aplicarDesconto,
            total: total
        };
    }

    //item2
    // Condicional que mostra se o desconto foi aplicado ou nao.
    function mostrarResultadoDesconto(aplicarDesconto, percentualDesconto) {
        if (aplicarDesconto) {
            infoDesconto.innerText = `Desconto de ${percentualDesconto}% aplicado.`;
        } else {
            infoDesconto.innerText = "Sem desconto neste pedido.";
        }
    }

    //item3
    // Funcao propria com parametros e retorno para calcular o total com desconto.
    function calcularTotalComDesconto(subtotal, valorDesconto) {
        return subtotal - valorDesconto;
    }

    //item4
    // Objeto que organiza os dados do pedido e os metodos usados no calculo.
    const pedido = {
        sabor: "",
        quantidade: 0,
        precoUnitario: 0,
        atualizar: function(novoSabor, novaQuantidade, novoPreco) {
            this.sabor = novoSabor;
            this.quantidade = novaQuantidade;
            this.precoUnitario = novoPreco;
        },
        calcularSubtotal: function() {
            return this.quantidade * this.precoUnitario;
        }
    };

    //item5
    // Array preenchido com os sabores e precos cadastrados nos cards do HTML.
    const saboresDisponiveis = [];
    cardsSabores.forEach((card) => {
        saboresDisponiveis.push({
            nome: card.dataset.sabor,
            preco: Number(card.dataset.preco)
        });
    });

    //item5
    // Le uma posicao do array e mostra o resultado na pagina.
    function mostrarPrimeiroSaborCadastrado() {
        const primeiroSabor = saboresDisponiveis[0];
        statusChurros.innerText = `Primeiro sabor cadastrado: ${primeiroSabor.nome}.`;
    }

    //item6
    // Eventos de mouse que mostram e limpam a promocao no rodape.
    btnHover.addEventListener("mouseover", () => {
        const percentualDesconto = Number(inputDesconto.value);
        msgHover.innerText = `Promocao do dia: peca ${quantidadeMinimaDesconto} ou mais churros e ganhe ${percentualDesconto}% de desconto.`;
    });

    btnHover.addEventListener("mouseout", () => {
        msgHover.innerText = "";
    });

    //item7
    // Listener de formulario que valida a quantidade digitada e retorna mensagem ao usuario.
    inputQtd.addEventListener("input", () => {
        const quantidadeDigitada = Number(inputQtd.value);

        if (!Number.isInteger(quantidadeDigitada) || quantidadeDigitada < 1) {
            msgValidacao.innerText = "Digite uma quantidade inteira maior ou igual a 1.";
            msgValidacao.style.color = "red";
        } else {
            msgValidacao.innerText = `Quantidade valida: ${quantidadeDigitada} churro(s).`;
            msgValidacao.style.color = "green";
        }
    });

    //item8
    // Criacao dinamica de um item no carrinho usando createElement e appendChild.
    function adicionarItemAoCarrinho(quantidade, sabor, total) {
        const itemCarrinho = document.createElement("li");
        itemCarrinho.innerText = `${quantidade}x ${sabor} - Total: R$ ${formatarMoeda(total)}`;
        listaCarrinho.appendChild(itemCarrinho);
    }

    //item9
    // Funcoes que salvam e recuperam o ultimo pedido usando LocalStorage.
    function salvarUltimoPedido(total) {
        localStorage.setItem("ultimoPedidoChurros", JSON.stringify({
            sabor: pedido.sabor,
            quantidade: pedido.quantidade,
            precoUnitario: pedido.precoUnitario,
            total: total
        }));
    }

    function recuperarUltimoPedido() {
        const ultimoPedidoSalvo = localStorage.getItem("ultimoPedidoChurros");

        if (ultimoPedidoSalvo) {
            const pedidoSalvo = JSON.parse(ultimoPedidoSalvo);
            spanSabor.innerText = pedidoSalvo.sabor;
            spanPreco.innerText = formatarMoeda(pedidoSalvo.precoUnitario);
            spanTotal.innerText = formatarMoeda(pedidoSalvo.total);
            statusChurros.innerText = `Ultimo pedido salvo: ${pedidoSalvo.quantidade}x ${pedidoSalvo.sabor}.`;
        }
    }

    // Eventos de apoio que conectam as acoes da pagina aos itens implementados acima.
    mostrarPrimeiroSaborCadastrado();
    recuperarUltimoPedido();

    containerSabores.addEventListener("click", (evento) => {
        if (evento.target.tagName !== "BUTTON") {
            return;
        }

        const cardSelecionado = evento.target.closest(".sabor-card");
        saborAtual = cardSelecionado.dataset.sabor;
        precoAtual = Number(cardSelecionado.dataset.preco);

        cardsSabores.forEach((card) => card.classList.remove("selecionado"));
        cardSelecionado.classList.add("selecionado");

        spanSabor.innerText = saborAtual;
        spanPreco.innerText = formatarMoeda(precoAtual);
        statusChurros.innerText = `Sabor selecionado: ${saborAtual}.`;
    });

    btnCalcular.addEventListener("click", () => {
        const quantidade = Number(inputQtd.value);
        const percentualDesconto = Number(inputDesconto.value);

        if (!saborAtual) {
            statusChurros.innerText = "Selecione um sabor antes de calcular.";
            return;
        }

        if (!Number.isInteger(quantidade) || quantidade < 1) {
            statusChurros.innerText = "Corrija a quantidade antes de calcular.";
            return;
        }

        pedido.atualizar(saborAtual, quantidade, precoAtual);
        const subtotal = pedido.calcularSubtotal();
        const resultadoDesconto = analisarDesconto(subtotal, quantidade, percentualDesconto);

        mostrarResultadoDesconto(resultadoDesconto.aplicarDesconto, percentualDesconto);
        spanTotal.innerText = formatarMoeda(resultadoDesconto.total);
        statusChurros.innerText = `Pedido calculado: ${quantidade}x ${pedido.sabor}.`;

        adicionarItemAoCarrinho(quantidade, pedido.sabor, resultadoDesconto.total);
        salvarUltimoPedido(resultadoDesconto.total);
    });
});
