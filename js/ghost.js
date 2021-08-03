'use strict'
const GHOST = '&#9781;';
var gId = 0;
var gGhosts;
var gIntervalGhosts;
var deletedGhost = [];
var gGhostColors = getGhostColors();

function createGhost(board) {
    var color = gGhostColors[gId].color;
    var ghost = {
        location: {
            i: 3,
            j: 3
        },
        Id: gId,
        color: color,
        currCellContent: FOOD
    }

    gGhosts.push(ghost)
    board[ghost.location.i][ghost.location.j] = GHOST
    gId++;
}

function createGhosts(board) {
    gGhosts = [];
    createGhost(board)
    createGhost(board)
    createGhost(board)
    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i]
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    if (!gGame.isOn) {
        return
    }
    var moveDiff = getMoveDiff()
    var nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j
    }

    var nextCell = gBoard[nextLocation.i][nextLocation.j]

    if (nextCell === WALL || nextCell === GHOST) return;
    // add power mode
    if (nextCell === PACMAN && !gPacman.isPower) {
        gameOver()
        return;
    } else if (nextCell === PACMAN && gPacman.isPower) {
        eatGhost(ghost.location);
    }

    // update the model
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
    // update the DOM
    renderCell(ghost.location, ghost.currCellContent)

    //Move the ghost
    ghost.location = nextLocation
    // update the model
    ghost.currCellContent = gBoard[ghost.location.i][ghost.location.j]
    gBoard[ghost.location.i][ghost.location.j] = GHOST

    // update the DOM
    renderCell(ghost.location, getGhostHTML(ghost.color))
}

function changeGhostsColor(isPower) {
    if (isPower) {
        for (var i = 0; i < gGhosts.length; i++) {
            var currGhost = gGhosts[i];
            gGhosts[i].color = 'orange';
            renderCell(currGhost.location, getGhostHTML('orange'));
        }
    } else {
        for (var i = 0; i < gGhosts.length; i++) {
            var currGhost = gGhosts[i];
            var color = gGhostColors[currGhost.Id].color;
            renderCell(currGhost.location, getGhostHTML(color));
            gGhosts[i].color = color;
        }
    }
}

function reviveGhost() {
    gGhosts = gGhosts.concat(deletedGhost);
    deletedGhost = [];
}

function getGhostByLocation(ghostLocation) {
    for (var idx = 0; idx < gGhosts.length; idx++) {
        var currGhost = gGhosts[idx];
        if (currGhost.location.i === ghostLocation.i &&
            currGhost.location.j === ghostLocation.j) return idx
    }
}

function getGhostColors() {
    gGhostColors = [];
    for (var i = 0; i < 3; i++) {
        gGhostColors.push({ i: i, color: getRandomColor() })
    }
    return gGhostColors;
}


function getMoveDiff() {
    var randNum = getRandomIntInclusive(1, 100);

    if (randNum <= 25) {
        return { i: 0, j: 1 }
    } else if (randNum <= 50) {
        return { i: -1, j: 0 }
    } else if (randNum <= 75) {
        return { i: 0, j: -1 }
    } else {
        return { i: 1, j: 0 }
    }
}


function getGhostHTML(ghostColor) {
    return `<span style="color:${ghostColor}">${GHOST}</span>`;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}