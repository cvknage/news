import { greeter } from './greeting-module';
import { IGreetingService } from './greeting-service';

class GreetingController {
    constructor(private greetingService: IGreetingService) {}

    public hey(userName: string) {
        return this.greetingService.getGreeting() + userName;
    }
}

greeter.component('greeting', {
    templateUrl: 'components/greeting/greeting-component.html',
    controller: GreetingController,
    bindings: {
        userName: '='
    }
});

greeter.component('gggreeting', {
    template: '{{$ctrl.userName ? $ctrl.hey($ctrl.userName) : $ctrl.hey("")}}',
    controller: GreetingController,
    bindings: {
        userName: '='
    }
});
