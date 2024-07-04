import BlogDetails from "../blog-details";
import { render, screen } from '@testing-library/react';
import { getDisplayDate } from '../../utils/getDisplayDate';
import '@testing-library/jest-dom';

jest.mock("next/image");
jest.mock('../../utils/getDisplayDate')
getDisplayDate.mockImplementation((date: string) => `Mocked Date: ${date}`);

describe('blog-details', () => {
    it('renders with required props', () => {
        render(<BlogDetails author="Joe Blogs" />)

        const authorElement = screen.getByText('By Joe Blogs');
        expect(authorElement).toBeInTheDocument();
    });

    it('renders publishedAt if provided in props', () => {
        render(<BlogDetails author="Joe Blogs" publishedAt='30 Jun 2024' />)

        const publishedAtElement = screen.queryByText('Published: Mocked Date: 30 Jun 2024');
        expect(publishedAtElement).toBeInTheDocument();
    });

    it('does not render publishedAt if not provided in props', () => {
        render(<BlogDetails author="Joe Blogs" />);

        const publishedAtElement = screen.queryByText('Published: Mocked Date: 30 Jun 2024');
        expect(publishedAtElement).not.toBeInTheDocument();
    });

    it('renders lastUpdatedAt if provided in props', () => {
        render(<BlogDetails author="Joe Blogs" lastUpdatedAt='1 Jul 2024' />)

        const publishedAtElement = screen.queryByText('Last updated: Mocked Date: 1 Jul 2024');
        expect(publishedAtElement).toBeInTheDocument();
    });

    it('does not render lastUpdatedAt if not provided in props', () => {
        render(<BlogDetails author="Joe Blogs" />)

        const publishedAtElement = screen.queryByText('Last updated: Mocked Date: 1 Jul 2024');
        expect(publishedAtElement).not.toBeInTheDocument();
    });
})
