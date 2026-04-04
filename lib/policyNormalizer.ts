import { parseMaybeObject, parseSections } from '@lib/parse';

export type PolicyContentState = {
  title: string;
  lastupdated: string;
  [key: string]: any;
};

function asObject(value: unknown): Record<string, any> {
  return value && typeof value === 'object' ? (value as Record<string, any>) : {};
}

export function normalizePolicyContent(src: unknown): PolicyContentState {
  const safe = asObject(src);
  const title = String(safe.title || '');
  const lastupdated = String(safe.lastupdated || '');
  const keys = ['intro', 'informationwecollect', 'howweuse', 'cookieslocalstorage', 'thirdparty', 'security', 'rights', 'children', 'changes', 'contact'];
  const data: Record<string, any> = {};

  for (const key of keys) {
    data[key] = parseMaybeObject(safe[key] || '');
  }

  if (data.intro && typeof data.intro === 'object') data.intro = { title: data.intro.title, text: data.intro.text };

  if (data.informationwecollect && typeof data.informationwecollect === 'object') {
    const iw = data.informationwecollect;
    data.informationwecollect = {
      title: iw.title,
      lead: iw.lead,
      usagelabel: iw.usagelabel,
      usage: iw.usage,
      devicelabel: iw.devicelabel,
      device: iw.device,
      cookieslabel: iw.cookieslabel,
      cookies: iw.cookies,
      contactlabel: iw.contactlabel,
      contact: iw.contact,
    };
  } else {
    data.informationwecollect = {
      title: '',
      lead: '',
      usagelabel: '',
      usage: '',
      devicelabel: '',
      device: '',
      cookieslabel: '',
      cookies: '',
      contactlabel: '',
      contact: '',
    };
  }

  if (data.howweuse && typeof data.howweuse === 'object') {
    data.howweuse.items = parseSections(data.howweuse.items);
  } else {
    data.howweuse = { title: data.howweuse?.title, lead: data.howweuse?.lead, items: parseSections(data.howweuse) };
  }

  for (const key of ['cookieslocalstorage', 'thirdparty', 'security', 'children', 'changes']) {
    if (data[key] && typeof data[key] === 'object') data[key] = { title: data[key].title, text: data[key].text };
    else data[key] = { title: '', text: '' };
  }

  if (data.rights && typeof data.rights === 'object') {
    data.rights.items = parseSections(data.rights.items);
  } else {
    data.rights = {
      title: data.rights?.title,
      lead: data.rights?.lead,
      items: parseSections(data.rights),
      contacttext: data.rights?.contacttext,
    };
  }

  if (data.contact && typeof data.contact === 'object') {
    const c = data.contact;
    data.contact = {
      title: c.title,
      lead: c.lead,
      emaillabel: c.emaillabel,
      email: c.email,
      websitelabel: c.websitelabel,
      website: c.website,
      closing: c.closing,
    };
  } else {
    data.contact = { title: '', lead: '', emaillabel: '', email: '', websitelabel: '', website: '', closing: '' };
  }

  return { title, lastupdated, ...data };
}