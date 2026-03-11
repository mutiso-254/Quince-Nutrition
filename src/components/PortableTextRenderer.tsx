import React from 'react';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { urlFor } from '../lib/sanity.image';

const components: PortableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <figure className="my-8">
          <img
            src={urlFor(value).width(800).url()}
            alt={value.alt || ' '}
            className="rounded-2xl w-full"
            loading="lazy"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-stone-500 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    code: ({ value }: any) => {
      return (
        <pre className="bg-stone-900 text-stone-100 p-6 rounded-xl my-8 overflow-x-auto">
          <code className="text-sm font-mono">{value.code}</code>
        </pre>
      );
    },
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mt-12 mb-6 font-semibold">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="font-serif text-2xl md:text-3xl text-stone-900 mt-10 mb-4 font-semibold">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="font-serif text-xl md:text-2xl text-stone-900 mt-8 mb-3 font-semibold">
        {children}
      </h4>
    ),
    normal: ({ children }: any) => (
      <p className="text-lg text-stone-700 leading-relaxed mb-6">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-emerald-500 pl-6 my-8 italic text-stone-600 text-xl">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-lg text-stone-700">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 text-lg text-stone-700">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    code: ({ children }: any) => (
      <code className="bg-stone-100 text-emerald-700 px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    link: ({ children, value }: any) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      return (
        <a
          href={value.href}
          rel={rel}
          className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
        >
          {children}
        </a>
      );
    },
    underline: ({ children }: any) => <u>{children}</u>,
    'strike-through': ({ children }: any) => <s>{children}</s>,
  },
};

interface PortableTextRendererProps {
  content: any[];
}

export default function PortableTextRenderer({ content }: PortableTextRendererProps) {
  return <PortableText value={content} components={components} />;
}
