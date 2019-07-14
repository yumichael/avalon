import { observable, action } from 'mobx';
import { loggedConstructor } from 'src/library/logging/loggers';

@loggedConstructor()
class NeedToInform {
  @observable hasSeenOwnRole: boolean = false;
  @action seeOwnRole() {
    this.hasSeenOwnRole = true;
  }
}

export default NeedToInform;
