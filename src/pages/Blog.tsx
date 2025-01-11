import { useEffect } from "react";
import { Link } from "react-router-dom";
import Advertisement from "@/components/Advertisement";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Evolution of Movie Streaming: From DVDs to Digital Downloads",
    excerpt: "Explore the transformation of how we consume movies, from physical media to the convenience of digital downloads.",
    content: `The way we watch movies has undergone a dramatic transformation over the past few decades. From the early days of VHS tapes to DVDs, and now to digital downloads, the evolution of movie consumption has been remarkable. Today's digital platforms offer unprecedented convenience, allowing movie enthusiasts to build their personal collections without physical storage concerns.

    The rise of digital downloads has revolutionized movie accessibility, offering instant gratification and eliminating the need for physical storage space. This shift has not only changed how we consume content but has also impacted the film industry's distribution models. High-quality digital copies now provide an experience that rivals traditional formats while offering the convenience of portability and instant access.

    As we look to the future, the trend towards digital movie collections continues to grow. With improved internet speeds and storage solutions, downloading movies has become more practical than ever. This digital revolution has democratized movie access, allowing film enthusiasts worldwide to build extensive collections without the limitations of physical media.`,
    date: "2024-01-09",
    slug: "evolution-of-movie-streaming"
  },
  {
    id: 2,
    title: "Top 10 Must-Download Movies of 2023",
    excerpt: "A curated list of the year's most impactful and entertaining films that deserve a spot in your digital collection.",
    content: `2023 has been an exceptional year for cinema, delivering groundbreaking films across various genres. From stunning visual spectacles to intimate character studies, this year's releases have set new standards in filmmaking. Our carefully curated list highlights the must-have downloads that will enhance any movie collection.

    These films represent the best of what cinema has to offer, combining artistic merit with entertainment value. Each selection has been chosen based on critical acclaim, audience reception, and lasting impact on the medium. Whether you're a casual viewer or a serious film buff, these movies deserve a place in your digital library.

    The diversity of this year's standout films reflects the evolving landscape of modern cinema. From independent gems to blockbuster hits, these movies showcase the incredible range of storytelling possibilities in contemporary filmmaking. Adding these titles to your collection ensures you have access to some of the year's most significant cinematic achievements.`,
    date: "2024-01-08",
    slug: "must-download-movies-2023"
  },
  {
    id: 3,
    title: "The Art of Building a Digital Movie Collection",
    excerpt: "Essential tips and strategies for curating your perfect digital movie library.",
    content: `Creating a well-curated digital movie collection is both an art and a science. From organizing your files to choosing the right formats, building a digital library requires careful consideration and planning. This guide will help you develop a collection that's both comprehensive and manageable.

    Organization is key when managing a digital movie collection. Implementing a consistent naming convention and folder structure can make navigation effortless. Additionally, choosing the right file formats and quality settings ensures your collection maintains high standards while remaining accessible across different devices.

    The beauty of digital collections lies in their flexibility and scalability. Unlike physical media, digital libraries can grow indefinitely without taking up physical space. This guide explores best practices for backup solutions, metadata management, and collection organization to help you build and maintain the perfect digital movie library.`,
    date: "2024-01-07",
    slug: "building-digital-movie-collection"
  },
  {
    id: 4,
    title: "Understanding Movie File Formats and Quality",
    excerpt: "A comprehensive guide to video formats, compression, and quality considerations for movie downloads.",
    content: `Navigating the world of digital video formats can be overwhelming. From codecs to container formats, understanding the technical aspects of digital movies is crucial for building a high-quality collection. This guide breaks down the essential knowledge needed to make informed decisions about your downloads.

    Video quality is determined by various factors, including resolution, bitrate, and compression methods. Learning to balance these elements helps ensure optimal viewing experiences while managing storage space effectively. We'll explore the differences between common formats and their impact on video quality.

    Modern video formats offer incredible efficiency without compromising quality. Whether you're prioritizing compatibility, quality, or file size, understanding these technical aspects helps you make the best choices for your collection. This knowledge is essential for anyone serious about building a premium digital movie library.`,
    date: "2024-01-06",
    slug: "movie-file-formats-guide"
  },
  {
    id: 5,
    title: "Legal and Ethical Considerations in Movie Downloads",
    excerpt: "Understanding the importance of legal downloads and supporting the film industry.",
    content: `In the digital age, it's crucial to understand the legal and ethical aspects of movie downloads. Supporting the film industry through legitimate channels ensures its continued growth and ability to produce quality content. This article explores the importance of legal downloading and its impact on the movie industry.

    Legal download platforms provide numerous benefits, including guaranteed quality, reliable downloads, and proper compensation for creators. Understanding copyright laws and digital rights helps consumers make informed decisions while supporting the industry they love. We'll examine the various legal options available for building your movie collection.

    The future of cinema depends on maintaining a sustainable ecosystem where creators are fairly compensated. By choosing legal download options, viewers contribute to the industry's health while enjoying high-quality, reliable content. This guide helps navigate the ethical considerations of digital movie consumption.`,
    date: "2024-01-05",
    slug: "legal-movie-downloads-guide"
  }
];

const Blog = () => {
  useEffect(() => {
    document.title = "MovieDownloads - Blog";
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Movie Download Blog</h1>
      <Advertisement />
      
      <div className="grid gap-8 mt-8">
        {blogPosts.map((post) => (
          <article key={post.id} className="bg-secondary/50 rounded-lg p-6 hover:bg-secondary/70 transition-colors">
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-400 mb-2">{post.date}</p>
            <p className="text-gray-300 mb-4">{post.excerpt}</p>
            <div className="prose prose-invert max-w-none">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph.trim()}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
      
      <Advertisement />
    </div>
  );
};

export default Blog;