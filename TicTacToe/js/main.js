const ROWSIZE = 3
const COLSIZE = 3

//global handle to board div and controls div
// so we dont have to look it up every time
let boardNode;
let controlsNode;

//keep track of if game has ended
let gameEnded = false

//player's mark and ai's mark
const playerMark = "X";
const aiMark = "O";

//default character for gameboard which webpage loads in with
const defaultChar = "_"

//holds the board buttons in nested arrays
//accessed like board[0][0] (top left button)
const board = [];

//assoc array of the other buttons
//accessed like controls.aiFirst or controls.reload
const controls = {};

//message to appear after game is won
let endMessage = ""

/*
    ai makes its move
*/
const aiGo = () => {

    if(gameEnded){
        return
    }

    const empties = []

    //push every open space into empties
    for(let i = 0; i < ROWSIZE; i++){
        for(let j = 0; j < COLSIZE; j++){
            if(board[i][j].innerHTML == defaultChar){
                 empties.push(board[i][j])
            }
        }
    }

    //error catching
    if(empties.length == 0){
        console.error("Error with length of array in aiGo")
        return
    }

    //choose random open space
    let randIndex = Math.floor(Math.random() * empties.length)
    let chosen = empties[randIndex]
    chosen.innerHTML = aiMark
    chosen.disabled = true
    chosen.style.color = "white"

}

const aiFirst = () => {
    aiGo()
    controls.aiButton.disabled = true
}

/*
    check if game ended in a tie
*/
const checkTie = () => {

    const tieLetter = defaultChar

    //loop through rows and columns
    for(let i = 0; i < ROWSIZE; i++){
        for(let j = 0; j < COLSIZE; j++){
            //if there is an open space still on the board then exit function
            if(board[i][j].innerHTML == defaultChar){
                return
            }
        }
    }

    //looped through every button on the board
    //if there was no open space then call end game
    endGame(tieLetter)
}

/*  
    check if all three params are of same kind
    if win call endGame
*/
const checkStraight = (row1, row2, row3) => {
    const letter = row1.innerHTML
    if((letter == row2.innerHTML && letter == row3.innerHTML) && (letter != "_")){
        endGame(letter)
    }
}

/*
    check for diagonal win
*/
const checkDiag = () => {
    let letter = board[0][0].innerHTML
    if((letter == board[1][1].innerHTML && letter == board[2][2].innerHTML) && (letter != '_')){
        endGame(letter)
    }
    letter = board[0][2].innerHTML
    if((letter == board[1][1].innerHTML && letter == board[2][0].innerHTML) && (letter != '_')){
        endGame(letter)
    }
}

/*
    check for win
*/
const checkEnd = () => {

    //check for a tie first
    checkTie()

    //check each row
    for(let i = 0; i < ROWSIZE; i++){
        //check for vertical win
        checkStraight(board[0][i], board[1][i], board[2][i])
        //check horizontal win
        checkStraight(board[i][0], board[i][1], board[i][2])
    }

    //check for diagonal win
    checkDiag()

}
/*
    isnt an arrow function because this way it can use 'this' 
    to reference the button clicked.

    always sets aiFirst button to disabled
    sets button state (disabled and inner html)
    checks for end state (and possible ends game)
*/
const boardOnClick = function(event){

    //change innerHTML to player mark
    this.innerHTML = playerMark
    this.disabled = true
    this.style.color = "white"

    //check for a possible win
    checkEnd()

    //have ai go
    aiGo()

    //check for a possible win
    checkEnd()

    //set ai go first button to disabled
    //after game has already begun
    controls.aiButton.disabled = true
}

/*
    takes in the return of checkEnd (X,O,-) if checkEnd isnt false
    disables all board buttons, shows message of who won (or cat game) in the control node
    using a new div and innerHTML
*/
const endGame = (letter)=>{

    //if there was a tie
    if(letter == defaultChar){
        endMessage = "Tie Game"
    }else{
        endMessage = letter+" WON"
    }
    controls.messageDiv.innerHTML = endMessage

    //loop through rows and columns
    for(let i = 0; i < ROWSIZE; i++){
        for(let j = 0; j < COLSIZE; j++){

            //set each button to disabled
            board[i][j].disabled = true
            if(board[i][j].innerHTML == defaultChar){
                board[i][j].style.color = "#1b1d17"
            }

        }
    }

    gameEnded = true

}

/*
    If user decides to play again, then resets the gameboard
*/
const reload = function(event){

    //loop through rows and columns
    for(let i = 0; i < ROWSIZE; i++){
        for(let j = 0; j < COLSIZE; j++){

            board[i][j].innerHTML = defaultChar
            board[i][j].disabled = false
            board[i][j].style.color = "#1b1d17"

        }
    }

    gameEnded = false

    //set ai button back to enabled
    controls.aiButton.disabled = false
    controls.messageDiv.innerHTML = ""

}

/*
    set up the controls
    play again button, ai go first button
    and the divs that hold them
*/
const loadControls = ()=>{

    //set up end game message
    const messageDiv = document.createElement("div")
    messageDiv.classList.add("message_div")
    controlsNode.appendChild(messageDiv)
    controls.messageDiv = messageDiv
    messageDiv.innerHTML = endMessage

    //set up controls div
    const cDiv = document.createElement("div")
    cDiv.classList.add("play_again_div")
    controlsNode.appendChild(cDiv)
    controls.playAgainDiv = cDiv

    //create play again button
    const cButton = document.createElement("button")
    cButton.classList.add("play_again_button")
    cButton.innerHTML = "Reset"
    controls.playAgainDiv.appendChild(cButton)
    cButton.onclick = reload
    controls.playButton = cButton

    //controls div for ai go first button
    const aiDiv = document.createElement("div")
    aiDiv.classList.add("ai_div")
    controlsNode.appendChild(aiDiv)
    controls.aiDiv = aiDiv

    //create ai goes first button
    const aiButton = document.createElement("button")
    aiButton.classList.add("ai_first_button")
    aiButton.innerHTML = "AI Go First"
    aiDiv.appendChild(aiButton)
    aiButton.onclick = aiFirst
    controls.aiButton = aiButton
}

/*
    called when page finishes loading
    populates the boardNode and controlsNode with getElementById calls
    builds out buttons and saves them in the board global array
    and adds them into the boardNode
    builds out buttons and saves them in control assoc array
    and adds them into controlsNode
    attaches the functions above as button.onclick as appropriate
*/
const load = ()=>{
    boardNode = document.getElementById("board")
    controlsNode = document.getElementById("controls")

    loadControls()

    //counter just used for css styling
    let counter = 0

    //set up boardNode
    for(let i = 0; i < ROWSIZE; i++){
        board[i] = []
        //divs stack vertically
        const div = document.createElement("div")
        boardNode.appendChild(div)

        //create columns
        for(let j = 0; j < COLSIZE; j++){
            let className = "gb"+counter
            const button = document.createElement("button")
            button.classList.add("game_button")
            button.classList.add(className)
            counter++
            button.innerHTML = defaultChar
            button.onclick = boardOnClick
            board[i][j] = button
            div.appendChild(button)
        }
    }

}

//this says 'when the page finishes loading call my load function'
window.addEventListener("load", load); 