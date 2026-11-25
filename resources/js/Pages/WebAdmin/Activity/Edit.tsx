import BlogPostForm from '@/Components/BlogPostForm';

export default function Edit({ activity }: { activity: any }) {
    return <BlogPostForm type="activity" item={activity} />;
}
