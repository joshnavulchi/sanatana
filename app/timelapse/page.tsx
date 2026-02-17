/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */

import PageLayout from '@components/common/PageLayout';
import { createGenerateMetadata } from '@lib/pageUtils';
import { t, getMeta, getLocaleNamespaceObject } from '@lib/i18n';

const _localeObj = getLocaleNamespaceObject('timelapse');
const ns = (_localeObj && ((_localeObj as any)['timelapse'] || (_localeObj as any)['timelinePoints'])) || {};
const __getLoc = (p: string) => {
  if (!ns) return '';
  const parts = p.split('.');
  const namespaceKey = parts[0] === 'timelapse' || parts[0] === 'timelinePoints' ? parts.shift() : 'timelapse';
  let cur: any = (ns as any)?.[namespaceKey!] || ns as any;
  for (const part of parts) { if (cur == null) return ''; cur = cur[part]; }
  return cur;
};

type TimelinePoint = {
  name?: string;
  nature?: string;
  symbolic_origin?: string;
  role?: string;
  time_reference?: string;
  label?: string;
  year?: number;
};


export const generateMetadata = createGenerateMetadata('timelapse');
export default function TimelapsePage() {
  const S = (k: string) => String(t(k));

  const page: any = (() => {
    const k: any = getMeta('timelapse', {}, undefined) || {};
    const timelineObj = k.timelinePoints ?? __getLoc('timelinePoints');
    const timelinePoints: TimelinePoint[] = timelineObj ? (Array.isArray(timelineObj) ? timelineObj : Object.values(timelineObj)) : [];
    return {
      title: typeof k.title === 'string' ? k.title : String(__getLoc('timelapse.title') || 'Timelapse'),
      timelinePoints
    };
  })();
  return (
    <PageLayout metaKey="timelapse" title={page.title} breadcrumbs={[{ labelKey: 'Home', href: '/' }, { label: page.title || 'Timelapse' }]}>
      <div>
        {(page.timelinePoints as TimelinePoint[]).map((point: TimelinePoint, index: number) => (
          <div key={index}>
            <div>
              <div>
                <h4 className="text-gray-900"><span>Label:</span> {point.label ?? ''}</h4>
                <p className="text-gray-800">{point.time_reference ?? ''}</p>
                <p className="text-gray-800"><span>Name:</span> {point.name ?? ''}</p>
              </div>
              <div>
                <p className="text-gray-800"><span>Nature:</span> {point.nature ?? ''}</p>
                <p className="text-gray-800"><span>Origin:</span> {point.symbolic_origin ?? ''}</p>
                <p className="text-gray-800"><span>Role:</span> {point.role ?? ''}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
