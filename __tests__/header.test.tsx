import ReactDOMServer from 'react-dom/server';

// Mock next/navigation used by the header
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams('lang=en'),
  useRouter: () => ({ push: () => {}, replace: () => {}, prefetch: () => Promise.resolve() })
}));

// Mock i18n
jest.mock('../lib/i18n', () => ({
  t: (key: string) => {
    const map: Record<string, string> = {
      'nav.home': 'Home',
      'nav.vedas': 'Vedas',
      'nav.puranas': 'Puranas',
      'nav.shastras': 'Shastras',
      'nav.contact': 'Contact',
      'nav.donate': 'Donate',
      'siteTitle': 'Sanātana Dharma'
    };
    return map[key] ?? key;
  },
  detectLocale: () => 'en',
  DEFAULT_LOCALE: 'en',
  getLocaleObject: (locale = 'en') => ({
    sitetitle: 'Sanātana Dharma',
    siteTitle: 'Sanātana Dharma',
    nav: {
      home: 'Home',
      vedas: 'Vedas',
      puranas: 'Puranas',
      shastras: 'Shastras',
      contact: 'Contact',
      donate: 'Donate'
    }
  }),
  loadLocale: async () => ({})
}));

import Header from '../app/components/header/header';

describe('Header navigation (server render)', () => {
  it('renders nav links with correct hrefs and translations in SSR output', () => {
    const html = ReactDOMServer.renderToStaticMarkup(<Header />);

    const checks = [
      { text: 'Vedas', href: '/vedas' },
      { text: 'Puranas', href: '/puranas' },
      { text: 'Shastras', href: '/shastras' }
    ];

    for (const c of checks) {
      expect(html).toContain('>' + c.text + '<');
      expect(html).toContain('href="' + c.href + '"');
    }
  });
});
