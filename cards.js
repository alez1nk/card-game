//just normal varable declarations
const cardNumbers = ['ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king'];
const suiteNames = [ 'spades', 'clubs', 'diamonds', 'hearts']
let firstCard;
let secondCard;
const deck = [];
let middleCards = [];
let userCards = [];
let middleCardPicked = false;

let pickedCard = null;
let pickedElement = null;

//define get elements by id stuff
const imageElement1 = document.getElementById('card1');
const imageElement2 = document.getElementById('card2');
const cardHolder = document.getElementById('cardHolder');
const cardAmount = document.getElementById('amountInput');
const userHand = document.getElementById('userHand');

const updater = document.getElementById('fakeConsoleLog');

//function to generate 0-51
function genRandom(index) {
    const r = Math.floor(Math.random() * index);
    return r;
}

//function to translate face cards into numerical values
function getValue(card) {
    if (Number.isInteger(card) === true) {
        return card;
    } else if (card === 'ace') {
        return 1;
    } else if (card === 'jack') {
        return 11;
    } else if (card === 'queen') {
        return 12;
    } else if (card === 'king') {
        return 13;
    }
}

//generate deck of cards with objects

class suite {
    constructor(number, suite) {
        this.number = number,
        this.suite = suite,
        this.value = getValue(number);
    }
}
//iterate over each suit
for (let i=0; i<4; i++) {
    deck.push(...cardNumbers.map((cardNumber) => new suite(cardNumber, suiteNames[i])));
}

//set alterable deck in case of necesity of og deck
let cardDeck = [...deck];

//onClick stuff
function updateCompare(first, second) {
    const comparer = document.getElementById('compare');

    if(first === second) {
        comparer.textContent = 'Cards are Equal';
    } else if(first > second) {
        comparer.textContent = 'First Card is Higher';
    } else if(second > first) {
        comparer.textContent = 'Second Card is Higher';
    }
}


//create the images of cards through 
function createCardImage(hand, card, index) {
    const newCard = document.createElement('img');

    newCard.src = `images/png/${card.number}_of_${card.suite}.png`

    //newCard.addEventListener('click', () => addToHand(userHand, newCard, card));
    newCard.addEventListener('click', () => exchangeCards(newCard));

    newCard.id = `${index}`;

    //console.log(`Getting Images for ${card.number} of ${card.suite}`);

    hand.appendChild(newCard);
}

function drawNCards(hand) {
    hand.innerHTML = '';
    // amount = parseInt(cardAmount.value || 1);
    amount = 4;

    //run through for each amoutn picked
    for(let i=0; i<amount; i++) {
        const randIndex = genRandom(cardDeck.length);
        const chosenCard = cardDeck[randIndex];
        const chosenArray = hand === cardHolder ? middleCards : userCards;

        chosenArray.push(chosenCard);


        //remove card
        cardDeck.splice(randIndex, 1);
        createCardImage(hand, chosenCard, i);
    }
    //console.log(`${cardDeck.length} Cards Left`);
    //console.log(cardDeck);
    hand === cardHolder ? console.log(middleCards) : console.log(userCards);
}

function addToHand(hand, element, card) {
    //remove element from middle
    element.remove();

    //add something to remove card from respective array

    const movedImage = document.createElement('img');

    movedImage.src = `images/png/${card.number}_of_${card.suite}.png`

    hand.appendChild(movedImage);
}



function exchangeCards(element) {
    //create var to store var later
    let switchedCard = null;
    //dont pick anything if card alr pickeed or not picke dyet
    if(element.parentNode === userHand && middleCardPicked === false) {
        return console.log('pick middle first idot')
    }

    if(middleCardPicked === true && element.parentNode === cardHolder) {
        return (console.log('card alr picked dummy'))
    }

    //check if card clicked is from user and middle clicked
    if(middleCardPicked === true && element.parentNode === userHand) {
        switchedCard = parseInt(element.id);
        //switch the elements
        console.log(`second pick: ${userCards[switchedCard].number} of ${userCards[switchedCard].suite}`)
        console.log(`exchaning ${middleCards[pickedCard].number} of ${middleCards[pickedCard].suite} with ${userCards[switchedCard].number} of ${userCards[switchedCard].suite}`);

        addToHand(userHand, element, userCards[switchedCard]); //add to user hand
        addToHand(cardHolder, pickedElement, middleCards[switchedCard]); //add to middle
    }

    //pick first card
    if(element.parentNode === cardHolder) {
        middleCardPicked = true;
        element.classList.add('picked');
        //log the element picked rq
        pickedCard = parseInt(element.id);
        pickedElement = element;
        console.log(`Card picked: ${middleCards[pickedCard].number} of ${middleCards[pickedCard].suite}`);
    }    
}


function resetCards() {
    cardDeck = [...deck];

    cardHolder.innerHTML = '';
    userHand.innerHTML = '';
}
