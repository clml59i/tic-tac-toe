const CROSS_IMG_PATH = "img/redCross.jpg";
const CIRCLE_IMG_PATH = "img/circle.png";
let isGameStarted = false;
let playedRounds = 0;
let player1;
let player2;
let isFirstGame = true;

const winningScenario1 = ['X','X','X'];
const winningScenario2 = ['O','O','O'];

function arraysEqual(a,b) {
    /*
        Array-aware equality checker:
        Returns whether arguments a and b are == to each other;
        however if they are equal-lengthed arrays, returns whether their 
        elements are pairwise == to each other recursively under this
        definition.
    */
    if (a instanceof Array && b instanceof Array) {
        if (a.length!=b.length)  // assert same length
            return false;
        for(var i=0; i<a.length; i++)  // assert each element equal
            if (!arraysEqual(a[i],b[i]))
                return false;
        return true;
    } else {
        return a==b;  // if not both arrays, should be the same
    }
}




// Const GameBoard, which will be a module, 
// containing the gameboard array

const GameBoard = (function(){

    let gameBoardArray = [['','',''], ['','',''], ['','','']];

    const resetGameBoard = () => {
       gameBoardArray = [['','',''], ['','',''], ['','','']];
       playedRounds = 0;
    }
    
    const isDraw = () => {
        return playedRounds === 9;
    }

    const checkDiagonals = () => {
        if (gameBoardArray[0][0] != "" && gameBoardArray[0][0] === gameBoardArray[1][1] && gameBoardArray[1][1] === gameBoardArray[2][2]){
            return true;
        } else if (gameBoardArray[0][2] != "" && gameBoardArray[0][2] === gameBoardArray[1][1] && gameBoardArray[1][1] === gameBoardArray[2][0]){
            return true;
        }
        return false;
    }

    const checkColumns = () => {
        for(let i = 0; i<3; i++){
            if (gameBoardArray[0][i] != "" && gameBoardArray[0][i] === gameBoardArray[1][i] && gameBoardArray[1][i] === gameBoardArray[2][i]){
                return true;
            }
        }
        return false;
    }

    const checkLines = () => {
        for(let i = 0; i <= gameBoardArray.length ; i++){
            if ((arraysEqual(gameBoardArray[i],winningScenario1)) || (arraysEqual(gameBoardArray[i],winningScenario2))){
               return true;
            }
        }
        return false;
    }

    const isGameOver = (isCircle) => {
        if(checkColumns() || checkDiagonals() || checkLines()){
            if(isCircle){
                player1.addWin();
            }else {
                player2.addWin();
            }
            return true;
        }else {
            return false;
        }
    }


    
    // This shouldn't be public
    const addSymbolToArray = (index, isCircle) => {
        if(isGameStarted){
            const x = index.slice(0,1);
            const y = index.slice(2,3);
            if(gameBoardArray[x][y] === ""){
                if(isCircle){
                    gameBoardArray[x][y] = "O"
                } else {
                    gameBoardArray[x][y] = "X"
                }
                playedRounds++;
            }   
        }
    }

    return {addSymbolToArray, isGameOver, resetGameBoard, isDraw}
})();



// const displayController, module
const DisplayController = (function(){
    //Allows us to know which symbol to put in the grid
    let isCircle = true;


    const _gameGridContainer = document.querySelector('.gameGrid');
    const startButton = document.querySelector('#startGame');
    const gameInfos = document.querySelector('.gameInfos');

    // Create a cell inside the 9*9 grid
    const _createGridCell = (id) =>{
        const newCellDiv = document.createElement('div');
        newCellDiv.setAttribute('data-idCell', id);
        newCellDiv.classList.add('gridCell');
        return newCellDiv;
    }

    const congratulateWinner = () => {
        gameInfos.style.display = 'block';
        let winner = player1;
        if(!isCircle){
            winner = player2;
        }
        gameInfos.textContent = `${winner.getName()} wins the game!
        Current score : ${player1.getName()} : ${player1.getScore()} || ${player2.getName()} : ${player2.getScore()}`;
    }

    const _addSymbolToGrid = (cellElement) => {
        let symbol = document.createElement('img');
        if(isCircle){
            symbol.src = CIRCLE_IMG_PATH;
        }else {
            symbol.src = CROSS_IMG_PATH;
        }
        cellElement.appendChild(symbol);
    }

    // Put the corresponding symbol into the grid, then add it to the array. Check if the game is over
    const _addEventOnCell = (cellElement) => {
        cellElement.addEventListener('click', function(event) {
            if(event.target.childElementCount === 0 && isGameStarted){
                _addSymbolToGrid(event.target);
                GameBoard.addSymbolToArray(event.target.getAttribute('data-idCell'), isCircle);                
                if(GameBoard.isGameOver(isCircle)){
                    isGameStarted = false;
                    congratulateWinner();
                }else if (GameBoard.isDraw()){
                    isGameStarted = false;
                    gameInfos.textContent = `This is a draw!
                    Current score : ${player1.getName()} : ${player1.getScore()} || ${player2.getName()} : ${player2.getScore()}`
                }
                
                if(isGameStarted){
                    isCircle = !isCircle;
                    if(isCircle){
                        gameInfos.textContent = `${player1.getName()}, it's your turn to play!`;
                    }else{
                        gameInfos.textContent = `${player2.getName()}, it's your turn to play!`;
                    }
                }
            }
        });
    }
    
    // Create the divs in the grid and add the eventListener on them
    const createEmptyGrid = function() {
        for(let i=0; i<3; i++){
            for(let j=0; j<3; j++){
                let cellId = `${i}-${j}`
                let newGridElement = _createGridCell(cellId);
                _addEventOnCell(newGridElement);
                _gameGridContainer.appendChild(newGridElement);
            }
        }
    }

        // clear function
    function resetGameDisplay(){
        isCircle = true;
        gameInfos.textContent= "";
        while(_gameGridContainer.firstChild){
            _gameGridContainer.removeChild(_gameGridContainer.firstChild);
        }
        var elem = document.querySelector('#gameInfos');
        if(elem){
            elem.parentNode.removeChild(elem);
        }
        createEmptyGrid();
    }


    return {createEmptyGrid, resetGameDisplay, startButton};
})();



// playerFactory
function playerFactory(name) {
    let score = 0;
    const addWin = () => {
        score++;
    }
    const getName = () => name;
    const getScore = () => score;
    return {getName, addWin, getScore}
}


function resetBoard(){
    DisplayController.resetGameDisplay();
    GameBoard.resetGameBoard();
}

// Move this function into one of the modules
function startGame(){
    resetBoard();
    DisplayController.startButton.textContent="Restart the game";
    isGameStarted = true;
    const player1Name = document.querySelector('#namePlayer1').value;
    const player2Name = document.querySelector('#namePlayer2').value;
    if(isFirstGame){
        if(player1Name != ""){
            player1 = playerFactory(player1Name, true);
        }else {
            player1 = playerFactory("Player 1", true);
        }
        if(player2Name != ""){
            player2 = playerFactory(player2Name, false);
        }else {
            player2 = playerFactory("Player 2", false);
        }
    }
    isFirstGame = false;
}

// Function that will generate the grid when we open the page
(function init() {
    DisplayController.createEmptyGrid();
    DisplayController.startButton.addEventListener('click', startGame);
})();