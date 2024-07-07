import EditPost from '../page';
import { render, screen, act, fireEvent } from '@testing-library/react';
import * as api from "aws-amplify/api";
import * as router from "next/navigation";
import '@testing-library/jest-dom';

jest.mock("aws-amplify/storage");
jest.mock('aws-amplify/api');
jest.mock('next/navigation');
jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue('68ce0934'),
}));
jest.mock('@aws-amplify/ui-react', () => ({
    withAuthenticator: (Component: any) => (props: any) => <Component {...props} />
}));
jest.mock('../../../utils/amplifyServerUtils', () => jest.fn());
jest.mock('../../../../graphql/mutations', () => {
    return {
        updatePost: 'updateBlogPostQuery',
    }
});

jest.mock('../../../../graphql/queries', () => {
    return {
        assistWithSummary: 'assistWithSummaryQuery'
    }
});

global.URL.createObjectURL = jest.fn(() => 'blob:http://example.com/68806f85-d2d7-49a6-b889-6d4d1d273102');

// eslint-disable-next-line react/display-name
jest.mock('next/dynamic', () => () => ({ value, onChange }: { value: string, onChange: (value: string) => {}}) => {
    return (
        <textarea
            data-testid="blog-content"
            value={value}
            onChange={e => onChange(e.target.value)}
        />
    );
});

