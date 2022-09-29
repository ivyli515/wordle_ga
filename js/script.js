import {generateWord, isGuessValid} from './wordlewords.js';

// setup constants for the game
const targetWord = generateWord();
// const targetWord = 'PEACH';
const targetLetters = targetWord.split("")
console.log(targetWord);
let message = document.getElementById('message');

const rows = document.getElementsByClassName("row");
let keyboardGuess = [];

let keys = document.getElementsByClassName('key');
for (let keyElement of keys) {
    if (keyElement.textContent != 'Enter' && keyElement.textContent != 'Backspace') {
        keyElement.textContent = keyElement.textContent.toUpperCase();
        keyElement.setAttribute('id', keyElement.textContent);
    }
}

const guesses = [
    "",
    "",
    "",
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
            // const boardStyle = 'background: #6BA964; border-color: #6BA964; color: white;'

            if (letter === targetObj[colNum]) {
                columnsDiv.children[colNum].classList.add('green');
                let keyId = targetObj[colNum]         
                const greenKey = document.getElementById(keyId)
                // greenKey.style = 'background: #6BA964; color: white;'
                greenKey.classList = greenKey.classList[0];
                greenKey.classList.add('green');
                
                delete targetObj[colNum]
                delete guessObj[colNum]
            }
        })
        Object.entries(guessObj).forEach( entry=> {
            const [colNum, letter] = entry
            columnsDiv.children[colNum].innerText = letter

            if (letter !== targetObj[colNum] && Object.values(targetObj).includes(letter)) {
                columnsDiv.children[colNum].classList.add('yellow');
               
                let keyId = letter;
                const yellowKey = document.getElementById(keyId);
                if (!yellowKey.style.background) {
                    yellowKey.classList = yellowKey.classList[0];
                    yellowKey.classList.add('yellow')
                }
                const col = getKeyByValue(targetObj, letter);
                delete targetObj[col]
                delete guessObj[colNum]
            }
            else {
                columnsDiv.children[colNum].classList.add('grey');
                
                let keyId = columnsDiv.children[colNum].textContent
                
                const greyKey = document.getElementById(keyId);
                if (!greyKey.style.background) {
                    greyKey.classList = greyKey.classList[0]
                    greyKey.classList.add('grey')
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
        message.innerText = "Congratulations! You won :)"
        message.className = 'messageFilled';
        // fillMessageStyle()
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
        document.getElementById(firstHint).style.border= "2px solid red";
    } else {
        message.innerText = 'You already have all the letters you need!';
        message.className = 'messageFilled';
        // fillMessageStyle()
    }
    document.getElementById('hint').disabled = true;
}


function useVirtualKeyboard() {

    document.addEventListener('keydown', (event)=> {    
        updateEnter(event.key)
        /
        updateKeyboardInput(event.key);
        
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
        message.className = 'messageFilled';
        // fillMessageStyle()
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
        // const inputAnimation = 'animation: flip 1s'

        // register event listeners for mouse input
        keyElement.addEventListener('click', function () {
            updateEnter(key);
            updateKeyboardInput(key);

            
        })
    // }
}
}
keyboardInput()



function updateKeyboardInput(input) {
    const regex = /^[A-Za-z]$/
    for (let col of boardRow) {
        if (input=='Backspace' && keyboardGuess.length !==0) {
            // console.log(boardRow[keyboardGuess.length-1])
            boardRow[keyboardGuess.length-1].innerText = '';
            keyboardGuess.pop();
            break;
        }
        else if (col.innerText==='' && regex.test(input)) {
            input = input.toUpperCase();
            col.innerText = input;
            keyboardGuess.push(input);
            break;
        }
    }
    updteRowIndex()
}
function updateEnter(input) {
    if (input=="Enter" && keyboardGuess.length == 5) {
        handleEnter(keyboardGuess, boardRow)
    }
}

// function fillMessageStyle() {
    
//     return document.getElementById('message').style.background = '#D4D6DA';
// }
