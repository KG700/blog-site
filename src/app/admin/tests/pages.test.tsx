import Admin from '../page';
import { fireEvent, render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Authenticator } from '@aws-amplify/ui-react';
import * as api from "aws-amplify/api";
import '@testing-library/jest-dom'

const signOutMock = jest.fn();
jest.mock('aws-amplify/api');
jest.mock('aws-amplify/auth', () => ({
    fetchUserAttributes: jest.fn().mockReturnValue({ sub: 'testUserId-123'}),
  }));
jest.mock('../../../graphql/mutations', () => {
    return {
        createAdminProfile: 'createAdminProfileQuery',
        updateAdminProfile: 'updateAdminProfileQuery'
    }
});
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
    const mockGraphql = jest.fn();

    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
        mockGraphql.mockResolvedValue({ data: {}})
        jest.spyOn(api, 'generateClient').mockReturnValue({ graphql: mockGraphql });
    })
    it('renders the Authenticator component', async () => {
        await act(async () => render(<Admin />));
        expect(Authenticator).toHaveBeenCalled();
    })

    it('calls the signOut function when sign out button is clicked', async () => {
        await act(async () => render(<Admin />));
        const signOutButton = screen.getByText('Sign out');
        fireEvent.click(signOutButton);
        expect(signOutMock).toHaveBeenCalled();
    })

    describe('when new user', () => {
        beforeEach(() => {
            mockGraphql.mockResolvedValue({ data: { getAdminProfile: null } })
        })

        it('displays username when user logs in', async () => {
            await act(async () => render(<Admin />));
            expect(screen.getByText('Hello testuser')).toBeInTheDocument()
        })

        it('invokes createAdminProfile with input value when save button is clicked', async () => {
            await act(async () => render(<Admin />));

            const displayNameInput = screen.getByLabelText('Display Name');
            const saveButton = screen.getByText('Save');

            userEvent.clear(displayNameInput);
            await userEvent.type(displayNameInput, 'newDisplayName');
            fireEvent.click(saveButton);

            expect(displayNameInput).toHaveValue('newDisplayName')
            expect(mockGraphql).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: 'createAdminProfileQuery',
                    variables: {
                        input: {
                            displayName: "newDisplayName",
                            id: "testUserId-123"
                        }
                    }
                })
            );
        })
    })

    describe('when existing user', () => {
        beforeEach(() => {
            mockGraphql.mockResolvedValue({ data: { getAdminProfile: { displayName: 'usersDisplayName'} } })
        })

        it('displays displayname when user logs in', async () => {
            await act(async () => render(<Admin />));
            expect(screen.getByText('Hello usersDisplayName')).toBeInTheDocument()
        })

        it('invokes updateAdminProfile with input value when save button is clicked', async () => {
            await act(async () => render(<Admin />));

            const displayNameInput = screen.getByLabelText('Display Name');
            const saveButton = screen.getByText('Save');

            userEvent.clear(displayNameInput);
            await userEvent.type(displayNameInput, 'newDisplayName');
            fireEvent.click(saveButton);

            expect(displayNameInput).toHaveValue('newDisplayName')
            expect(mockGraphql).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: 'updateAdminProfileQuery',
                    variables: {
                        input: {
                            displayName: "newDisplayName",
                            id: "testUserId-123"
                        }
                    }
                })
            );
        })
    })
})
