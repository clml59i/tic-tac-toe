const CROSS_IMG_PATH = "img/redCross.jpg";
const CIRCLE_IMG_PATH = "img/circle.png";


// Const GameBoard, which will be a module, 
// containing the gameboard array

const GameBoard = (function(){

    let gameBoardArray = [['','',''], ['','',''], ['','','']];

    const isGameOver = () => {
       
    }

    // This shouldn't be public
    const addSymbolToArray = (index, isCircle) => {
        const x = index.slice(0,1);
        const y = index.slice(2,3);
        if(isCircle){
            gameBoardArray[x][y] = "O"
        } else {
            gameBoardArray[x][y] = "X"
        }
        console.log(gameBoardArray);
    }

    return {addSymbolToArray, isGameOver}
})();



// const displayController, module
const DisplayController = (function(){
    // Create a cell inside the 9*9 grid
    const _createGridCell = (id) =>{
        const newCellDiv = document.createElement('div');
        newCellDiv.setAttribute('data-idCell', id);
        newCellDiv.classList.add('gridCell');
        return newCellDiv;
    }

    const congratulateWinner = (player) => {
        
    }

    //Allows us to know which symbol to put in the grid
    let isCircle = true;

    const _gameGridContainer = document.querySelector('.gameGrid');
    
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
            if(event.target.childElementCount === 0){
                _addSymbolToGrid(event.target);
                GameBoard.addSymbolToArray(event.target.getAttribute('data-idCell'), isCircle);
                isCircle = !isCircle;
                if(GameBoard.isGameOver){
                    congratulateWinner()
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


    return {createEmptyGrid};
})();



// playerFactory
function playerFactory(name) {
    const getName = () => name;
    return {getName}
}

// Function that will generate the grid when we open the page
(function init() {
    DisplayController.createEmptyGrid();
})();

 //addCrossToGrid()
 //addCircleToGrid()
 //createEmptyBoard()
 //congratulatePlayer()


 //startGame()
 //resetGame()
 //isGameOver()



// When I click on start the game, 
//I add the event listeners to the board

// Second option, in the functions called on the event listener, I check if the games is started