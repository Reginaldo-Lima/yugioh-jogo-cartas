const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
}

// funções de enumeração
const playerSides = {
    player1: "player-cards",
    player1BOX: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBOX: document.querySelector("#computer-cards"),
}
const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1, 6],
        LoseOf:[2, 3],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2, 3],
        LoseOf:[0, 4, 5],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0, 4, 5],
        LoseOf:[1, 6],
    },
    {
        id: 3,
        name: "Mystical Elf",
        type: "Scissors",
        img: `${pathImages}MysticalElf.png`,
        WinOf: [0, 4, 5],
        LoseOf: [1, 6],
    },
    {
        id: 4,
        name: "Baby Dragon",
        type: "Paper",
        img: `${pathImages}BabyDragon.png`,
        WinOf: [1, 6],
        LoseOf: [2, 3],
    },
    {
        id: 5,
        name: "Dark Magician Girl",
        type: "paper",
        img: `${pathImages}DarkMagicianGirl.png`,
        WinOf: [1, 6],
        LoseOf: [2, 3],
    },
    {
        id: 6,
        name: "Red Eyes Black Dragon",
        type: "Rock",
        img: `${pathImages}RedEyesBlackDragon.png`,
        WinOf: [2, 3],
        LoseOf: [0, 4, 5],
    },
]

//retorna um Id aleatório
async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

//cria a img de uma carta
async function creatCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldSide === playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
        });

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }


    return cardImage;
}

//coloca a carta no CardsField
async function setCardsField(cardId) {
    //remove todas as cartas antes
    await removeAllCardsImages();

    //seleciona a carta do computer
    let computerCardId = await getRandomCardId();

    //seta as cartas visualmente
    await showHiddenCardFildsImages(true);

    await hiddenCardsDetails();

    await drawCardsInField(cardId, computerCardId);

    //compara as cartas
    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInField(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

}

//mostra ou esconde as cartas
async function showHiddenCardFildsImages(value) {
    if(value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }

    if(value === false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

//limpar o lado esquerdo da tela
async function hiddenCardsDetails(){
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function drawButton(text){
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

//confere o resultado
async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "DRAW";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "win";
        await playAudio(duelResults);
        state.score.playerScore++;
    }

    if(playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "lose";
        await playAudio(duelResults);
        state.score.computerScore++;
    }

    return duelResults;
}

async function removeAllCardsImages(){
    let cards = playerSides.computerBOX;
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    cards = playerSides.player1BOX;
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    state.cardSprites.avatar.style.width = "0";
    state.cardSprites.avatar.style.height = "0";
}

//desenha a carta selecionada
async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "atribute : " + cardData[index].type;

    state.cardSprites.avatar.style.width = "180px";
    state.cardSprites.avatar.style.height = "250px";

}

//desenhar as cartas aletórias no lado dos players
async function drawCards(cardNumbers, fieldSide) {
    for(let i = 0; i < cardNumbers; i++) {
        const radomIdCard = await getRandomCardId();
        const cardImage = await creatCardImage(radomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

//Reseta o duelo
async function resetDuel() {
    //remove a carta e o button
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    //remove as cartas dos lados dos players
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    //reinicia
    init();
}

//tocar audio
async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

// função inicial
function init(){

    showHiddenCardFildsImages(false);

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();