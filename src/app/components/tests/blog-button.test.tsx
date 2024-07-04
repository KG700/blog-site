import BlogButton from "../blog-button";
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('blog-button', () => {
    it('renders with primary classes when type prop is primary', () => {
        render(
            <BlogButton
                type='primary'
                label='Test button'
                onClickFn={() => {}}
            />)

        const button = screen.getByText('Test button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('bg-gradient-to-br from-yellow to-green');
    });

    it('renders with secondary classes when type prop is secondary', () => {
        render(
            <BlogButton
                type='secondary'
                label='Test button'
                onClickFn={() => {}}
            />)

        const button = screen.getByText('Test button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('bg-gradient-to-br from-light-blue to-purple');
    });

    it('renders with warning classes when type prop is warning', () => {
        render(
            <BlogButton
                type='warning'
                label='Test button'
                onClickFn={() => {}}
            />)

        const button = screen.getByText('Test button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('bg-gradient-to-br from-light-blue to-red');
    });

    it('invokes onclick function when button is clicked', () => {
        const mockOnClickFn = jest.fn();
        render(
            <BlogButton
                type='warning'
                label='Test button'
                onClickFn={mockOnClickFn}
            />)

        const button = screen.getByText('Test button');
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        expect(mockOnClickFn).toHaveBeenCalled();
    });
})
