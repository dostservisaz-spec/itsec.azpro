import React, { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';

const BlogPage = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*, author:profiles(full_name)')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBlogs(data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const getLocalizedContent = (item: any, field: string) => {
    return item[`${field}_${language}`] || item[`${field}_az`] || '';
  };

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Bloq</h1>
        <p className="text-muted-foreground text-center mb-12">
          Təhlükəsizlik sistemləri haqqında ən son yeniliklər və məqalələr
        </p>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-xl border bg-card p-4 space-y-4 animate-pulse">
                <div className="h-48 bg-muted rounded-lg w-full"></div>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
            <h3 className="text-lg font-medium">Hələlik məqalə yoxdur</h3>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <article key={blog.id} className="group rounded-xl border bg-card overflow-hidden transition-shadow hover:shadow-md flex flex-col">
                {blog.image_url && (
                  <Link to={`/blog/${blog.id}`} className="aspect-video overflow-hidden">
                    <img 
                      src={blog.image_url} 
                      alt={getLocalizedContent(blog, 'title')} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center text-sm text-muted-foreground mb-3 gap-4">
                    <span>{format(new Date(blog.created_at), 'dd.MM.yyyy')}</span>
                    {blog.author?.full_name && <span>• {blog.author.full_name}</span>}
                  </div>
                  <Link to={`/blog/${blog.id}`}>
                    <h2 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {getLocalizedContent(blog, 'title')}
                    </h2>
                  </Link>
                  <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                    {getLocalizedContent(blog, 'content').replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                  </p>
                  <Link to={`/blog/${blog.id}`} className="text-primary font-medium text-sm inline-flex items-center">
                    Ətraflı oxu
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
