import {app} from './app';

describe('app', () => {
    beforeEach(() => {
        return;
    });

    describe('should export', () => {
        it('app', () => {
            expect(app).toBeDefined();
        });
    });

    describe('should', () => {
        it('be named typeScriptTest', () => {
            expect(app.name).toBe('typeScriptTest');
        });
    });
});
