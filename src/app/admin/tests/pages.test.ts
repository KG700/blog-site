import Admin from '../page';
import { fireEvent, render, screen } from '@testing-library/react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@testing-library/jest-dom'

jest.mock('@aws-amplify/ui-react', () => {
    return {
        Authenticator: jest.fn(
            ({ children }) => children({
                signOut: jest.fn(),
                user: { username: 'testuser' }
            })
        ),
    }
});

describe('Admin page', () => {
    it('renders that Authenticator component', () => {
        render(Admin());
        expect(Authenticator).toHaveBeenCalled();
    })

    it('displays username when user is logged in', () => {
        render(Admin());
        expect(screen.getByText('Hello testuser')).toBeInTheDocument()
    })

    it('sign out button calls signOut function', () => {
        const signOutMock = jest.fn();
        Authenticator.mockImplementationOnce(
            ({ children }) => children({
                signOut: signOutMock,
                user: { username: 'testuser' }
            })
        );

        render(Admin());
        const signOutButton = screen.getByText('Sign out');
        fireEvent.click(signOutButton);

        expect(signOutMock).toHaveBeenCalled();
    })
})
