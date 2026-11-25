import BlogPostForm from '@/Components/BlogPostForm';

export default function Edit({ newsItem }: { newsItem: any }) {
    return <BlogPostForm type="news" item={newsItem} />;
}
