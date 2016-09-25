import { GreetingService } from './greeting-service';

describe('GreetingService should expose', () => {
    let greetingService: GreetingService;

    beforeEach(() => {
        greetingService = new GreetingService();
    });

    it('setGreeting', () => {
        expect(greetingService.setGreeting).toBeDefined();
    });
});
