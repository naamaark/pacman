'use strict'
const WALL = '&#9210';
const FOOD = '.';
const POWER = '&#11088';
const EMPTY = ' ';
const CHERRY = '&#127826';

var gBoard;

var gGame = {
    score: 0,
    isOn: false,
    foodCount: -1
}

function init() {
    gBoard = buildBoard();
    document.querySelector(".modal").style.display = 'none';
    gId = 0;
    gGhostColors = getGhostColors();
    createPacman(gBoard);
    createGhosts(gBoard);
    renderMat(gBoard, '.board-container')
    gGame.isOn = true
    gGame.score = 0;
    setInterval(addCherry, 15000);
}

function buildBoard() {
    var SIZE = 10;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = FOOD;
            gGame.foodCount++;
            if (i === 0 || i === SIZE - 1 ||
                j === 0 || j === SIZE - 1 ||
                (j === 3 && i > 4 && i < SIZE - 2)) {
                board[i][j] = WALL;
                gGame.foodCount--;
            }
            if (i === 1 && j === 1 || i === 8 && j === 8 || i === 1 && j === 8 || i === 8 && j === 1) {
                board[i][j] = POWER;
                gGame.foodCount--;
            }
        }
        console.log(gGame.foodCount);
    }
    return board;
}

function addCherry() {
    if (!gGame.isOn) {
        return
    }
    var pos = getEmptyCell();
    if (pos) {
        gBoard[pos.i][pos.j] = CHERRY;
        renderCell(pos, CHERRY);
    }
}
function getEmptyCells() {
    var emptyCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j] === EMPTY) {
                emptyCells.push({ i, j })
            }
        }
    }
    return emptyCells;
}

function getEmptyCell() {
    var emptyCells = getEmptyCells();
    var idx = getRandomIntInclusive(0, emptyCells.length - 1);
    return emptyCells[idx];
}
function updateScore(diff) {
    gGame.score += diff
    document.querySelector('h2 span').innerText = gGame.score
}

function gameOver(isVictory) {
    showModal(isVictory);
    console.log('Game Over');
    gGame.isOn = false
    clearInterval(gIntervalGhosts)
}

function showModal(isVictory) {
    var elModal = document.querySelector(".modal");
    elModal.style.display = 'block';
    if (isVictory) {
        var strHtml = '<h3> You won!</h3><button onclick="init()">restart</button>';
    } else {
        var strHtml = '<h3> You are dead!</h3><button onclick="init()">restart</button>';
    }

    elModal.innerHTML = strHtml;
}

function stopGame() {
    gGame.isOn = false;
}

function continueGame() {
    gGame.isOn = true;
}

