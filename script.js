document.addEventListener("DOMContentLoaded", () => {
    // #5 Array, com ao menos operação de escrita e leitura de dados.
    //item5
    const sabores = [];
    sabores.push("Chocolate");
    sabores.push("Doce de leite");
    sabores.push("Chocolate branco");
    sabores.push("Leite condensado");

    const containerSabores = document.getElementById("lista-sabores");
    let saborAtual = sabores[0];
    let eRetirada = false;

    // Guarda todos os itens adicionados no carrinho para cálculo acumulativo
    let itensCarrinho = [];

    // #4 Objeto com ao menos 3 atributos e dois métodos.
    //item4
    const carrinho = {
        precoUnitario: 6.0,
        quantidade: 0,
        sabor: "",
        calcularSubtotal: function() {
            return this.precoUnitario * this.quantidade;
        },
        atualizarItem: function(qtd, novoSabor) {
            this.quantidade = qtd;
            this.sabor = novoSabor;
        }
    };

    // Exibe os sabores na tela (Leitura do Array) com o preço do produto discriminado
    sabores.forEach((sabor) => {
        const div = document.createElement("div");
        div.className = "sabor-card";
        div.innerHTML = `
            <h4>${sabor}</h4>
            <p class="preco-unitario">R$ ${carrinho.precoUnitario.toFixed(2)} / un</p>
            <button class="btn-card" data-sabor="${sabor}">Selecionar</button>
        `;
        containerSabores.appendChild(div);
    });

    // Seleciona sabor via clique
    containerSabores.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            saborAtual = e.target.getAttribute("data-sabor");
            document.getElementById("sabor-selecionado").innerText = saborAtual;
            
            // #9 Utilize o LocalStorage ou SessionStorage para armazenar e ler alguma informação.
            //item9
            localStorage.setItem("ultimoSabor", saborAtual);
        }
    });

    // Recupera valor salvo no LocalStorage se existir
    //item9
    const saborSalvo = localStorage.getItem("ultimoSabor");
    if (saborSalvo) {
        saborAtual = saborSalvo;
        document.getElementById("sabor-selecionado").innerText = saborSalvo;
    }

    // Botão de Retirada de Pedido
    const btnRetirada = document.getElementById("btn-retirada");
    const spanTipoEntrega = document.getElementById("tipo-entrega");

    btnRetirada.addEventListener("click", () => {
        eRetirada = !eRetirada;
        if (eRetirada) {
            btnRetirada.classList.add("ativo");
            btnRetirada.innerText = "✓ Retirada Selecionada";
            spanTipoEntrega.innerText = "Retirada no Balcão";
        } else {
            btnRetirada.classList.remove("ativo");
            btnRetirada.innerText = "Retirada na Loja";
            spanTipoEntrega.innerText = "Entrega Padrão";
        }
    });

    // #3 Função própria com passagem de parâmetro e retorno de valor.
    //item3
    function calcularDescontoTotal(subtotal, qtd) {
        let total = subtotal;
        if (qtd >= 5) {
            total = subtotal * 0.9; // 10% de desconto para 5 ou mais churros no total
        }
        return total;
    }

    // Recalcula totais e atualiza tela
    function recalcularCarrinho() {
        const totalQtd = itensCarrinho.reduce((acc, item) => acc + item.qtd, 0);
        const subtotal = totalQtd * carrinho.precoUnitario;
        const totalFinal = calcularDescontoTotal(subtotal, totalQtd);

        // #1 Operadores (Aritmética, Relacional e Lógica)
        //item1
        const ehCompraGrande = (totalQtd >= 5);
        const temDesconto = (subtotal > totalFinal);
        const ganhouPromocao = ehCompraGrande && temDesconto; // Operação Lógica (AND), Relacional e Aritmética

        // #2 Estrutura condicional (if/else)
        //item2
        const infoDesconto = document.getElementById("info-desconto");
        if (ganhouPromocao) {
            infoDesconto.innerText = "Você ganhou 10% de desconto por pedir 5 ou mais churros!";
        } else {
            infoDesconto.innerText = "Adicione 5 ou mais churros para ganhar 10% de desconto.";
        }

        document.getElementById("valor-total").innerText = totalFinal.toFixed(2);
    }

    // #7 Uma função acionada por evento de formulário (input) com validação e mensagem.
    const inputQtd = document.getElementById("qtd-churros");
    const msgValidacao = document.getElementById("msg-validacao");

    //item7
    inputQtd.addEventListener("input", () => {
        const valor = parseInt(inputQtd.value);
        if (isNaN(valor) || valor < 1) {
            msgValidacao.innerText = "Digite uma quantidade válida (mínimo 1).";
            msgValidacao.style.color = "#d32f2f";
        } else {
            msgValidacao.innerText = "Quantidade válida!";
            msgValidacao.style.color = "#388e3c";
        }
    });

    // Evento de clique para processar e adicionar o pedido
    const btnCalcular = document.getElementById("btn-calcular");
    btnCalcular.addEventListener("click", () => {
        const qtd = parseInt(inputQtd.value);
        if (isNaN(qtd) || qtd < 1) return;

        carrinho.atualizarItem(qtd, saborAtual);
        const subtotalItem = carrinho.calcularSubtotal();

        const novoItemData = {
            id: Date.now(),
            qtd: qtd,
            sabor: carrinho.sabor,
            subtotal: subtotalItem,
            modoEntrega: eRetirada ? "[Retirada]" : "[Entrega]"
        };

        itensCarrinho.push(novoItemData);

        // #8 Alteração dinâmica da página, criando elementos (createElement e appendChild).
        //item8
        const listaCarrinho = document.getElementById("lista-carrinho");
        const novoItem = document.createElement("li");
        novoItem.setAttribute("data-id", novoItemData.id);
        
        novoItem.innerHTML = `
            <span>${novoItemData.modoEntrega} ${novoItemData.qtd}x ${novoItemData.sabor} (R$ ${carrinho.precoUnitario.toFixed(2)} un) - R$ ${novoItemData.subtotal.toFixed(2)}</span>
            <button class="btn-remover">Remover</button>
        `;

        listaCarrinho.appendChild(novoItem);
        recalcularCarrinho();
    });

    // #8 Remoção dinâmica de elemento da página (removeChild / remove)
    const listaCarrinho = document.getElementById("lista-carrinho");
    listaCarrinho.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-remover")) {
            const li = e.target.closest("li");
            const idRemover = parseInt(li.getAttribute("data-id"));

            // Remove do array de itens
            itensCarrinho = itensCarrinho.filter(item => item.id !== idRemover);

            // Remove o elemento visual da página
            //item8
            li.remove();

            // Recalcula totais
            recalcularCarrinho();
        }
    });

    // #6 Função acionada por evento de mouse (onmouseover / onmouseout)
    const btnHover = document.getElementById("btn-hover");
    const msgHover = document.getElementById("msg-hover");

    //item6
    btnHover.addEventListener("mouseover", () => {
        msgHover.innerText = "Promoção do dia: Compre 5 churros e ganhe 10% de desconto!";
    });

    //item6
    btnHover.addEventListener("mouseout", () => {
        msgHover.innerText = "";
    });
});