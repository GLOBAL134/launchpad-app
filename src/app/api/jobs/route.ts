import { NextRequest, NextResponse } from 'next/server';
import { JobListing } from '@/types/launchpad';

interface AdzunaJobItem {
  id: string | number;
  title?: string;
  company?: { display_name?: string };
  location?: { display_name?: string };
  description?: string;
  redirect_url: string;
  created?: string;
  salary_min?: number;
  salary_max?: number;
  contract_time?: string;
  category?: { label?: string };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim() || 'Frontend Developer';
    const location = searchParams.get('location')?.trim() || '';
    const country = (searchParams.get('country') || 'us').toLowerCase();
    const page = Math.max(1, Number(searchParams.get('page') || '1'));
    const remoteOnly = searchParams.get('remote') === 'true';
    const minSalary = Number(searchParams.get('minSalary') || '0');
    const sortBy = searchParams.get('sort') || 'relevance';

    const appId = process.env.ADZUNA_APP_ID || process.env.NEXT_PUBLIC_ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY || process.env.NEXT_PUBLIC_ADZUNA_APP_KEY;

    if (appId && appKey) {
      const url = new URL(`https://api.adzuna.com/v1/api/jobs/${encodeURIComponent(country)}/search/${page}`);
      url.searchParams.set('app_id', appId);
      url.searchParams.set('app_key', appKey);
      url.searchParams.set('results_per_page', '20');
      url.searchParams.set('what', remoteOnly ? `${query} remote` : query);
      url.searchParams.set('content-type', 'application/json');

      if (location) {
        url.searchParams.set('where', location);
      }
      if (minSalary > 0) {
        url.searchParams.set('salary_min', String(minSalary));
      }
      if (sortBy === 'date' || sortBy === 'salary') {
        url.searchParams.set('sort_by', sortBy);
      }

      const res = await fetch(url.toString(), { next: { revalidate: 300 } });
      if (res.ok) {
        const data = await res.json();
        const currencyMap: Record<string, string> = { us: '$', gb: '£', de: '€', nl: '€', ca: 'CA$', au: 'A$' };
        const currency = currencyMap[country] || '$';

        const jobs: JobListing[] = (data.results || []).map((item: AdzunaJobItem) => {
          const cleanDesc = String(item.description || '').replace(/<\/?[^>]+(>|$)/g, '');
          const cleanTitle = String(item.title || '').replace(/<\/?[^>]+(>|$)/g, '');
          return {
            id: String(item.id),
            title: cleanTitle,
            company: item.company?.display_name || 'Direct Employer',
            location: item.location?.display_name || country.toUpperCase(),
            description: cleanDesc,
            url: item.redirect_url,
            createdAt: item.created || new Date().toISOString(),
            salaryMin: item.salary_min ? Math.round(item.salary_min) : null,
            salaryMax: item.salary_max ? Math.round(item.salary_max) : null,
            currency,
            contractTime: item.contract_time || 'full_time',
            category: item.category?.label || 'IT & Engineering',
            isRemote: /remote|удален|anywhere/i.test(`${cleanTitle} ${cleanDesc} ${item.location?.display_name || ''}`),
          };
        });

        return NextResponse.json({
          jobs,
          totalCount: data.count || jobs.length,
          currentPage: page,
          source: 'adzuna_live',
        });
      }
    }

    // Честное уведомление, если ключи Adzuna не заданы в .env
    return NextResponse.json(
      {
        jobs: [],
        totalCount: 0,
        currentPage: 1,
        source: 'missing_credentials',
        warning: 'Проверьте наличие ADZUNA_APP_ID и ADZUNA_APP_KEY в переменных окружения (.env.local / Vercel).',
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errObj = err as { digest?: string } | null;
    if (errObj?.digest === 'NEXT_PRERENDER_INTERRUPTED') {
      throw err;
    }
    console.error('[Jobs API Error]:', err);
    return NextResponse.json({ error: 'Ошибка при загрузке вакансий.' }, { status: 500 });
  }
}
