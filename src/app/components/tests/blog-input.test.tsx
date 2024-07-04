import BlogInput from '../../components/blog-input';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'

describe('blog-input', () => {
    it('renders with optional props', () => {
        render(
            <BlogInput
                name='test-input'
                label='testInput'
                value='Test value'
                placeholder='Test placeholder'
                width='full'
                isBoldFont={false}
                onChange={() => {}}
            />
        )
        const labelElement = screen.getByText('testInput');
        const inputElement = screen.getByRole('textbox');

        expect(labelElement).toBeInTheDocument();
        expect(inputElement).toHaveValue('Test value');
        expect(inputElement).toHaveAttribute('placeholder', 'Test placeholder');
        expect(inputElement).toHaveClass('w-full');
    });

    it('invokes onchange prop when input value changes', async () => {
        const mockOnChange = jest.fn()
        render(
            <BlogInput
                name='test-input'
                onChange={mockOnChange}
            />
        )


        const inputElement = screen.getByRole('textbox');
        fireEvent.change(inputElement, { target: { value: 'new value' } });

        expect(mockOnChange).toHaveBeenCalled();

    });

    it('applies the correct class name based on the width prop', () => {
        const { rerender } = render(
            <BlogInput
                name="testName"
                onChange={() => {}}
                width="short"
            />
        );
        let inputElement = screen.getByRole('textbox');
        expect(inputElement).toHaveClass('w-1/3');

        rerender(
            <BlogInput
                name="testName"
                onChange={() => {}}
                width="medium"
            />
        );
        inputElement = screen.getByRole('textbox');
        expect(inputElement).toHaveClass('w-2/3');

        rerender(
            <BlogInput
                name="testName"
                onChange={() => {}}
                width="full"
            />
        );
        inputElement = screen.getByRole('textbox');
        expect(inputElement).toHaveClass('w-full');
    });

    it('applies bold font class when isBoldFont is true', () => {
        const { rerender } = render(
            <BlogInput
                name='testName'
                onChange={() => {}}
                isBoldFont={true}
            />
        )
        let inputElement = screen.getByRole('textbox');
        expect(inputElement).toHaveClass('font-bold');

        rerender(
            <BlogInput
                name='testName'
                onChange={() => {}}
                isBoldFont={false}
            />
        )
        inputElement = screen.getByRole('textbox');
        expect(inputElement).not.toHaveClass('font-bold');
    });
})
