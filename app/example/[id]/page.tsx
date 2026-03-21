import React from "react";
import { notFound } from "next/navigation";
import { generateSEO, absoluteUrl } from "@/lib/seo";
import { generateArticleSchema, generateBreadcrumbList } from "@/lib/schema";
import { getPostById, getAllPostIds } from "@/lib/exampleData";
import Container from '@components/common/Container';
import Section from '@components/common/Section';

type Props = { params: { id: string } };

export async function generateStaticParams() {
  return getAllPostIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props) {
  const post = getPostById(params.id);
  if (!post) return generateSEO({ title: "Not found", path: `/example/${params.id}` });

  return generateSEO({
    title: post.title,
    description: post.summary,
    path: `/example/${params.id}`,
    image: post.image,
    keywords: ["example", "static", "seo"],
  });
}

export default function Page({ params }: Props) {
  const post = getPostById(params.id);
  if (!post) notFound();

  const articleSchema = generateArticleSchema({
    url: absoluteUrl(`/example/${post.id}`),
    headline: post.title,
    datePublished: post.updatedAt,
  });

  const breadcrumb = generateBreadcrumbList([
    { name: "Home", url: absoluteUrl("/") },
    { name: "Examples", url: absoluteUrl(`/example`) },
    { name: post.title, url: absoluteUrl(`/example/${post.id}`) },
  ]);

  return (
    <Container>
      <Section>
        <main className="prose lg:prose-lg mx-auto py-6 text-gray-700">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">{post.title}</h1>
          <p className="text-sm text-gray-500">Updated: {new Date(post.updatedAt || "").toDateString()}</p>
          <p className="text-gray-700 leading-relaxed mt-2">{post.summary}</p>
          <article className="mt-4" dangerouslySetInnerHTML={{ __html: post.content || "" }} />

          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, breadcrumb]) }} />
        </main>
      </Section>
    </Container>
  );
}
