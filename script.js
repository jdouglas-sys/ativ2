// Espera todo o HTML carregar antes de executar o JavaScript.
// Motivo: isso evita erro ao procurar elementos que ainda nao apareceram na pagina.
document.addEventListener("DOMContentLoaded", () => {
    // Guarda todos os cards de sabores existentes na pagina.
    // Motivo: esses cards possuem os dados de sabor e preco que serao usados no pedido.
    const cardsSabores = document.querySelectorAll(".sabor-card");
    // Guarda a div que contem os cards de sabores.
    // Motivo: o listener de clique sera colocado nela para identificar qual sabor foi escolhido.
    const containerSabores = document.getElementById("lista-sabores");
    // Guarda o campo onde o usuario digita a quantidade de churros.
    // Motivo: a quantidade precisa vir da pagina para validar e calcular o pedido.
    const inputQtd = document.getElementById("qtd-churros");
    // Guarda o campo onde o usuario informa o percentual de desconto.
    // Motivo: o desconto tambem deve vir da pagina, evitando valor fixo no JS.
    const inputDesconto = document.getElementById("percentual-desconto");
    // Guarda o elemento onde aparece a mensagem de validacao da quantidade.
    // Motivo: o usuario precisa receber retorno visual quando digitar um valor valido ou invalido.
    const msgValidacao = document.getElementById("msg-validacao");
    // Guarda o botao que calcula e adiciona o pedido ao carrinho.
    // Motivo: o calculo deve acontecer a partir de uma acao do usuario na pagina.
    const btnCalcular = document.getElementById("btn-calcular");
    // Guarda o botao usado para demonstrar o evento de mouse.
    // Motivo: ele atende o requisito de funcao acionada por evento de mouse.
    const btnHover = document.getElementById("btn-hover");
    // Guarda o paragrafo onde aparece a mensagem do evento de mouse.
    // Motivo: o efeito do evento de mouse precisa ficar visivel para o usuario.
    const msgHover = document.getElementById("msg-hover");
    // Guarda a lista onde os itens do carrinho serao adicionados.
    // Motivo: nela sera demonstrada a criacao dinamica de elementos com JavaScript.
    const listaCarrinho = document.getElementById("lista-carrinho");
    // Guarda o campo onde aparece a informacao sobre desconto.
    // Motivo: esse campo mostra o resultado da regra condicional do desconto.
    const infoDesconto = document.getElementById("info-desconto");
    // Guarda o campo de status geral do pedido.
    // Motivo: ele centraliza mensagens importantes sobre selecao, calculo e pedido salvo.
    const statusChurros = document.getElementById("status-churros");
    // Guarda o span onde aparece o sabor escolhido.
    // Motivo: o sabor selecionado precisa aparecer na tela para comprovar a interacao.
    const spanSabor = document.getElementById("sabor-selecionado");
    // Guarda o span onde aparece o preco unitario escolhido.
    // Motivo: o preco usado no calculo precisa ficar visivel no resumo.
    const spanPreco = document.getElementById("preco-selecionado");
    // Guarda o span onde aparece o valor total do pedido.
    // Motivo: o usuario precisa ver o resultado final do calculo.
    const spanTotal = document.getElementById("valor-total");

    // Cria uma variavel para guardar o sabor selecionado pelo usuario.
    // Motivo: o pedido so pode ser calculado depois que algum sabor for escolhido.
    let saborAtual = "";
    // Cria uma variavel para guardar o preco do sabor selecionado.
    // Motivo: o preco escolhido sera usado depois para calcular o subtotal.
    let precoAtual = 0;
    // Le do HTML a quantidade minima necessaria para ganhar desconto.
    // Motivo: a regra do desconto fica configurada na pagina, e nao fixa no JS.
    const quantidadeMinimaDesconto = Number(inputDesconto.dataset.quantidadeMinima);
    // Le do HTML o maior desconto permitido no campo de desconto.
    // Motivo: o JS valida o desconto usando o limite informado no proprio input.
    const maiorDescontoPermitido = Number(inputDesconto.max);

    // Cria uma funcao auxiliar para mostrar valores com duas casas decimais.
    // Motivo: valores em dinheiro precisam aparecer de forma padronizada.
    function formatarMoeda(valor) {
        // Retorna o numero formatado com duas casas decimais.
        // Motivo: isso deixa o total e o preco parecidos com formato monetario.
        return valor.toFixed(2);
    }

    //item3
    // Cria uma funcao propria que recebe subtotal e desconto como parametros.
    // Motivo: atende o item 3 e separa a regra de calculo em uma funcao reutilizavel.
    function calcularTotalComDesconto(subtotal, valorDesconto) {
        // Retorna o resultado do subtotal menos o valor do desconto.
        // Motivo: esse retorno sera usado para mostrar o total final do pedido.
        return subtotal - valorDesconto;
    }

    //item4
    // Cria um objeto para representar o pedido feito pelo usuario.
    // Motivo: atende o item 4 organizando os dados e comportamentos do pedido em um unico lugar.
    const pedido = {
        // Atributo que guarda o sabor escolhido.
        // Motivo: o pedido precisa saber qual produto foi selecionado.
        sabor: "",
        // Atributo que guarda a quantidade escolhida.
        // Motivo: a quantidade e necessaria para calcular subtotal e carrinho.
        quantidade: 0,
        // Atributo que guarda o preco unitario do sabor escolhido.
        // Motivo: o preco unitario e usado no calculo do subtotal.
        precoUnitario: 0,
        // Metodo que atualiza os atributos do objeto com os dados do pedido.
        // Motivo: isso mostra que o objeto recebe valores vindos da acao do usuario.
        atualizar: function(novoSabor, novaQuantidade, novoPreco) {
            // Salva o novo sabor dentro do objeto.
            // Motivo: o objeto precisa refletir o sabor clicado na pagina.
            this.sabor = novoSabor;
            // Salva a nova quantidade dentro do objeto.
            // Motivo: o objeto precisa refletir a quantidade digitada no formulario.
            this.quantidade = novaQuantidade;
            // Salva o novo preco unitario dentro do objeto.
            // Motivo: o objeto precisa usar o preco lido do card selecionado.
            this.precoUnitario = novoPreco;
        },
        // Metodo que calcula o subtotal do pedido.
        // Motivo: atende o item 4 com um segundo metodo util para o calculo.
        calcularSubtotal: function() {
            // Retorna quantidade multiplicada pelo preco unitario.
            // Motivo: subtotal e a base para calcular desconto e total.
            return this.quantidade * this.precoUnitario;
        }
    };

    //item5
    // Cria um array vazio para armazenar os sabores lidos da pagina.
    // Motivo: atende o item 5 demonstrando escrita em array com dados do HTML.
    const saboresDisponiveis = [];
    // Percorre todos os cards de sabores encontrados no HTML.
    // Motivo: cada card da pagina deve virar um item dentro do array.
    cardsSabores.forEach((card) => {
        // Escreve no array um objeto com nome e preco de cada sabor.
        // Motivo: o push demonstra a operacao de escrita exigida no array.
        saboresDisponiveis.push({
            // Le o nome do sabor que esta no atributo data-sabor do HTML.
            // Motivo: o nome do sabor deve vir da pagina, nao de texto fixo no JS.
            nome: card.dataset.sabor,
            // Le o preco que esta no atributo data-preco do HTML e converte para numero.
            // Motivo: o preco precisa ser numerico para participar dos calculos.
            preco: Number(card.dataset.preco)
        });
    });

    //item5
    // Cria uma funcao para demonstrar a leitura de dados do array.
    // Motivo: alem de escrever no array, o requisito pede leitura de dados.
    function mostrarPrimeiroSaborCadastrado() {
        // Le a primeira posicao do array de sabores.
        // Motivo: isso comprova a leitura usando indice do array.
        const primeiroSabor = saboresDisponiveis[0];
        // Mostra na pagina o primeiro sabor cadastrado no array.
        // Motivo: o recurso precisa produzir efeito visivel para ser avaliado.
        statusChurros.innerText = `Primeiro sabor cadastrado: ${primeiroSabor.nome}.`;
    }

    // Executa a funcao que mostra o primeiro sabor cadastrado.
    // Motivo: sem chamar a funcao, a leitura do array nao apareceria na pagina.
    mostrarPrimeiroSaborCadastrado();

    //item9
    // Le do LocalStorage o ultimo pedido salvo anteriormente.
    // Motivo: atende a parte de leitura do LocalStorage exigida no item 9.
    const ultimoPedidoSalvo = localStorage.getItem("ultimoPedidoChurros");
    // Verifica se existe algum pedido salvo no navegador.
    // Motivo: isso evita tentar converter um valor inexistente.
    if (ultimoPedidoSalvo) {
        // Converte o texto salvo no LocalStorage de volta para objeto.
        // Motivo: o LocalStorage salva texto, entao e preciso recuperar o formato de objeto.
        const pedidoSalvo = JSON.parse(ultimoPedidoSalvo);
        // Mostra na pagina o sabor salvo.
        // Motivo: o usuario consegue ver que a informacao foi recuperada.
        spanSabor.innerText = pedidoSalvo.sabor;
        // Mostra na pagina o preco unitario salvo.
        // Motivo: o resumo fica consistente com o pedido recuperado.
        spanPreco.innerText = formatarMoeda(pedidoSalvo.precoUnitario);
        // Mostra na pagina o total salvo.
        // Motivo: o resultado salvo tambem precisa ser visivel.
        spanTotal.innerText = formatarMoeda(pedidoSalvo.total);
        // Mostra no status uma mensagem com o ultimo pedido recuperado.
        // Motivo: deixa claro para o avaliador que houve leitura do LocalStorage.
        statusChurros.innerText = `Ultimo pedido salvo: ${pedidoSalvo.quantidade}x ${pedidoSalvo.sabor}.`;
    }

    // Adiciona um listener de clique na area dos sabores.
    // Motivo: a escolha do sabor precisa acontecer por acao do usuario na pagina.
    containerSabores.addEventListener("click", (evento) => {
        // Se o clique nao foi em um botao, a funcao para aqui.
        // Motivo: isso impede que cliques em textos ou areas vazias selecionem sabor por engano.
        if (evento.target.tagName !== "BUTTON") {
            // Encerra a funcao sem selecionar sabor.
            // Motivo: evita continuar o codigo quando nao existe botao de sabor clicado.
            return;
        }

        // Encontra o card de sabor mais proximo do botao clicado.
        // Motivo: o card contem os atributos data-sabor e data-preco do sabor escolhido.
        const cardSelecionado = evento.target.closest(".sabor-card");
        // Le do HTML o nome do sabor selecionado.
        // Motivo: o sabor usado no pedido vem da pagina.
        saborAtual = cardSelecionado.dataset.sabor;
        // Le do HTML o preco do sabor selecionado e converte para numero.
        // Motivo: o preco usado no calculo tambem vem da pagina.
        precoAtual = Number(cardSelecionado.dataset.preco);

        // Remove o destaque visual de todos os cards.
        // Motivo: apenas o sabor atualmente escolhido deve ficar destacado.
        cardsSabores.forEach((card) => card.classList.remove("selecionado"));
        // Adiciona destaque visual ao card selecionado.
        // Motivo: o usuario precisa perceber qual sabor esta ativo.
        cardSelecionado.classList.add("selecionado");

        // Mostra na pagina o sabor selecionado.
        // Motivo: confirma visualmente o valor que sera usado no pedido.
        spanSabor.innerText = saborAtual;
        // Mostra na pagina o preco selecionado.
        // Motivo: confirma visualmente o preco que sera usado no calculo.
        spanPreco.innerText = formatarMoeda(precoAtual);
        // Atualiza o status informando qual sabor foi escolhido.
        // Motivo: ajuda o usuario a acompanhar a acao feita.
        statusChurros.innerText = `Sabor selecionado: ${saborAtual}.`;
    });

    //item7
    // Adiciona um listener de formulario do tipo input no campo de quantidade.
    // Motivo: atende o item 7 e valida o valor enquanto o usuario digita.
    inputQtd.addEventListener("input", () => {
        // Le o valor digitado no campo de quantidade e converte para numero.
        // Motivo: a validacao numerica precisa trabalhar com numero, nao com texto.
        const quantidadeDigitada = Number(inputQtd.value);

        // Verifica se a quantidade nao e inteira ou se e menor que 1.
        // Motivo: o pedido so deve aceitar quantidade inteira positiva.
        if (!Number.isInteger(quantidadeDigitada) || quantidadeDigitada < 1) {
            // Mostra uma mensagem de erro para o usuario.
            // Motivo: o requisito pede validacao com mensagem de retorno.
            msgValidacao.innerText = "Digite uma quantidade inteira maior ou igual a 1.";
            // Deixa a mensagem vermelha para indicar erro.
            // Motivo: a cor ajuda o usuario a identificar que precisa corrigir o campo.
            msgValidacao.style.color = "red";
        } else {
            // Mostra uma mensagem de sucesso para o usuario.
            // Motivo: confirma que o valor digitado pode ser usado no calculo.
            msgValidacao.innerText = `Quantidade valida: ${quantidadeDigitada} churro(s).`;
            // Deixa a mensagem verde para indicar valor valido.
            // Motivo: a cor reforca visualmente que a entrada esta correta.
            msgValidacao.style.color = "green";
        }
    });

    // Adiciona um listener de clique no botao de calcular.
    // Motivo: o calculo e a criacao do carrinho devem acontecer apos uma acao do usuario.
    btnCalcular.addEventListener("click", () => {
        // Le a quantidade digitada pelo usuario e converte para numero.
        // Motivo: essa quantidade sera usada no objeto, no subtotal e nas validacoes.
        const quantidade = Number(inputQtd.value);
        // Le o percentual de desconto digitado pelo usuario e converte para numero.
        // Motivo: o desconto precisa vir do formulario para evitar regra fixa no JS.
        const percentualDesconto = Number(inputDesconto.value);

        // Verifica se nenhum sabor foi selecionado.
        // Motivo: nao da para calcular um pedido sem saber o sabor e o preco.
        if (!saborAtual) {
            // Mostra uma mensagem pedindo para selecionar um sabor.
            // Motivo: orienta o usuario sobre o que falta fazer.
            statusChurros.innerText = "Selecione um sabor antes de calcular.";
            // Para a funcao para nao calcular pedido incompleto.
            // Motivo: evita adicionar item errado ao carrinho.
            return;
        }

        // Verifica se a quantidade e invalida.
        // Motivo: protege o calculo contra valores vazios, quebrados ou menores que 1.
        if (!Number.isInteger(quantidade) || quantidade < 1) {
            // Mostra uma mensagem pedindo correcao da quantidade.
            // Motivo: o usuario precisa saber por que o calculo nao aconteceu.
            statusChurros.innerText = "Corrija a quantidade antes de calcular.";
            // Para a funcao para nao calcular com quantidade errada.
            // Motivo: evita subtotal e carrinho com dados invalidos.
            return;
        }

        // Atualiza o objeto pedido com sabor, quantidade e preco escolhidos.
        // Motivo: demonstra que o objeto usa valores inseridos ou escolhidos na pagina.
        pedido.atualizar(saborAtual, quantidade, precoAtual);
        // Usa o metodo do objeto para calcular o subtotal.
        // Motivo: demonstra um metodo do objeto funcionando com os atributos atuais.
        const subtotal = pedido.calcularSubtotal();
        //item1
        // Operacao aritmetica: calcula o valor do desconto.
        // Motivo: atende a parte aritmetica do item 1 usando subtotal e percentual da pagina.
        const valorDesconto = subtotal * (percentualDesconto / 100);
        // Operacao aritmetica com funcao: calcula o total com desconto.
        // Motivo: combina o item 1 com a funcao propria do item 3.
        const totalComDesconto = calcularTotalComDesconto(subtotal, valorDesconto);
        // Operacao relacional: verifica se a quantidade atinge o minimo do desconto.
        // Motivo: atende a parte relacional do item 1 comparando valores da pagina.
        const temQuantidadeParaDesconto = quantidade >= quantidadeMinimaDesconto;
        // Operacoes relacionais e logica: verifica se o desconto esta dentro do limite.
        // Motivo: impede desconto zerado, negativo ou acima do limite configurado no HTML.
        const descontoValido = percentualDesconto > 0 && percentualDesconto <= maiorDescontoPermitido;
        // Operacao logica: aplica desconto apenas se as duas condicoes forem verdadeiras.
        // Motivo: atende a parte logica do item 1 usando o operador AND.
        const aplicarDesconto = temQuantidadeParaDesconto && descontoValido;
        // Escolhe o total com desconto ou sem desconto de acordo com a regra.
        // Motivo: define o valor final que sera mostrado ao usuario.
        const total = aplicarDesconto ? totalComDesconto : subtotal;

        //item2
        // Verifica se o desconto deve ser aplicado.
        // Motivo: atende o item 2 usando uma estrutura condicional if/else.
        if (aplicarDesconto) {
            // Mostra na pagina que o desconto foi aplicado.
            // Motivo: o resultado da condicao precisa ter efeito visivel.
            infoDesconto.innerText = `Desconto de ${percentualDesconto}% aplicado.`;
        } else {
            // Mostra na pagina que o pedido nao recebeu desconto.
            // Motivo: o usuario tambem precisa receber retorno quando a condicao e falsa.
            infoDesconto.innerText = "Sem desconto neste pedido.";
        }

        // Mostra na pagina o valor total do pedido.
        // Motivo: torna visivel o resultado calculado pelo JavaScript.
        spanTotal.innerText = formatarMoeda(total);
        // Atualiza o status geral com a quantidade e o sabor calculados.
        // Motivo: resume para o usuario qual pedido acabou de ser processado.
        statusChurros.innerText = `Pedido calculado: ${quantidade}x ${pedido.sabor}.`;

        //item8
        // Cria dinamicamente um item de lista para o carrinho.
        // Motivo: atende o item 8 usando createElement.
        const itemCarrinho = document.createElement("li");
        // Define o texto que aparecera dentro do item criado.
        // Motivo: o novo elemento precisa mostrar os dados reais do pedido.
        itemCarrinho.innerText = `${quantidade}x ${pedido.sabor} - Total: R$ ${formatarMoeda(total)}`;
        // Adiciona o item criado dentro da lista do carrinho.
        // Motivo: atende o item 8 usando appendChild e mostra o elemento na pagina.
        listaCarrinho.appendChild(itemCarrinho);

        //item9
        // Salva no LocalStorage o ultimo pedido feito pelo usuario.
        // Motivo: atende a parte de escrita do LocalStorage exigida no item 9.
        localStorage.setItem("ultimoPedidoChurros", JSON.stringify({
            // Salva o sabor do pedido.
            // Motivo: permite recuperar depois qual sabor foi escolhido.
            sabor: pedido.sabor,
            // Salva a quantidade do pedido.
            // Motivo: permite recuperar depois a quantidade comprada.
            quantidade: pedido.quantidade,
            // Salva o preco unitario do pedido.
            // Motivo: permite recuperar depois o preco usado no calculo.
            precoUnitario: pedido.precoUnitario,
            // Salva o total final do pedido.
            // Motivo: permite recuperar depois o valor final mostrado ao usuario.
            total: total
        }));
    });

    //item6
    // Adiciona um listener para quando o mouse passa sobre o botao de promocao.
    // Motivo: atende o item 6 usando evento de mouse com addEventListener.
    btnHover.addEventListener("mouseover", () => {
        // Le o percentual de desconto digitado pelo usuario.
        // Motivo: a mensagem de promocao acompanha o valor informado no formulario.
        const percentualDesconto = Number(inputDesconto.value);
        // Mostra a mensagem da promocao na pagina.
        // Motivo: o evento de mouse precisa gerar uma alteracao visivel.
        msgHover.innerText = `Promocao do dia: peca ${quantidadeMinimaDesconto} ou mais churros e ganhe ${percentualDesconto}% de desconto.`;
    });

    //item6
    // Adiciona um listener para quando o mouse sai do botao de promocao.
    // Motivo: demonstra outro evento de mouse e limpa o efeito visual anterior.
    btnHover.addEventListener("mouseout", () => {
        // Limpa a mensagem da promocao.
        // Motivo: a mensagem deve aparecer apenas enquanto o mouse esta sobre o botao.
        msgHover.innerText = "";
    });
});
