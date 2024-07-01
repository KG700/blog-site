import { getDisplayDate } from '../getDisplayDate';

describe('getDisplayDate', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(Date.UTC(2024, 6, 15)));
      });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('returns today when passed todays isoDate', () => {
        const todaysDate = new Date()
        const theDate = getDisplayDate(todaysDate.toISOString())
        expect(theDate).toEqual('today')
    })
})
