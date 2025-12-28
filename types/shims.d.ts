declare module 'd3';
declare module 'topojson-client';

// Allow importing small JS-only modules without types to avoid build failures.
declare module '*-shim' {}

declare global {
	const secrets: {
		NEXT_PUBLIC_GA_ID?: string;
		NEXT_PUBLIC_GTM_ID?: string;
		NEXT_PUBLIC_SITE_URL?: string;
		[key: string]: string | undefined;
	};
}

export {};
