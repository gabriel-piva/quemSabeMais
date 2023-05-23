// --------------------------------------------------------------------------

import { Character } from "./character.js";
import { getCharactersData } from "./data.js";
import { getRecordScore, setRecordScore, scrollToTop } from "./utils.js";

// --------------------------------------------------------------------------

// Get the Characters List

let charactersList: Character[];

async function loadCharactersList():Promise<void> {
    charactersList = await getCharactersData();
}

// --------------------------------------------------------------------------

// Set the Target Character

let targetCharacter: Character;
let characterDefined: boolean = false;

function getRandomCharacter():Character {
    const random: number = Math.floor(Math.random() * charactersList.length);
    const character: Character = charactersList[random];
    charactersList.splice(random, 1);
    return character;
}
function setTargetCharacter():void {
    targetCharacter = getRandomCharacter();
    characterDefined = true;
}

// --------------------------------------------------------------------------

// Tips Interaction

const tips: NodeListOf<HTMLDivElement> = document.querySelectorAll(".tip")!;
let tipsAccessed: number = -1;

function showTip(tip:HTMLDivElement, index:number):void {
    if(tip.classList.contains('accessed') || tip.classList.contains('revealed') || !characterDefined) return;
    tip.innerText = targetCharacter.tips[index];
    tip.classList.add('accessed');
    tipsAccessed++;
}

// --------------------------------------------------------------------------

// Send Attempt

const inputAttempt: HTMLInputElement = document.querySelector("#inputCharacterAttempt")!;
const btnNextCharacter: HTMLButtonElement = document.querySelector('#btnNext')!;

function normalizeString(str: string):string {
    return str.toLowerCase().replace(/\s/g, '');
}
function checkAttempt(attempt: string):boolean {
    const normAttempt = normalizeString(attempt);
    const normVariations = targetCharacter.nameVariations.map(normalizeString);
    return normVariations.includes(normAttempt);
} 
function sendAttempt():void {
    const attempt = inputAttempt.value;
    if (attempt.length > 0 && tipsAccessed > -1) {
        btnNextCharacter.disabled = false;
        showCharacter();
        scrollToTop();
        if (checkAttempt(attempt)) {
            modalWin();
            updateScore();
        } else {
            modalLose();
        }
        tipsAccessed = -1;
        characterDefined = false;
    }
}
function handleKeydown(e: KeyboardEvent):void {
    if(e.key == "Enter") sendAttempt();
}

// --------------------------------------------------------------------------

// Score

const scoreElement: HTMLSpanElement = document.querySelector('#score')!;
let score: number = 0;

function updateScore():void {
    score += 5 - tipsAccessed;
    if (score === 1) {
        scoreElement.innerHTML = "1 ponto";
    } else {
        scoreElement.innerHTML = `${score} pontos`;
    }
    const maxScore = getRecordScore();
    if (maxScore !== null && score > maxScore) {
        console.log("Entrou");
        setRecordScore(score);
    }
}

// --------------------------------------------------------------------------

// Show Character

const characterName: HTMLSpanElement = document.querySelector("#characterName")!;
const characterImage: HTMLDivElement = document.querySelector("#characterImage")!;
const btnVideo: HTMLButtonElement = document.querySelector('#btnVideo')!;

function showCharacter():void {
    tips.forEach((tip, index) => {
        tip.innerText = targetCharacter.tips[index];
        if(!tip.classList.contains('accessed')) {
            tip.classList.add('revealed');
        }
    })
    characterImage.innerHTML = "";
    characterImage.style.backgroundImage = `url(${targetCharacter.image})`;
    characterName.innerHTML = targetCharacter.name;
    btnVideo.setAttribute('href', targetCharacter.video);
}
function restartArea():void {
    tips.forEach((tip, index) => {
        tip.innerText = `Dica ${index + 1}`;
        tip.classList.remove('revealed');
        tip.classList.remove('accessed');
    });
    characterImage.innerHTML = "<i class='bx bx-question-mark'></i>";
    characterImage.style.backgroundImage = "";
    characterName.innerHTML = "";
    btnVideo.removeAttribute("href");
    scrollToTop();
}

