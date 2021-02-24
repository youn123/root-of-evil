function createNew() {
  return {
    players: [],
    idToPlayers: {},
    playersToId: {},
    state: 'Created'
  };
}

function apply(gameState, delta) {
  switch (delta.type) {
    case 'JOIN':
      return join(gameState, delta);
  }
}

function join(gameState, joinData) {
  if (gameState.players.inclues(joinData.name)) {
    return [gameState, {
      result: 'REJECTED',
      to: joinData.clientId
    }];
  } else {
    return [{
      players: [...gameState.players, joinData.name],
      idToPlayers: {
        ...gameState.idToPlayers,
        [joinData.clientId]: joinData.name 
      },
      playersToId: {
        ...gameState.playersToId,
        [joinData.name]: joinData.clientId
      }
    }, {
      result: 'ACCEPTED',
      to: joinData.clientId
    }];
  }
}

function start(gameState) {
  let numEvilMembers;
  let numPlayers = gameState.players.length;

  // These mappings will need to be tweaked.
  if (numPlayers == 5 || numPlayers == 6) {
    numEvilMembers = 2;
  } else if (numPlayers <= 10) {
    numEvilMembers = 3;
  } else if (numPlayers <= 15) {
    numEvilMembers = 4;
  } else {
    numEvilMembers = 5;
  }

  let { chosen } = chooseNoReplacement(gameState.players, numEvilMembers);

  let newGameState = {
    ...gameState,
    evilMembers: chosen,
    state: 'TeamBuilding'
  };

  return [newGameState, {
    ...newGameState,
    result: 'NEW_GAME_STATE',
    to: 'everyone'
  }];
}

function chooseNoReplacement(arr, numToChoose) {
  let arrCopy = [...arr];
  let chosen = [];

  for (let i = 0; i < numToChoose; i++) {
    let randIndex = Math.floor(Math.random() * arrCopy.length);
    chosen.push(arrCopy[randIndex]);
    arrCopy.splice(randIndex, 1);
  }

  return {
    finalArr: arrCopy,
    chosen
  };
}