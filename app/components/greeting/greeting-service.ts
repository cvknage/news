import { greeter } from './greeting-module';

export interface IGreetingProvider {
    setGreeting(greeting: string): void;
}

export interface IGreetingService {
    getGreeting(): string;
}

export class GreetingService implements ng.IServiceProvider, IGreetingProvider {
    private greeting: string = 'Hey you, ';

    public setGreeting(greeting: string) {
        this.greeting = greeting;
    }

    public $get(): IGreetingService {
        return {
            getGreeting: () => { return this.greeting; }
        };
    }
}

greeter.provider('greetingService', GreetingService);
