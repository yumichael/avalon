import React from 'react';
import { loggedConstructor } from 'src/library/logging/loggers';
import StartNewGameX from './StartNewGame';

@loggedConstructor()
class NewGameMenuXInsert {
  getStartNewGame() {
    return <StartNewGameX />;
  }
}

export default NewGameMenuXInsert;
