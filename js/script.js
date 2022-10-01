import {generateWord, isGuessValid} from './wordlewords.js';

// setup constants for the game
const targetWord = generateWord();
// const targetWord = 'CREPE'
// const targetWord = 'GRAPE';
const targetLetters = targetWord.split("")
console.log(targetWord);
let message = document.getElementById('message');

const rows = document.getElementsByClassName("row");
let keyboardGuess = [];
let keys = document.getElementsByClassName('key');
// make all keys upper case
for (let keyElement of keys) {
    if (keyElement.textContent != 'Enter' && keyElement.textContent != 'Backspace') {
        keyElement.textContent = keyElement.textContent.toUpperCase();
        keyElement.setAttribute('id', keyElement.textContent);
    }
}
// set up array for 6 guesses
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

// function for the game to move onto the next row
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

            if (letter === targetObj[colNum]) {
                columnsDiv.children[colNum].classList.add('green');
                let keyId = targetObj[colNum]         
                const greenKey = document.getElementById(keyId)

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
                
                if (yellowKey.classList.length ==1) {
                    console.log(yellowKey.style.background)

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
                if (greyKey.classList.length ==1) {
                    // greyKey.classList = greyKey.classList[0]
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

// decide winning or losing for the game
function decideGameState() {
    if (guesses.includes(targetWord)) {
        message.innerText = "Congratulations! You won :)"
        message.className = 'messageFilled';
        
    }
    else if (!guesses.includes('')) {
        message.innerText = `You have exhausted all your guesses! The word you are looking for is ${targetWord}`
        message.className = 'messageFilled';
    }

}


// Provide hint
function provideHint() {
    document.getElementById('hint').addEventListener('click', handleHint)
}
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
    }
    document.getElementById('hint').disabled = true;
}
provideHint()


function handleEnter(entry, row) {
    message.innerText = ''
    message.className = '';
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
        for (let c of row) {
            c.innerText='';
            c.classList.remove('filled');
        }
    }
    keyboardGuess=[]
    decideGameState()
      
}

// keyboard input
function keyboardInput() { 
    // register event listener for each of the keys on the keyboard
    for (let keyElement of keys) {
        let key = keyElement.textContent;
        
        keyElement.addEventListener('click', function () {
            updateKeyboardInput(key);            
        })
        // }
    }
}
keyboardInput()

// keypress input
function useVirtualKeyboard() {
// register event listener for key press events
    document.addEventListener('keydown', (event)=> {    
        updateKeyboardInput(event.key); 
    });
}
useVirtualKeyboard();

// function handling keyboard events
function updateKeyboardInput(input) {
    const regex = /^[A-Za-z]$/
    for (let col of boardRow) {
        if (input=="Enter" && keyboardGuess.length == 5) {
            handleEnter(keyboardGuess, boardRow)
        }
        if (input=='Backspace' && keyboardGuess.length !==0) {
            
            boardRow[keyboardGuess.length-1].innerText = '';
            boardRow[keyboardGuess.length-1].classList.remove('filled');
            keyboardGuess.pop();
            break;
        }
        else if (col.innerText==='' && regex.test(input)) {
            input = input.toUpperCase();
            col.innerText = input;
            col.classList.add('filled');
            keyboardGuess.push(input);
            break;
        }
    }
    updteRowIndex()
}
