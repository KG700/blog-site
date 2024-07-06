import { getDisplayDate } from '../getDisplayDate';

describe('getDisplayDate', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(Date.UTC(2024, 6, 15, 10, 8)));
      });

    afterAll(() => {
        jest.useRealTimers();
    });

    describe('when timestamp not required', () => {
        it('returns today when passed todays isoDate', () => {
            const todaysDate = new Date()
            const theDate = getDisplayDate(todaysDate.toISOString())
            expect(theDate).toEqual('today')
        })

        it('returns yesteday when passed yesterdays isoDate', () => {
            const todaysDate = new Date()
            const yesterdaysDate = new Date(todaysDate.setDate(todaysDate.getDate() - 1));

            const theDate = getDisplayDate(yesterdaysDate.toISOString())
            expect(theDate).toEqual('yesterday')
        })

        it('returns date when passed date from 2 days ago isoDate', () => {
            const todaysDate = new Date()
            const twoDaysAgoDate = new Date(todaysDate.setDate(todaysDate.getDate() - 2));

            const theDate = getDisplayDate(twoDaysAgoDate.toISOString())
            expect(theDate).toEqual('13 Jul 2024')
        })
    })

    describe('when timestamp is required', () => {
        it('returns today when passed todays isoDate', () => {
            const todaysDate = new Date()
            const theDate = getDisplayDate(todaysDate.toISOString(), true)
            expect(theDate).toEqual('today at 11:08')
        })

        it('returns yesteday when passed yesterdays isoDate', () => {
            const todaysDate = new Date()
            const yesterdaysDate = new Date(todaysDate.setDate(todaysDate.getDate() - 1));

            const theDate = getDisplayDate(yesterdaysDate.toISOString(), true)
            expect(theDate).toEqual('yesterday at 11:08')
        })

        it('returns date when passed date from 2 days ago isoDate', () => {
            const todaysDate = new Date()
            const twoDaysAgoDate = new Date(todaysDate.setDate(todaysDate.getDate() - 2));

            const theDate = getDisplayDate(twoDaysAgoDate.toISOString(), true)
            expect(theDate).toEqual('13 Jul 2024 at 11:08')
        })
    })

})
