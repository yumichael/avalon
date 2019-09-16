import { loggedConstructor } from 'src/library/logging/loggers';
import autobind from 'autobind-decorator';
import { observable, action } from 'mobx';
import bits from 'src/components/bits';
import GameApi from 'src/model/Game/GameApi';

@loggedConstructor()
@autobind
class SecretsView {
  private readonly gameApi: GameApi;
  constructor(gameApi: GameApi) {
    this.gameApi = gameApi;
  }
  @observable private viewingRoleInfo: boolean = false;
  private timeout?: NodeJS.Timeout = undefined;
  isViewingRoleInfo() {
    return this.viewingRoleInfo;
  }
  @action viewRoleInfo() {
    this.clearTimeout();
    this.viewingRoleInfo = true;
    if (this.gameApi.act) {
      this.gameApi.act.seeRole();
    }
    this.timeout = setTimeout(() => {
      this.viewingRoleInfo = false;
      this.timeout = undefined;
    }, bits.timeDurations.viewSecret);
  }
  @action stopViewingRoleInfo() {
    this.viewingRoleInfo = false;
    this.clearTimeout();
  }
  private clearTimeout() {
    if (this.timeout !== undefined) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
  }
  @action toggleViewingRoleInfo() {
    this.viewingRoleInfo = !!!this.viewingRoleInfo;
  }
}

export default SecretsView;
