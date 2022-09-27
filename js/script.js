import {generateWord, isGuessValid} from './wordle-words.js';

// setup constants for the game
const targetWord = generateWord();
console.log(targetWord);
let message = document.getElementById('message');
let guessWord = document.getElementById('guessWord');

// guessWord.value.toUpperCase();
let keys = document.getElementsByClassName('key');
for (let keyElement of keys) {
    if (keyElement.textContent != 'Enter' && keyElement.textContent != 'Del') {
        keyElement.textContent = keyElement.textContent.toUpperCase();
        keyElement.setAttribute('id', keyElement.textContent);
    }
}
// const targetWord = 'PEACH';

const guesses = [
    "",
    "",
    "",
    "",
    "",
    "",
]

function renderBoard(currentGuesses) {
    const rows = document.getElementsByClassName("row");
    // iterate over the 6 guesses / rows
    for (let rowNum=0; rowNum<6; rowNum++) {
        const currentGuess = currentGuesses[rowNum].toUpperCase();
        const letters = currentGuess.split(""); 
        const targetLetters = targetWord.split("")
        const targetObj = Object.assign({}, targetLetters)

        const guessObj = Object.assign({}, letters)
        const columnsDiv = rows[rowNum]
    // iterate over column / letters
        Object.entries(guessObj).forEach( entry=> {
            const [colNum, letter] = entry
            columnsDiv.children[colNum].innerText = letter

            if (letter === targetObj[colNum]) {
                columnsDiv.children[colNum].style.background = 'green'
                // for (let keyElement of keys) {
                //     if (keyElement.textContent.toLocaleUpperCase() === targetObj[colNum]) {                     
                //         keyElement.style.background = 'green'
                //     }
                // }
                let keyId = targetObj[colNum]
                document.getElementById(keyId).style.background = 'green';
                delete targetObj[colNum]
                delete guessObj[colNum]
            }
        })
        Object.entries(guessObj).forEach( entry=> {
            const [colNum, letter] = entry
            columnsDiv.children[colNum].innerText = letter

            if (letter !== targetObj[colNum] && Object.values(targetObj).includes(letter)) {
                columnsDiv.children[colNum].style.background = 'yellow'
                // for (let keyElement of keys) {
                //     if (keyElement.textContent.toLocaleUpperCase() === letter && !keyElement.style.background) {                     
                //         keyElement.style.background = 'yellow'
                //     }
                // }
                let keyId = letter;
                const yellowKey = document.getElementById(keyId);
                if (!yellowKey.style.background) {
                    yellowKey.style.background = 'yellow'
                }
                const col = getKeyByValue(targetObj, letter);
                delete targetObj[col]
                delete guessObj[colNum]
            }
            else {
                columnsDiv.children[colNum].style.background = 'grey';
                // for (let keyElement of keys) {
                //     if (keyElement.textContent.toLocaleUpperCase() === columnsDiv.children[colNum].textContent 
                //         && !keyElement.style.background) {                     
                //         keyElement.style.background = 'grey'
                //     }
                // }
                let keyId = columnsDiv.children[colNum].textContent
                const greyKey = document.getElementById(keyId);
                if (!greyKey.style.background) {
                    greyKey.style.background = 'grey'
                }
            }
        })
    
    }
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

// Initial state of the game 
renderBoard(guesses)

function decideGameState() {
    if (guesses.includes(targetWord)) {
        message.innerText = "Congratulations! You won."
    }
    else if (!guesses.includes('')) {
        message.innerText = `You have exhausted all your guesses! The word you are looking for is ${targetWord}`
        // document.getElementById('guessWord').value = ''
    }
    

}
// function remainingGuesses(guessList) {
//     return guessList.filter(it => it === "").length
// }

document.getElementById('submitGuess').addEventListener('click', handleClick);
function handleClick() {
    // console.log(guessWord.textContent);
    message.innerText = ''
    const yourGuess = guessWord.value.toUpperCase();
    if (guesses.includes('') && isGuessValid(yourGuess)) {
        const idx = guesses.indexOf('');
        guesses[idx] = yourGuess;
        renderBoard(guesses)
        guessWord.value = '';
    }
    else if (!isGuessValid(yourGuess)) {
        message.innerText = 'Please enter a valid word!'
        guessWord.value = ''
    }
    decideGameState()
}
    
// Keyboard


function generateGuessWord() {
    let keyboardGuess = ''
    for (let keyElement of keys) {
        let key = keyElement.textContent;
        keyElement.addEventListener('click', function () {
            switch(key) {
                case "Del":
                    guessWord.value = guessWord.value.slice(0, guessWord.value.length-1);
                    break;
                case "Enter":
                    handleClick();
                    keyboardGuess = '';
                    break;
                default: 
                    keyboardGuess = keyboardGuess.concat(key);
                    guessWord.value = keyboardGuess;

            }
        })
    }
}

// function renderKeyboard() {
//     for (let keyElement of keys) {
//         for ()
//     }
// }

generateGuessWord()