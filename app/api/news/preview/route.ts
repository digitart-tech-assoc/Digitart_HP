import { NextResponse } from 'next/server';
import { getArticleData } from '@/lib/news';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json(
      { error: 'Missing slug query parameter' },
      {
        status: 400,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  }

  const article = getArticleData(slug);

  if (!article) {
    return NextResponse.json(
      { error: 'Article not found' },
      {
        status: 404,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  }

  return NextResponse.json(article, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
