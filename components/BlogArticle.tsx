import Link from 'next/link';
import type { Post } from '@/lib/blog';

export default function BlogArticle({ post }: { post: Post }) {
  const article = post.article;
  if (!article) return <>{post.body.map((p, i) => <p key={i} className={i === 0 ? 'text-lg leading-relaxed text-ink/85' : ''}>{p}</p>)}</>;
  return <>
    <p className="text-lg leading-relaxed text-ink/85">{article.intro}</p>
    {post.image && <p className="text-xs text-ink/60">Header image: AI-generated design inspiration, not a completed customer project.</p>}
    {article.sections.map((section, i) => <section key={section.heading}>
      <h2>{section.heading}</h2>
      {section.paragraphs.map(p => <p key={p}>{p}</p>)}
      {!!section.bullets.length && <ul>{section.bullets.map(p => <li key={p}>{p}</li>)}</ul>}
      {i === 1 && <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="mb-3 text-left font-semibold">{article.comparison.caption}</caption>
          <thead><tr>{article.comparison.headers.map(h => <th key={h} scope="col" className="border border-forest-900/15 bg-mint p-3">{h}</th>)}</tr></thead>
          <tbody>{article.comparison.rows.map((row, index) => <tr key={index}>{row.map((cell, j) => <td key={j} className="border border-forest-900/15 p-3">{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>}
    </section>)}
    <h2>Plan your next step with Clear Day Bath Solutions</h2>
    <p>{article.cta} <Link href="/get-quote/#quote">Request your consultation.</Link></p>
    <h2>Frequently Asked Questions</h2>
    {article.faqs.map(faq => <section key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></section>)}
    {!!post.links?.length && <nav aria-label="Related services and planning resources"><h2>Explore your options</h2><ul>{post.links.map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul></nav>}
    {post.reference && <p className="text-sm">Further reading: <a href={post.reference.href}>{post.reference.label}</a>.</p>}
  </>;
}
