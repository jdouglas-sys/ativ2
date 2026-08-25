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

    // Exibe os sabores na tela (Leitura do Array)
    sabores.forEach((sabor, index) => {
        const div = document.createElement("div");
        div.className = "sabor-card";
        div.innerHTML = `
            <h4>${sabor}</h4>
            <button data-sabor="${sabor}">Selecionar</button>
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

    // #3 Função própria com passagem de parâmetro e retorno de valor.
    //item3
    function calcularDescontoTotal(subtotal, qtd) {
        let total = subtotal;
        if (qtd >= 5) {
            total = subtotal * 0.9; // 10% de desconto para 5 ou mais churros
        }
        return total;
    }

    // #7 Uma função acionada por evento de formulário (input) com validação e mensagem.
    const inputQtd = document.getElementById("qtd-churros");
    const msgValidacao = document.getElementById("msg-validacao");

    //item7
    inputQtd.addEventListener("input", () => {
        const valor = parseInt(inputQtd.value);
        if (isNaN(valor) || valor < 1) {
            msgValidacao.innerText = " Digite uma quantidade válida (mínimo 1).";
            msgValidacao.style.color = "red";
        } else {
            msgValidacao.innerText = " Quantidade válida!";
            msgValidacao.style.color = "green";
        }
    });

    // Evento de clique para processar o pedido
    const btnCalcular = document.getElementById("btn-calcular");
    btnCalcular.addEventListener("click", () => {
        const qtd = parseInt(inputQtd.value);
        if (isNaN(qtd) || qtd < 1) return;

        carrinho.atualizarItem(qtd, saborAtual);
        const subtotal = carrinho.calcularSubtotal();
        const totalFinal = calcularDescontoTotal(subtotal, qtd);

        // #1 Operadores (Aritmética, Relacional e Lógica)
        //item1
        const ehCompraGrande = (qtd >= 5);
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

        // #8 Alteração dinâmica da página, criando elementos (createElement e appendChild).
        //item8
        const listaCarrinho = document.getElementById("lista-carrinho");
        const novoItem = document.createElement("li");
        novoItem.innerText = `${qtd}x Churros de ${carrinho.sabor} - Total: R$ ${totalFinal.toFixed(2)}`;
        listaCarrinho.appendChild(novoItem);
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