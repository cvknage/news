import { app } from '../../app';

class MenuController {
    constructor(private $mdSidenav: ng.material.ISidenavService) {
    }

    public toggleLeftMenu() {
        this.$mdSidenav('left').toggle();
    }
}

app.component('burgerAndTopMenu', {
    templateUrl: 'components/menu/menu-component.html',
    controller: MenuController
});
