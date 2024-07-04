import BlogSummary from "../blog-summary";
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('blog-summary', () => {
    it('renders the textarea and zero character count', () => {
        render(<BlogSummary onChange={() => {}} />);

        const input = screen.getByPlaceholderText('Enter a blog summary');
        expect(input).toBeInTheDocument();

        const characterCount = screen.queryByText('0/1000');
        expect(characterCount).toBeInTheDocument();
    });

    it('calls onChange when input value changes', () => {
        const mockOnChangeFn = jest.fn();
        render(<BlogSummary onChange={mockOnChangeFn} />);

        const input = screen.getByPlaceholderText('Enter a blog summary');
        expect(input).toBeInTheDocument();

        fireEvent.change(input, { target: { value: 'new summary text' }})
        expect(mockOnChangeFn).toHaveBeenCalled();
    });

    it('updates character count when typing in textarea', () => {
        render(<BlogSummary onChange={() => {}} />);

        const input = screen.getByPlaceholderText('Enter a blog summary');
        expect(input).toBeInTheDocument();

        fireEvent.change(input, { target: { value: 'new summary text' }})

        const characterCount = screen.queryByText('16/1000');
        expect(characterCount).toBeInTheDocument();
    });

    it('displays correct initial value in textarea with correct character count', () => {
        render(<BlogSummary value='initial summary value' onChange={() => {}} />);

        const characterCount = screen.queryByText('21/1000');
        expect(characterCount).toBeInTheDocument();
    });
})
