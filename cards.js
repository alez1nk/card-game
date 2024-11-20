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

//helper function
function normalizeString(str) {
    return String(str).trim().toLowerCase();
}

//reorder images
function reorderImages(hand) {
    const allIds = [0,1,2,3];
    const images = Array.from(hand.children);
    console.log(images);
    //find the idnex without an id
    images.forEach((image) => {
        if(!image.id) {
            noId = image;
            //find out the numbers of the other numbers
            const assignedNums = images.map((image) => {
                if(image.id) {
                    return parseInt(image.id);
                } else {
                    return null;
                }
            }).filter((id) => id !== null);
            //fidn the missing number
            const missingId = allIds.filter((num) => !assignedNums.includes(num));

            noId.id = missingId[0]; //asign no id a id
            images[3] = noId; //assign updated element back
        };
    });
    //sort images array in order of id
    images.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    console.log(images);

    //clear the hand
    hand.innerHTML = '';

    //add images back in order of index
    for(let i=0;i<4;i++) {
        hand.appendChild(images[i]);
    }
}


//create the images of cards through 
function createCardImage(hand, card, index) {
    const newCard = document.createElement('img');

    newCard.src = `images/png/${card.number}_of_${card.suite}.png`

    newCard.dataset.number = card.number;
    newCard.dataset.suite = card.suite;

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
    //hand === cardHolder ? console.log(middleCards) : console.log(userCards);
}

function addToHand(hand, element, card) {
    //remove element from first hand
    element.remove();

    //add something to remove card from respective array

    const movedImage = document.createElement('img');

    movedImage.src = `images/png/${card.number}_of_${card.suite}.png`

    hand.appendChild(movedImage);
}



function exchangeCards(element) {
    //dont pick anything if card alr pickeed or not picke dyet
    if(element.parentNode === userHand && middleCardPicked === false) {
        return console.log('pick middle first idot')
    }

    if(middleCardPicked === true && element.parentNode === cardHolder) {
        return (console.log('card alr picked dummy'))
    }

    const cardNumber = element.dataset.number;
    const cardSuite = element.dataset.suite;


    const switchedCard = userCards.find(card => {
        const cardNumberStr = normalizeString(card.number);
        const cardSuiteStr = normalizeString(card.suite);
        const switchedNumberStr = normalizeString(cardNumber);
        const switchedSuiteStr = normalizeString(cardSuite);
        
        return cardNumberStr === switchedNumberStr && cardSuiteStr === switchedSuiteStr
    });

    //check if card clicked is from user and middle clicked
    if(middleCardPicked === true && element.parentNode === userHand) {

        if (pickedCard === null || pickedCard < 0 || pickedCard >= middleCards.length) {
            return console.log('Invalid middle card index');
        }
        //switch the elements
        console.log(`second pick: ${switchedCard.number} of ${switchedCard.suite}`)
        console.log(`exchaning ${middleCards[pickedCard].number} of ${middleCards[pickedCard].suite} with ${switchedCard.number} of ${switchedCard.suite}`);

        //find the index of the card in each array
        const userCardIndex = userCards.findIndex(card => 
            normalizeString(card.number) === normalizeString(switchedCard.number) && 
            normalizeString(card.suite) === normalizeString(switchedCard.suite)
        );
        const middleCardIndex = pickedCard; 
        //swap cards

        const temp = userCards[userCardIndex];
        userCards[userCardIndex] = middleCards[middleCardIndex];
        middleCards[middleCardIndex] = temp;

        //create dom
        addToHand(userHand, pickedElement, userCards[userCardIndex]);
        addToHand(cardHolder, element, middleCards[middleCardIndex]);

        reorderImages(cardHolder);
        reorderImages(userHand);

        //reset the variables defined globally
        middleCardPicked = false;
        pickedCard = null;
        //pickedCard.classList.remove('picked');
        pickedElement = null;
    }

    //pick first card
    if(element.parentNode === cardHolder) {
        middleCardPicked = true;
        element.classList.add('picked');
        //log the element picked rq
        pickedElement = element;

        pickedCard = middleCards.findIndex(card => {
            const cardNumberStr = normalizeString(card.number);
            const cardSuiteStr = normalizeString(card.suite);
            const pickedNumberStr = normalizeString(cardNumber);
            const pickedSuiteStr = normalizeString(cardSuite);
        
            return cardNumberStr === pickedNumberStr && cardSuiteStr === pickedSuiteStr;
        });
               
        if (pickedCard >= 0) {
            console.log(`Card picked: ${middleCards[pickedCard].number} of ${middleCards[pickedCard].suite}`);
        } else {
            console.log('Card not found in middle');
        }
    }    
}


function resetCards() {
    cardDeck = [...deck];

    cardHolder.innerHTML = '';
    userHand.innerHTML = '';
    //reset the variables defined globally
    middleCardPicked = false;
    pickedCard = null;
    pickedCard.classList.remove('picked');
    pickedElement = null;
}
