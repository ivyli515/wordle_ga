import {generateWord, isGuessValid} from './wordle-words.js';

// setup constants for the game
// const targetWord = generateWord();
const targetWord = 'PEACH';
const targetLetters = targetWord.split("")
console.log(targetWord);
let message = document.getElementById('message');
let guessWord = document.getElementById('guessWord');
const rows = document.getElementsByClassName("row");
let keyboardGuess = [];


// guessWord.value.toUpperCase();
let keys = document.getElementsByClassName('key');
for (let keyElement of keys) {
    if (keyElement.textContent != 'Enter' && keyElement.textContent != 'Backspace') {
        keyElement.textContent = keyElement.textContent.toUpperCase();
        keyElement.setAttribute('id', keyElement.textContent);
    }
}

const guesses = [
    "APPLE",
    "TRAIN",
    "GRAPE",
    "",
    "",
    "",
]
let rowIdx = guesses.indexOf(''); // initial value
let boardRow = document.getElementsByClassName(`row-${rowIdx}`)

function updteRowIndex() {
    // called whenever a successful submit happens
    rowIdx = guesses.indexOf('')
    boardRow = document.getElementsByClassName(`row-${rowIdx}`)
}

function renderBoard(currentGuesses) {
    
    // iterate over the 6 guesses / rows
    for (let rowNum=0; rowNum<6; rowNum++) {
        const currentGuess = currentGuesses[rowNum];
        const letters = currentGuess.split(""); 
        
        const targetObj = Object.assign({}, targetLetters)

        const guessObj = Object.assign({}, letters)
        const columnsDiv = rows[rowNum]
    // iterate over column / letters
    // TODO: clean up messy code
        Object.entries(guessObj).forEach( entry=> {
            const [colNum, letter] = entry
            columnsDiv.children[colNum].innerText = letter
            const boardStyle = 'background: #6BA964; border-color: #6BA964; color: white;'

            if (letter === targetObj[colNum]) {
                columnsDiv.children[colNum].style=boardStyle;
                
                let keyId = targetObj[colNum]
                document.getElementById(keyId).style = boardStyle;
                delete targetObj[colNum]
                delete guessObj[colNum]
            }
        })
        Object.entries(guessObj).forEach( entry=> {
            const [colNum, letter] = entry
            columnsDiv.children[colNum].innerText = letter
            const boardStyleYellow = 'background: #C9B458; border-color: #C9B458; color: white;'
            const boardStyleGrey = 'background: #787C7E; border-color: #787C7E; color: white;'
            if (letter !== targetObj[colNum] && Object.values(targetObj).includes(letter)) {
                columnsDiv.children[colNum].style = boardStyleYellow
               
                let keyId = letter;
                const yellowKey = document.getElementById(keyId);
                if (!yellowKey.style.background) {
                    yellowKey.style = boardStyleYellow
                }
                const col = getKeyByValue(targetObj, letter);
                delete targetObj[col]
                delete guessObj[colNum]
            }
            else {
                columnsDiv.children[colNum].style = boardStyleGrey;
                
                let keyId = columnsDiv.children[colNum].textContent
                
                const greyKey = document.getElementById(keyId);
                if (!greyKey.style.background) {
                    greyKey.style = boardStyleGrey
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
        fillMessageStyle()
    }
    else if (!guesses.includes('')) {
        message.innerText = `You have exhausted all your guesses! The word you are looking for is ${targetWord}`
        fillMessageStyle()
    }

}


// Provide hint
document.getElementById('hint').addEventListener('click', handleHint)
function handleHint() {
    let guessArr = []
    let hints = []
    for (let guess of guesses) {
        if (guess!=='') {
            guessArr.push(guess.split(''))
        }
    }
    guessArr = guessArr.flat()

    const set = new Set(guessArr);
    const newArr = [...set];
    for (let l of targetLetters) {
        if (!newArr.includes(l)) {
            hints.push(l)
        }
    }
    if (hints.length!=0) {
        const firstHint = hints[0];
        document.getElementById(firstHint).style.border= "1px solid red";
    } else {
        message.innerText = 'You already have all the letters you need!';
        fillMessageStyle()
    }
    document.getElementById('hint').disabled = true;
}


function useVirtualKeyboard() {

    document.addEventListener('keydown', (event)=> {    
        updateEnter(event.code)
        for (let col in boardRow) {
            if (updateBackspace(event.code)) {
                break;
            }
            else if (boardRow[col].innerText === "" && event.key.length ===1){
            
                boardRow[col].innerText = event.key.toUpperCase();
                keyboardGuess.push(event.key.toUpperCase());
                break;
            }
        }
        updteRowIndex()
        
    });
}
useVirtualKeyboard();

function handleEnter(entry, row) {
    message.innerText = ''
    const yourGuess = entry.join('');
    if (guesses.includes('') && isGuessValid(yourGuess)) {
        const idx = guesses.indexOf('');
        guesses[idx] = yourGuess;
        renderBoard(guesses)
        if (rowIdx<guesses.length) {rowIdx=rowIdx+1}
    }
    else if (!isGuessValid(yourGuess)) {
        message.innerText = 'Please enter a valid word!'
        fillMessageStyle()
        for (let c of row) {
            c.innerText='';
        }
    }
    keyboardGuess=[]
    
    decideGameState()
    
    
}


function keyboardInput() {
   
    
    // register event listener for each of the keys on the keyboard
    for (let keyElement of keys) {
        let key = keyElement.textContent;
        
        // register event listeners for mouse input
        keyElement.addEventListener('click', function () {
            updateEnter(key);
            
            for (let col of boardRow) {
                if (updateBackspace(key)) {
                    break;
                }
                
                 if (col.innerText==='') {
                    col.innerText = key
                    keyboardGuess.push(key);
                    break;
                }
                
            }
            updteRowIndex()
        })
    // }
}
}
keyboardInput()

function updateEnter(input) {
    if (input=="Enter" && keyboardGuess.length == 5) {
        handleEnter(keyboardGuess, boardRow)
    }
}
function updateBackspace(input) {
    if (input=='Backspace') {
        console.log(boardRow[keyboardGuess.length-1])
        boardRow[keyboardGuess.length-1].innerText = '';
        keyboardGuess.pop();
        return true;
        
    }
}
function fillMessageStyle() {
    
    return document.getElementById('message').style.background = '#D4D6DA';
}


// for (let i=0; i<2; i++) {
//     if (call_some_function(true)) {
//         break
//     }
// }

// function call_some_function(some_bool) {
//     return some_bool
// }