describe('edit-post', () => {
    const mockGraphql = jest.fn();
    const mockRouterPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        jest.setSystemTime(new Date(Date.UTC(2024, 6, 15, 10, 8)));
        jest.spyOn(api, 'generateClient').mockReturnValue({ graphql: mockGraphql });
        jest.spyOn(router, 'useRouter').mockReturnValue({ push: mockRouterPush });
        mockGraphql.mockResolvedValue({ data: { getPost: {
            author: 'Joe Blogs',
            title: 'A Blog',
            summary: 'This is a short summary about this blog.',
            coverImageUrl: 'mock-cover-image.jpg',
            content: 'This is the main content of the blog.',
            updatedAt: new Date()
        }}});
    })

    afterAll(() => {
        jest.useRealTimers();
    });

    it('renders buttons correctly', async () => {
        await act(async () => render(<EditPost params={{ id: '68ce0934' }} />))

        expect(screen.queryByText(/Upload Image/)).toBeInTheDocument();
        expect(screen.queryByText(/Save/)).toBeInTheDocument();
        expect(screen.queryByText(/Publish/)).toBeInTheDocument();
        expect(screen.queryByText(/Assistant Summary/)).toBeInTheDocument();
    });

    it('renders input fields correctly with correct initial values', async () => {
        await act(async () => render(<EditPost params={{ id: '68ce0934' }} />))

        const authorInput = screen.queryByLabelText(/Author/)
        expect(authorInput).toBeInTheDocument();
        expect(authorInput.value).toEqual('Joe Blogs');

        const titleInput = screen.queryByLabelText(/Title/)
        expect(titleInput).toBeInTheDocument();
        expect(titleInput.value).toEqual('A Blog');

        const summaryInput = screen.queryByLabelText(/Summary/)
        expect(summaryInput).toBeInTheDocument();
        expect(summaryInput.value).toEqual('This is a short summary about this blog.');

        const contentInput = screen.queryByTestId('blog-content')
        expect(contentInput).toBeInTheDocument();
        expect(contentInput.value).toEqual('This is the main content of the blog.');

        expect(screen.queryByText('Last updated: today at 11:08')).toBeInTheDocument()
    });

    it('handles author changes correctly', async () => {
        await act(async () => render(<EditPost params={{ id: '68ce0934' }} />))

        const authorInput = screen.getByLabelText(/Author/);
        fireEvent.change(authorInput, { target: { value: 'Jimmy Blogs' }});

        expect(authorInput.value).toEqual('Jimmy Blogs');
    });

    it('handles title changes correctly', async () => {
        await act(async () => render(<EditPost params={{ id: '68ce0934' }} />))

        const titleInput = screen.getByLabelText(/Title/);
        fireEvent.change(titleInput, { target: { value: 'An Interesting Blog' }});

        expect(titleInput.value).toEqual('An Interesting Blog');
    });

    it('triggers upload image when upload image button is pressed', async () => {
        await act(async () => render(<EditPost params={{ id: '68ce0934' }} />))

        const uploadImageButton = screen.getByText(/Upload Image/);
        const fileInput = screen.getByTestId('file-input');

        fireEvent.click(uploadImageButton);

        expect(fileInput).toBeInTheDocument();
    });

    it('displays image when file upload triggered', async () => {
        const mockImage = new File(['blog image'], 'blog-image.png')

        await act(async () => render(<EditPost params={{ id: '68ce0934' }} />))

        const fileInput = screen.getByTestId('file-input');

        fireEvent.change(fileInput, { target: { files: [mockImage] } })

        expect(screen.queryByAltText('blog image')).toBeInTheDocument();
    });

    it('calls the assistantSummary query when Assistant Summary button is pressed', async () => {
        await act(async () => render(<EditPost params={{ id: '68ce0934' }} />))

        const assistantSummaryButton = screen.getByText(/Assistant Summary/);

        await act(async () => {
            fireEvent.click(assistantSummaryButton);
        });

        expect(mockGraphql).toHaveBeenCalledWith(
            expect.objectContaining({
                query: 'assistWithSummaryQuery'
            })
        );

    })

    describe('when save button is pressed', () => {
        it('does not save if blog does not have title', async () => {
            await act(async () => render(<EditPost params={{ id: '68ce0934' }} />))

            const titleInput = screen.getByLabelText(/Title/);
            const saveButton = screen.getByText(/Save/);

            await act(async () => {
                fireEvent.change(titleInput, { target: { value: null } });
                fireEvent.click(saveButton);
            });

            expect(mockGraphql).not.toHaveBeenCalledWith(
                expect.objectContaining({
                    query: 'updateBlogPostQuery'
                })
            )
        })

        it('does not save if blog does not have content', async () => {
            await act(async () => render(<EditPost params={{ id: '68ce0934' }} />))

            const contentInput = screen.queryByTestId('blog-content')
            const saveButton = screen.getByText(/Save/);

            await act(async () => {
                fireEvent.change(contentInput, { target: { value: '' } });
                fireEvent.click(saveButton);
            });

            expect(mockGraphql).not.toHaveBeenCalledWith(
                expect.objectContaining({
                    query: 'updateBlogPostQuery'
                })
            )
        });

        it('saves post correctly when only title and content provided', async () => {
            await act(async () => render(<EditPost params={{ id: '68ce0934' }} />))

            const authorInput = screen.getByLabelText(/Author/);
            const summaryInput = screen.queryByLabelText(/Summary/)
            const saveButton = screen.getByText(/Save/);

            await act(async () => {
                fireEvent.change(authorInput, { target: { value: '' } });
                fireEvent.change(summaryInput, { target: { value: '' } });
                fireEvent.click(saveButton);
            });

            expect(mockGraphql).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: 'updateBlogPostQuery',
                    variables: {
                        input: expect.objectContaining({
                            author: "",
                            summary: "",
                            content: 'This is the main content of the blog.',
                            status: "Draft",
                            title: "A Blog"
                        })
                    }
                })
            );
        });

        it('saves post correctly with all fields', async () => {
            await act(async () => render(<EditPost params={{ id: '68ce0934' }} />))

            await act(async () => {
                const saveButton = screen.getByText(/Save/);
                fireEvent.click(saveButton);
            });

            expect(mockGraphql).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: 'updateBlogPostQuery',
                    variables: {
                        input: expect.objectContaining({
                            author: "Joe Blogs",
                            title: "A Blog",
                            summary: 'This is a short summary about this blog.',
                            content: 'This is the main content of the blog.',
                            coverImageUrl: 'mock-cover-image.jpg',
                            status: "Draft"
                        })
                    }
                })
            );
        });
    })

    describe('when publish button pressed', () => {
        it('does not publish if blog does not have title', async () => {
            await act(async () => render(<EditPost params={{ id: '68ce0934' }} />))

            const titleInput = screen.getByLabelText(/Title/);
            const publishButton = screen.getByText(/Publish/);

            await act(async () => {
                fireEvent.change(titleInput, { target: { value: '' } });
                fireEvent.click(publishButton);
            });

            expect(mockGraphql).not.toHaveBeenCalledWith(
                expect.objectContaining({
                    query: 'updateBlogPostQuery'
                })
            )
            expect(mockRouterPush).not.toHaveBeenCalledWith('/posts/68ce0934');
        })

        it('does not save if blog does not have content', async () => {
            await act(async () => render(<EditPost params={{ id: '68ce0934' }} />))

            const contentInput = screen.queryByTestId('blog-content')
            const publishButton = screen.getByText(/Publish/);

            await act(async () => {
                fireEvent.change(contentInput, { target: { value: '' } });
                fireEvent.click(publishButton);
            });

            expect(mockGraphql).not.toHaveBeenCalledWith(
                expect.objectContaining({
                    query: 'updateBlogPostQuery'
                })
            );
            expect(mockRouterPush).not.toHaveBeenCalledWith('/posts/68ce0934');
        });

        it('saves post correctly when only title and content provided', async () => {
            await act(async () => render(<EditPost params={{ id: '68ce0934' }} />))

            const authorInput = screen.getByLabelText(/Author/);
            const summaryInput = screen.queryByLabelText(/Summary/)
            const publishButton = screen.getByText(/Publish/);

            await act(async () => {
                fireEvent.change(authorInput, { target: { value: '' } });
                fireEvent.change(summaryInput, { target: { value: '' } });
                fireEvent.click(publishButton);
            });

            expect(mockGraphql).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: 'updateBlogPostQuery',
                    variables: {
                        input: expect.objectContaining({
                            author: "",
                            summary: "",
                            content: 'This is the main content of the blog.',
                            status: "Published",
                            title: "A Blog"
                        })
                    }
                })
            );
            expect(mockRouterPush).toHaveBeenCalledWith('/posts/68ce0934');
        });

        it('saves post correctly with all fields', async () => {
            await act(async () => render(<EditPost params={{ id: '68ce0934' }} />))

            const publishButton = screen.getByText(/Publish/);

            await act(async () => {
                fireEvent.click(publishButton);
            });

            expect(mockGraphql).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: 'updateBlogPostQuery',
                    variables: {
                        input: expect.objectContaining({
                            author: "Joe Blogs",
                            title: "A Blog",
                            summary: 'This is a short summary about this blog.',
                            content: 'This is the main content of the blog.',
                            status: "Published",
                        })
                    }
                })
            );
            expect(mockRouterPush).toHaveBeenCalledWith('/posts/68ce0934');
        });
    })
})
