import { app } from '../../app';
import { User } from '../../models/user';
import { IStorageService } from '../../services/storage-service/storage-service';

class UserController {
    public userName: string;

    constructor($scope: ng.IScope, localStorageService: IStorageService) {
        let user: User = localStorageService.get<User>('user') || new User();
        this.userName = user.name;

        $scope.$watch(() => {
            return this.userName;
            }, (newValue, oldValue) => {
                user.name = newValue;
                localStorageService.save('user', user);
            });
    }
}

app.component('userComponent', {
    templateUrl: 'sections/user/user-component.html',
    controller: UserController
});
