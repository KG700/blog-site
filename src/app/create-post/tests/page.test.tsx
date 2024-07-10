import CreatePost from '../page';
import { render, screen, act, fireEvent } from '@testing-library/react';
import * as api from "aws-amplify/api";
import '@testing-library/jest-dom';

jest.mock("aws-amplify/storage");
jest.mock('aws-amplify/api');
jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue('68ce0934'),
}));
jest.mock('@aws-amplify/ui-react', () => ({
    withAuthenticator: (Component: any) => (props: any) => <Component {...props} />
  }));
  jest.mock('../../utils/amplifyServerUtils', () => {
    return {
        runWithAmplifyServerContext: jest.fn().mockReturnValue({ url: 'data:image/png;base64,iVBORw0KG' })
    }
});

jest.mock('next/navigation', () => ({
    useRouter: jest.fn().mockReturnValue({ push: jest.fn() })
}));

jest.mock('../../../graphql/mutations', () => {
    return {
        createPost: 'createBlogPostQuery'
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

describe('create-post', () => {
    const mockGraphql = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        jest.setSystemTime(new Date(Date.UTC(2024, 6, 15, 10, 8)));
        jest.spyOn(api, 'generateClient').mockReturnValue({ graphql: mockGraphql });
    })

    it('renders buttons correctly', async () => {
        await act(async () => render(<CreatePost />))

        expect(screen.queryByText(/Upload Image/)).toBeInTheDocument();
        expect(screen.queryByText(/Save/)).toBeInTheDocument();
        expect(screen.queryByText(/Publish/)).toBeInTheDocument();
    });

    it('renders input fields correctly', async () => {
        await act(async () => render(<CreatePost />))

        expect(screen.queryByLabelText(/Author/)).toBeInTheDocument();
        expect(screen.queryByLabelText(/Title/)).toBeInTheDocument();
        expect(screen.queryByLabelText(/Summary/)).toBeInTheDocument();
        expect(screen.queryByTestId('blog-content')).toBeInTheDocument();
    });

    it('handles author changes correctly', async () => {
        await act(async () => render(<CreatePost />))

        const authorInput = screen.getByLabelText(/Author/);
        fireEvent.change(authorInput, { target: { value: 'Joe Blogs' }});

        expect(authorInput.value).toEqual('Joe Blogs');
    });

    it('handles title changes correctly', async () => {
        await act(async () => render(<CreatePost />))

        const titleInput = screen.getByLabelText(/Title/);
        fireEvent.change(titleInput, { target: { value: 'A Blog' }});

        expect(titleInput.value).toEqual('A Blog');
    });

    it('triggers upload image when upload image button is pressed', async () => {
        await act(async () => render(<CreatePost />))

        const uploadImageButton = screen.getByText(/Upload Image/);
        const fileInput = screen.getByTestId('file-input');

        fireEvent.click(uploadImageButton);

        expect(fileInput).toBeInTheDocument();
    });

    it('displays image when file upload triggered', async () => {
        const mockImage = new File(['blog image'], 'blog-image.png')

        await act(async () => render(<CreatePost />))

        const fileInput = screen.getByTestId('file-input');

        expect(screen.queryByAltText('blog image')).not.toBeInTheDocument();
        fireEvent.change(fileInput, { target: { files: [mockImage] } })

        expect(screen.queryByAltText('blog image')).toBeInTheDocument();
    });

    describe('when save button pressed', () => {
        it('does not save if blog does not have title', async () => {
            const mockImage = new File(['blog image'], 'blog-image.png')

            await act(async () => render(<CreatePost />))

            const authorInput = screen.getByLabelText(/Author/);
            const fileInput = screen.getByTestId('file-input');
            const blogContent = screen.getByTestId('blog-content');
            const saveButton = screen.getByText(/Save/);

            await act(async () => {
                fireEvent.change(authorInput, { target: { value: 'Joe Blogs' } });
                fireEvent.change(fileInput, { target: { files: [mockImage] } })
                fireEvent.change(blogContent, { target: { value: 'Some blog content' } });
                fireEvent.click(saveButton);
            });

            expect(mockGraphql).not.toHaveBeenCalled()
        })

        it('does not save if blog does not have content', async () => {
            const mockImage = new File(['blog image'], 'blog-image.png')

            await act(async () => render(<CreatePost />))

            const titleInput = screen.getByLabelText(/Title/);
            const authorInput = screen.getByLabelText(/Author/);
            const fileInput = screen.getByTestId('file-input');
            const saveButton = screen.getByText(/Save/);

            await act(async () => {
                fireEvent.change(titleInput, { target: { value: 'Blog title' } });
                fireEvent.change(authorInput, { target: { value: 'Joe Blogs' } });
                fireEvent.change(fileInput, { target: { files: [mockImage] } })
                fireEvent.click(saveButton);
            });

            expect(mockGraphql).not.toHaveBeenCalledWith();
        });

        it('saves post correctly when only title and content provided', async () => {
            await act(async () => render(<CreatePost />))

            const titleInput = screen.getByLabelText(/Title/);
            const blogContent = screen.getByTestId('blog-content');
            const saveButton = screen.getByText(/Save/);

            await act(async () => {
                fireEvent.change(titleInput, { target: { value: 'Blog title' } });
                fireEvent.change(blogContent, { target: { value: 'Some blog content' } });
                fireEvent.click(saveButton);
            });

            expect(mockGraphql).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: 'createBlogPostQuery',
                    variables: {
                        input: expect.objectContaining({
                            author: "",
                            content: 'Some blog content',
                            coverImage: null,
                            status: "Draft",
                            title: "Blog title"
                        })
                    }
                })
            );
        });

        it('saves post correctly with all fields', async () => {
            const mockImage = new File(['blog image'], 'blog-image.png')

            await act(async () => render(<CreatePost />))

            const titleInput = screen.getByLabelText(/Title/);
            const authorInput = screen.getByLabelText(/Author/);
            const fileInput = screen.getByTestId('file-input');
            const blogContent = screen.getByTestId('blog-content');
            const saveButton = screen.getByText(/Save/);

            await act(async () => {
                fireEvent.change(titleInput, { target: { value: 'Blog title' } });
                fireEvent.change(authorInput, { target: { value: 'Joe Blogs' } });
                fireEvent.change(fileInput, { target: { files: [mockImage] } })
                fireEvent.change(blogContent, { target: { value: 'Some blog content' } });
                fireEvent.click(saveButton);
            });

            expect(mockGraphql).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: 'createBlogPostQuery',
                    variables: {
                        input: expect.objectContaining({
                            author: "Joe Blogs",
                            content: 'Some blog content',
                            coverImage: 'blog-image.png_68ce0934',
                            status: "Draft",
                            title: "Blog title"
                        })
                    }
                })
            );
        });
    })

    describe('when publish button pressed', () => {
        it('does not publish if blog does not have title', async () => {
            const mockImage = new File(['blog image'], 'blog-image.png')

            await act(async () => render(<CreatePost />))

            const authorInput = screen.getByLabelText(/Author/);
            const fileInput = screen.getByTestId('file-input');
            const blogContent = screen.getByTestId('blog-content');
            const publishButton = screen.getByText(/Publish/);

            await act(async () => {
                fireEvent.change(authorInput, { target: { value: 'Joe Blogs' } });
                fireEvent.change(fileInput, { target: { files: [mockImage] } })
                fireEvent.change(blogContent, { target: { value: 'Some blog content' } });
                fireEvent.click(publishButton);
            });

            expect(mockGraphql).not.toHaveBeenCalled()
        })

        it('does not save if blog does not have content', async () => {
            const mockImage = new File(['blog image'], 'blog-image.png')

            await act(async () => render(<CreatePost />))

            const titleInput = screen.getByLabelText(/Title/);
            const authorInput = screen.getByLabelText(/Author/);
            const fileInput = screen.getByTestId('file-input');
            const publishButton = screen.getByText(/Publish/);

            await act(async () => {
                fireEvent.change(titleInput, { target: { value: 'Blog title' } });
                fireEvent.change(authorInput, { target: { value: 'Joe Blogs' } });
                fireEvent.change(fileInput, { target: { files: [mockImage] } })
                fireEvent.click(publishButton);
            });

            expect(mockGraphql).not.toHaveBeenCalledWith();
        });

        it('saves post correctly when only title and content provided', async () => {
            await act(async () => render(<CreatePost />))

            const titleInput = screen.getByLabelText(/Title/);
            const blogContent = screen.getByTestId('blog-content');
            const publishButton = screen.getByText(/Publish/);

            await act(async () => {
                fireEvent.change(titleInput, { target: { value: 'Blog title' } });
                fireEvent.change(blogContent, { target: { value: 'Some blog content' } });
                fireEvent.click(publishButton);
            });

            expect(mockGraphql).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: 'createBlogPostQuery',
                    variables: {
                        input: expect.objectContaining({
                            author: "",
                            content: 'Some blog content',
                            coverImage: null,
                            status: "Published",
                            title: "Blog title",
                            publishedAt: new Date().toISOString()
                        })
                    }
                })
            );
        });

        it('saves post correctly with all fields', async () => {
            const mockImage = new File(['blog image'], 'blog-image.png')

            await act(async () => render(<CreatePost />))

            const titleInput = screen.getByLabelText(/Title/);
            const authorInput = screen.getByLabelText(/Author/);
            const fileInput = screen.getByTestId('file-input');
            const blogContent = screen.getByTestId('blog-content');
            const publishButton = screen.getByText(/Publish/);

            await act(async () => {
                fireEvent.change(titleInput, { target: { value: 'Blog title' } });
                fireEvent.change(authorInput, { target: { value: 'Joe Blogs' } });
                fireEvent.change(fileInput, { target: { files: [mockImage] } })
                fireEvent.change(blogContent, { target: { value: 'Some blog content' } });
                fireEvent.click(publishButton);
            });

            expect(mockGraphql).toHaveBeenCalledWith(
                expect.objectContaining({
                    query: 'createBlogPostQuery',
                    variables: {
                        input: expect.objectContaining({
                            author: "Joe Blogs",
                            content: 'Some blog content',
                            coverImage: 'blog-image.png_68ce0934',
                            status: "Published",
                            title: "Blog title",
                            publishedAt: new Date().toISOString()
                        })
                    }
                })
            );
        });
    })
})