// --------------------------------------------------------------------------

// Modals

const modal: HTMLDivElement = document.querySelector('.modal')!;
const modalContainer: HTMLDivElement = document.querySelector('.modalContainer')!;
const modalContent: HTMLDivElement = document.querySelector('.modalContent')!;

// Open & Close Modal
function openModal():void {
    modal.classList.add('active');
    modalContainer.classList.add('active');
}
function closeModal():void {
    modal.classList.remove('active');
    modalContainer.className = modalContainer.classList[0];
    modalContent.innerHTML = '';
}

// Modal Win
function modalWin():void {
    openModal();
    modalContent.innerHTML = `
        <span>Parabéns, você acertou! Nenhuma bola curva aqui.</span>
        <img src="assets/images/modalWin.gif">
    `;
}
// Modal Lose
function modalLose():void {
    openModal();
    modalContent.innerHTML = `
        <span>Essa foi bola curva, não foi dessa vez. Na próxima você acerta.</span>
        <img src="assets/images/modalLose.gif">
    `;
}
// Modal End Game
function modalEndGame():void {
    openModal();
    modalContainer.classList.add('modalEndGame');
    modalContent.innerHTML = `
        <span>Você finalizou o jogo, muito obrigado. Jogue novamente!</span>
        <img src="assets/images/modalEndGame.gif">
    `;
}
// Modal Stats
function modalStats():void {
    openModal();
    modalContainer.classList.add('modalStats');
    modalContent.innerHTML = `
        <span>Maior Pontuação Alcançada: </span>
        <span class="maxScore">
            ${getRecordScore()} pontos
        </span>
        <img src="assets/images/modalRecord.gif">
    `;
}
// Modal About
function modalAbout():void {
    openModal();
    modalContainer.classList.add('modalAbout');
    modalContent.innerHTML = `
        <span>
            O objetivo é adivinhar um personagem ou personalidade, através de dicas.
            Quanto mais dicas acessadas, menos pontos são recebidos.
            Clique nas dicas e tente acertar.
            O jogo é inspirado pelo quadro do canal 
            <a target="_blank" href="https://www.youtube.com/c/cadeachave" class="ytLink"> 
                Cadê a Chave?
            </a> chamado 
            <a target="_blank" href="https://youtube.com/playlist?list=PLZ1moeoh2N0O7fLnOHcJ-8VLI5Zhh9q1a" class="ytLink">
                Quem Sabe Mais?
            </a> sendo todos os personagens e dicas vindos dos espisódios. 
        </span>
        <img src="assets/images/modalAbout.gif" alt="">
        <span>
            Ao adivinhar um personagem, é possível ver em qual vídeo ele apareceu e jogar novamente, somando os pontos a cada rodada. 
        </span>
    `;
}

// --------------------------------------------------------------------------

// Start and Setup Game

function setupGame():void {
    if(charactersList.length > 0) {
        setTargetCharacter();
        tips.forEach((tip, index) => tip.addEventListener('click', () => showTip(tip, index)));
        btnNextCharacter.disabled = true;
        inputAttempt.value = "";
        restartArea();
    } else {
        modalEndGame();
    }
}
function verifyFirstAccess():void {
    if(getRecordScore() == null) {
        setRecordScore(0);
        modalAbout();
    }
}
async function startGame():Promise<void> {
    await loadCharactersList();
    verifyFirstAccess();
    setupGame();
}

// --------------------------------------------------------------------------

// Events

window.onload = startGame;
btnNextCharacter.addEventListener("click", setupGame);
document.addEventListener("keydown", handleKeydown);
document.querySelector("#btnSendAttempt")!.addEventListener("click", sendAttempt);
document.querySelector('#btnReset')!.addEventListener("click", () => location.reload());
document.querySelector('#btnAbout')!.addEventListener('click', modalAbout);
document.querySelector('#btnStats')!.addEventListener('click', modalStats);
document.querySelector('#btnCloseModal')!.addEventListener('click', closeModal);
modal.addEventListener('click', (e: MouseEvent) => e.target == modal && closeModal());

// --------------------------------------------------------------------------