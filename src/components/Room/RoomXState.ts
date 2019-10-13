import { observable, action } from 'mobx';
import autobind from 'autobind-decorator';

@autobind
class RoomXState {
  @observable
  private assigningDirector: boolean = false;
  @observable
  private viewingGame: boolean = false;
  @observable
  private viewingNewGameMenu: boolean = false;
  @observable
  private viewingGameHelp: boolean = false;
  isAssigningDirector() {
    return this.assigningDirector;
  }
  isViewingGame() {
    return this.viewingGame;
  }
  isViewingNewGameMenu() {
    return this.viewingNewGameMenu;
  }
  isViewingGameHelp() {
    return this.viewingGameHelp;
  }
  @action
  viewGame() {
    this.viewingGame = true;
  }
  @action
  viewNewGameMenu() {
    this.viewingNewGameMenu = true;
    this.assigningDirector = false;
    this.viewingGame = false;
  }
  @action
  viewGameHelp() {
    this.viewingGameHelp = true;
  }
  @action
  toAssignDirector() {
    this.assigningDirector = true;
    this.viewingGame = false;
  }
  @action
  stopViewingGame() {
    this.viewingGame = false;
  }
  @action
  stopViewingNewGameMenu() {
    this.viewingNewGameMenu = false;
  }
  @action
  stopViewingGameHelp() {
    this.viewingGameHelp = false;
  }
  @action
  stopAssigningDirector() {
    this.assigningDirector = false;
  }
  @action
  toggleAssigningDirector() {
    if (this.assigningDirector) {
      this.stopAssigningDirector();
    } else {
      this.toAssignDirector();
    }
  }
  @action
  toggleViewingGame() {
    if (this.viewingGame) {
      this.stopViewingGame();
    } else {
      this.viewGame();
    }
  }
  @action
  toggleViewingNewGameMenu() {
    if (this.viewingNewGameMenu) {
      this.stopViewingNewGameMenu();
    } else {
      this.viewNewGameMenu();
    }
  }
  @action
  toggleViewingGameHelp() {
    if (this.viewingGameHelp) {
      this.stopViewingGameHelp();
    } else {
      this.viewGameHelp();
    }
  }
}

export default RoomXState;
