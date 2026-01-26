// Polyfill MessageChannel for React SSR which may expect it in some builds
if (typeof (global as any).MessageChannel === 'undefined') {
	(async () => {
		try {
			const mod = await import('worker_threads').catch(() => null);
			if (mod && (mod as any).MessageChannel) {
				(global as any).MessageChannel = (mod as any).MessageChannel;
			}
		} catch (err) {
			// ignore if not available
		}
	})();
}

// Polyfill TextEncoder/TextDecoder if missing (older Node/Jest environments)
if (typeof (global as any).TextEncoder === 'undefined') {
	(async () => {
		try {
			const util = await import('util').catch(() => null);
			if (util) {
				(global as any).TextEncoder = (util as any).TextEncoder;
				(global as any).TextDecoder = (util as any).TextDecoder;
			}
		} catch (err) {
			// ignore
		}
	})();
}

import '@testing-library/jest-dom';
// Provide a lightweight Jest mock for lib/i18n so tests don't depend on
// filesystem or remote locale loading. Exports mirror the real module shape
// used in components: `DEFAULT_LOCALE`, `locales`, `getLocaleObject`,
// `t`, and `loadLocale`.
jest.mock(
	'lib/i18n',
	() => ({
		__esModule: true,
		DEFAULT_LOCALE: 'en',
		locales: {},
		getLocaleObject: (locale = 'en') => ({}),
		t: (key: string, _locale = 'en') => key,
		loadLocale: async (/* locale */) => ({}),
	}),
	{ virtual: true }
);
