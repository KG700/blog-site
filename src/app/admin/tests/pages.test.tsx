import Admin from '../page';
import { fireEvent, render, screen, act } from '@testing-library/react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@testing-library/jest-dom'

const signOutMock = jest.fn();
jest.mock('aws-amplify/auth', () => ({
    fetchUserAttributes: jest.fn().mockReturnValue({ sub: 'testUserId-123'}),
  }));
jest.mock('aws-amplify/api', () => ({
generateClient: jest.fn(() => ({
    graphql: jest.fn().mockReturnValue({ data: { getAdminProfile: null } }),
})),
}));
jest.mock('aws-amplify');
jest.mock('@aws-amplify/ui-react', () => {
    return {
        Authenticator: jest.fn(
            ({ children }) => children({
                signOut: signOutMock,
                user: { username: 'testuser' }
            })
        ),
    }
});

describe('Admin page', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    })
    it('renders that Authenticator component', async () => {
        await act(async () => render(<Admin />));
        expect(Authenticator).toHaveBeenCalled();
    })

    it('displays username when user is logged in', async () => {
        await act(async () => render(<Admin />));
        expect(screen.getByText('Hello testuser')).toBeInTheDocument()
    })

    it('sign out button calls signOut function', async () => {
        await act(async () => render(<Admin />));
        const signOutButton = screen.getByText('Sign out');
        fireEvent.click(signOutButton);
        expect(signOutMock).toHaveBeenCalled();
    })
})
