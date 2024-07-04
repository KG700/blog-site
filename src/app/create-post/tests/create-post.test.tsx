import CreatePost from '../page';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('@aws-amplify/ui-react', () => ({
    withAuthenticator: (Component: any) => (props: any) => <Component {...props} />
  }));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}));

describe('create-post', () => {
    it('renders correctly with required elements', async () => {
        await act(async () => render(<CreatePost />))

        expect(screen.getByLabelText('Author')).toBeInTheDocument();
        // TODO add other elements here that should be rendered in dom
    });

    xit('handles author changes correctly', () => {});
    xit('handles title changes correctly', () => {});
    xit('triggers upload image when upload image button is pressed', () => {});
    xit('displays image when file upload triggered', () => {});
    xit('saves post correctly when save button pressed', () => {});
    xit('publishes post correctly when publish button pressed', () => {});
})
