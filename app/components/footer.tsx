/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
"use client";
import { useEffect, useState } from "react";
import { loadLocaleNamespace } from "@lib/i18n";
import { useLocale } from "@app/context/locale-context";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LazyImage from "./lazyimage";

export default function Footer() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const [footer, setFooter] = useState<Record<string, any>>({});

  useEffect(() => {
    // Load the `sharable_strings` namespace once for this locale and update state.
    let cancelled = false;
    loadLocaleNamespace(locale, "sharable_strings")
      .then((ns: any) => {
        if (cancelled) return;
        // `ns` may be the namespace object or may wrap the namespace under a
        // top-level `sharable_strings` key depending on how the JSON is authored.
        const payload = ns && ns.sharable_strings ? ns.sharable_strings : ns;
        if (payload) {
          if (payload.footer) setFooter(payload.footer);
          else setFooter(payload);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const normalize = (p?: string) => {
    if (!p) return "/";
    if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
    return p;
  };

  const isActive = (href: string) => normalize(pathname) === normalize(href);

  return (
    <>
      <footer
        className={`gradient-background w-full`}
        style={{ minHeight: "400px" }}
      >
        <div className={`relative z-29p-3`}>
          <section className="content-wrapper text-center py-30!">
            <h6
              className={`mx-auto max-w-2xl shadow-xl rounded-lg bg-white/94 px-3 py-6`}
            >
              <span className="text-3xl/10 md:text-4xl/12 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-700 drop-shadow-xl">
                {footer?.title || footer?.titleText}
              </span>
            </h6>
            <p
              className={`md:mx-auto md:max-w-5xl text-lg text-white/90 leading-relaxed px-3 py-6`}
            >
              {footer?.quote || footer?.quotes}{" "}
              {footer?.quoteSource || footer?.quotesource}
            </p>

            {/* CTA Buttons */}
            <div className="w-full text-center flex flex-col md:flex-row md:justify-center gap-4 mt-6">
              <Link
                href="/contact"
                className="group relative md:inline-flex px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600
                    hover:from-amber-600 hover:to-orange-700 text-white text-lg rounded-full shadow-xl hover:shadow-2xl
                    transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 no-underline overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                <span className="relative flex items-center justify-center gap-2">
                  {footer?.contact || footer?.contactLabel || "Contact"}
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </Link>

              <Link
                href="/donate"
                className="group md:inline-flex px-8 py-4 bg-white/10 backdrop-blur-md
                    hover:bg-white/20 border-2 border-white/50 hover:border-white
                    text-white text-lg rounded-full shadow-lg hover:shadow-xl
                    transition-all duration-300 transform hover:-translate-y-1 no-underline"
              >
                <span className="flex items-center justify-center gap-2">
                  {footer?.donate || footer?.donateLabel || "Donate"}
                  <svg
                    className="w-5 h-5 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </section>

          <div
            className={`nav-wrapper relative z-10 flex flex-col md:flex-row md:items-start md:justify-between border-t`}
          >
            <nav
              role="menu"
              className="md:w-full gap-4 flex flex-col  md:flex-row md:items-start"
            >
              <div className="md:w-1/5 flex flex-col gap-2">
                {(() => {
                  const sec = footer?.scriptures || {};
                  const title =
                    sec?.title || footer?.scripturesTitle || "Scriptures";
                  const nav =
                    sec?.nav ||
                    (typeof sec === "object"
                      ? (() => {
                          // if sec contains keys that are strings, treat sec itself as nav
                          const maybeNav: Record<string, string> = {} as any;
                          for (const k of Object.keys(sec)) {
                            if (k === "title" || k === "nav") continue;
                            const v = (sec as any)[k];
                            if (typeof v === "string") maybeNav[k] = v;
                          }
                          return Object.keys(maybeNav).length ? maybeNav : {};
                        })()
                      : {});
                  return (
                    <>
                      <p className="description text-lg underline">{title}</p>
                      {Object.entries(nav).map(([key, val]) => {
                        if (typeof val !== "string") return null;
                        const href =
                          key === "home" ? "/" : `/scriptures/${key}`;
                        return (
                          <Link
                            key={key}
                            href={href}
                            className={`text-md isActive(href) ? 'active' : ''`}
                            role="menuitem"
                            onClick={(e) => {
                              if (isActive(href)) {
                                e.preventDefault();
                              }
                            }}
                          >
                            {val}
                          </Link>
                        );
                      })}
                    </>
                  );
                })()}
              </div>

              <div className="md:w-1/5 flex flex-col gap-2">
                {(() => {
                  const sec = footer?.philosophy || {};
                  const title =
                    sec?.title || footer?.philosophyTitle || "Philosophy";
                  const nav =
                    sec?.nav ||
                    (typeof sec === "object"
                      ? (() => {
                          const maybeNav: Record<string, string> = {} as any;
                          for (const k of Object.keys(sec)) {
                            if (k === "title" || k === "nav") continue;
                            const v = (sec as any)[k];
                            if (typeof v === "string") maybeNav[k] = v;
                          }
                          return Object.keys(maybeNav).length ? maybeNav : {};
                        })()
                      : {});
                  return (
                    <>
                      <p className="description text-lg underline">{title}</p>
                      {Object.entries(nav).map(([key, val]) => {
                        if (typeof val !== "string") return null;
                        const href =
                          key === "home" ? "/" : `/philosophy/${key}`;
                        return (
                          <Link
                            key={key}
                            href={href}
                            className={`text-md isActive(href) ? 'active' : ''`}
                            role="menuitem"
                          >
                            {val}
                          </Link>
                        );
                      })}
                    </>
                  );
                })()}
              </div>

              <div className="md:w-1/5 flex flex-col gap-2">
                {(() => {
                  const sec = footer?.stories || {};
                  const title =
                    sec?.title || footer?.philosophyTitle || "Stories";
                  const nav =
                    sec?.nav ||
                    (typeof sec === "object"
                      ? (() => {
                          const maybeNav: Record<string, string> = {} as any;
                          for (const k of Object.keys(sec)) {
                            if (k === "title" || k === "nav") continue;
                            const v = (sec as any)[k];
                            if (typeof v === "string") maybeNav[k] = v;
                          }
                          return Object.keys(maybeNav).length ? maybeNav : {};
                        })()
                      : {});
                  return (
                    <>
                      <p className="description text-lg underline">{title}</p>
                      {Object.entries(nav).map(([key, val]) => {
                        if (typeof val !== "string") return null;
                        const href = key === "home" ? "/" : `/stories/${key}`;
                        return (
                          <Link
                            key={key}
                            href={href}
                            className={`text-md isActive(href) ? 'active' : ''`}
                            role="menuitem"
                          >
                            {val}
                          </Link>
                        );
                      })}
                    </>
                  );
                })()}
              </div>

              <div className="hidden">
                {(() => {
                  const sec = footer?.stotrasmantras || {};
                  const title =
                    sec?.title || footer?.philosophyTitle || "Stotras Mantras";
                  const nav =
                    sec?.nav ||
                    (typeof sec === "object"
                      ? (() => {
                          const maybeNav: Record<string, string> = {} as any;
                          for (const k of Object.keys(sec)) {
                            if (k === "title" || k === "nav") continue;
                            const v = (sec as any)[k];
                            if (typeof v === "string") maybeNav[k] = v;
                          }
                          return Object.keys(maybeNav).length ? maybeNav : {};
                        })()
                      : {});
                  return (
                    <>
                      <p className="description text-lg underline">{title}</p>
                      {Object.entries(nav).map(([key, val]) => {
                        if (typeof val !== "string") return null;
                        const href =
                          key === "home" ? "/" : `/stotrasmantras/${key}`;
                        return (
                          <Link
                            key={key}
                            href={href}
                            className={`text-md isActive(href) ? 'active' : ''`}
                            role="menuitem"
                          >
                            {val}
                          </Link>
                        );
                      })}
                    </>
                  );
                })()}
              </div>

              <div className="md:w-1/5 flex flex-col gap-2">
                {(() => {
                  const sec = footer?.kidszone || {};
                  const title =
                    sec?.title || footer?.kidszoneTitle || "Kids Zone";
                  const nav =
                    sec?.nav ||
                    (typeof sec === "object"
                      ? (() => {
                          const maybeNav: Record<string, string> = {} as any;
                          for (const k of Object.keys(sec)) {
                            if (k === "title" || k === "nav") continue;
                            const v = (sec as any)[k];
                            if (typeof v === "string") maybeNav[k] = v;
                          }
                          return Object.keys(maybeNav).length ? maybeNav : {};
                        })()
                      : {});
                  return (
                    <>
                      <p className="description text-lg underline">{title}</p>
                      {Object.entries(nav).map(([key, val]) => {
                        if (typeof val !== "string") return null;
                        const href = key === "home" ? "/" : `/kidszone/${key}`;
                        return (
                          <Link
                            key={key}
                            href={href}
                            className={`text-md isActive(href) ? 'active' : ''`}
                            role="menuitem"
                          >
                            {val}
                          </Link>
                        );
                      })}
                    </>
                  );
                })()}
              </div>

              <div className="md:w-1/5 flex flex-col gap-2">
                {(() => {
                  const sec = footer?.others || {};
                  const title = sec?.title || footer?.othersTitle || "More";
                  const nav =
                    sec?.nav ||
                    (typeof sec === "object"
                      ? (() => {
                          const maybeNav: Record<string, string> = {} as any;
                          for (const k of Object.keys(sec)) {
                            if (k === "title" || k === "nav") continue;
                            const v = (sec as any)[k];
                            if (typeof v === "string") maybeNav[k] = v;
                          }
                          return Object.keys(maybeNav).length ? maybeNav : {};
                        })()
                      : {});
                  return (
                    <>
                      <p className="description text-lg underline">{title}</p>
                      {Object.entries(nav).map(([key, val]) => {
                        if (typeof val !== "string") return null;
                        const href = key === "home" ? "/" : `/${key}`;
                        return (
                          <Link
                            key={key}
                            href={href}
                            className={`text-md isActive(href) ? 'active' : ''`}
                            role="menuitem"
                          >
                            {val}
                          </Link>
                        );
                      })}
                    </>
                  );
                })()}
              </div>
            </nav>
          </div>

          <div className="px-3 py-6 md:px-16">
            <div
              className={`flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0`}
            >
              <div>
                <small className="text-gray-400">
                  {footer && footer?.disclaimer}
                  <br /> {footer && footer?.contentChange}
                </small>
                {/* <small> I am using <Link href='https://gemini.google.com/' title='Gemini AI' target='_blank' className='text-white no-underline'>Gemini AI</Link>, <Link href='https://www.meta.ai/' title='Meta AI' target='_blank' className='text-white no-underline'>Meta AI</Link> and  <Link href='https://github.com/features/copilot' title='Github Copilot' target='_blank' className='text-white no-underline'>Github Copilot</Link> basic plan to generating content of the website.</small> */}
              </div>
              <nav
                role="list"
                className={`social-icons md:w-1/4 flex items-center justify-end gap-6`}
              >
                <Link
                  role="listitem"
                  aria-label="Visit us on LinkedIn"
                  href="https://in.linkedin.com/in/vulchivijayakumar"
                  target="_blank"
                  className=" no-underline"
                >
                  <LazyImage
                    src="/images/svg/linkedin.svg"
                    alt="linkedin"
                    width={24}
                    height={24}
                    className="inline-block"
                  />
                </Link>
                <Link
                  role="listitem"
                  aria-label="Visit us on Codepen"
                  href="https://codepen.io/vulchivijay"
                  target="_blank"
                  className=" no-underline"
                >
                  <LazyImage
                    src="/images/svg/codepen.svg"
                    alt="codepen"
                    width={24}
                    height={24}
                    className="inline-block"
                  />
                </Link>
                <Link
                  role="listitem"
                  aria-label="Visit us on Github"
                  href="https://github.com/vulchivijay"
                  target="_blank"
                  className=" no-underline"
                >
                  <LazyImage
                    src="/images/svg/github.svg"
                    alt="github"
                    width={24}
                    height={24}
                    className="inline-block"
                  />
                </Link>
                <Link
                  role="listitem"
                  aria-label="Visit us on Twitter"
                  href="#"
                  target="_blank"
                  className="no-underline"
                >
                  <LazyImage
                    src="/images/svg/twitter.svg"
                    alt="twitter"
                    width={24}
                    height={24}
                    className="inline-block"
                  />
                </Link>
              </nav>
            </div>

            <div className={`mt-6 md:flex md:items-center md:justify-between`}>
              <div className="flex items-center gap-4">
                <Link
                  href="/privacy-policy"
                  className={`text-sm ${isActive("/privacy-policy") ? "active" : ""} `}
                >
                  {footer?.privacy}
                </Link>
                <Link
                  href="/terms-of-service"
                  className={`text-sm ${isActive("/terms-of-service") ? "active" : ""} `}
                >
                  {footer?.terms}
                </Link>
              </div>
              <small className="inline-flex mt-3 text-gray-100">
                {footer?.copyright}
              </small>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
