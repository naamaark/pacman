'use strict'
const PACMAN = '&#128512';

var gPacman;

function createPacman(board) {
    gPacman = {
        location: {
            i: 3,
            j: 5
        },
        isPower: false,
        currCellContent: EMPTY
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function movePacman(ev) {
    if (!gGame.isOn) return;

    var nextLocation = getNextLocation(ev)
    if (!nextLocation) return;

    var nextCell = gBoard[nextLocation.i][nextLocation.j]

    if (nextCell === WALL) return
    if (nextCell === FOOD) {
        updateScore(1);
        gGame.foodCount--;
        if (!gGame.foodCount) {
            gameOver(true);
        }

    } else if (nextCell === POWER && gPacman.isPower) {
        var isLeavePower = true;

    } else if (nextCell === POWER && !gPacman.isPower) {
        gPacman.isPower = true;
        changeGhostsColor(gPacman.isPower);
        setTimeout(cancelPower, 5000);

    } else if (nextCell === GHOST && gPacman.isPower) {
        deleteGhost(nextLocation);
        return
    } else if (nextCell === GHOST && !gPacman.isPower) {
        gameOver(false);
        renderCell(gPacman.location, EMPTY);
        return
    } else if (nextCell === CHERRY) {
        updateScore(10);

    }

    //  update the model
    gBoard[gPacman.location.i][gPacman.location.j] = gPacman.currCellContent;
    // update the DOM
    renderCell(gPacman.location, gPacman.currCellContent);
    // Move the pacman
    gPacman.location = nextLocation
    //  update the model
    if (isLeavePower) {
        gPacman.currCellContent = gBoard[gPacman.location.i][gPacman.location.i];
        isLeavePower = false
    } else {
        gPacman.currCellContent = EMPTY;
    }
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN
    // update the DOM
    renderCell(gPacman.location, PACMAN)


}

function deleteGhost(ghostLocation) {
    var idx = getGhostByLocation(ghostLocation);
    var ghost = gGhosts[idx];
    if (ghost) {
        //  update the model
        gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
        // update the DOM
        renderCell(gPacman.location, EMPTY)
        // Move the pacman
        gPacman.location = ghostLocation
        //  update the model
        gBoard[ghost.location.i][ghost.location.j] = PACMAN
        // update the DOM
        renderCell(ghostLocation, PACMAN)
        // delete the ghost
        deletedGhost.push(gGhosts.splice(idx, 1)[0]);
    }
}

function cancelPower() {
    gPacman.isPower = false;
    reviveGhost();
    changeGhostsColor(gPacman.isPower);
}

function getNextLocation(eventKeyboard) {
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    switch (eventKeyboard.code) {
        case 'ArrowUp':
            nextLocation.i--
            break;
        case 'ArrowDown':
            nextLocation.i++
            break;
        case 'ArrowLeft':
            nextLocation.j--
            break;
        case 'ArrowRight':
            nextLocation.j++
            break;
        default:
            return null
    }
    return nextLocation;
}