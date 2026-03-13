/* Auto-refactored to server-safe static page wrapper. */
import StaticNamespacePage from '@components/common/StaticNamespacePage';

type GenericProps = Record<string, unknown>;

export default function PageClientServerWrapper(_props: GenericProps) {
  return (
    <StaticNamespacePage
      namespace='religion_conversion'
      metaKey='religion_conversion'
      breadcrumbLabel='Religion conversion'
    />
  );
}
