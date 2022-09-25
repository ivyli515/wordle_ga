import {generateWord, isGuessValid} from './wordle-words.js';

// setup constants for the game
const targetWord = generateWord();
console.log(targetWord);
let message = document.getElementById('message');
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
                delete targetObj[colNum]
                delete guessObj[colNum]
            }
        })
        Object.entries(guessObj).forEach( entry=> {
            const [colNum, letter] = entry
            columnsDiv.children[colNum].innerText = letter

            if (letter !== targetObj[colNum] && Object.values(targetObj).includes(letter)) {
                columnsDiv.children[colNum].style.background = 'yellow'
                const col = getKeyByValue(targetObj, letter);
                delete targetObj[col]
                delete guessObj[colNum]
            }
            else {
                columnsDiv.children[colNum].style.background = 'grey';
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
        message.innerText = 'You have exhausted all your guesses!'
        // document.getElementById('guessWord').value = ''
    }
    

}
// function remainingGuesses(guessList) {
//     return guessList.filter(it => it === "").length
// }

document.getElementById('submitGuess').addEventListener('click', handleClick);
function handleClick() {
   
    message.innerText = ''
    const yourGuess = document.getElementById('guessWord').value.toUpperCase();
    if (guesses.includes('') && isGuessValid(yourGuess)) {
        const idx = guesses.indexOf('');
        guesses[idx] = yourGuess;
        renderBoard(guesses)
        document.getElementById('guessWord').value = '';
    }
    else if (!isGuessValid(yourGuess)) {
        message.innerText = 'Please enter a valid word!'
        document.getElementById('guessWord').value = ''
    }
    decideGameState()
}
    

