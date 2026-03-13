/* Auto-refactored to server-safe static page wrapper. */
import StaticNamespacePage from '@components/common/StaticNamespacePage';

type GenericProps = Record<string, unknown>;

export default function PageClientServerWrapper(_props: GenericProps) {
  return (
    <StaticNamespacePage
      namespace='our_cookie_policy'
      metaKey='our_cookie_policy'
      breadcrumbLabel='Our cookie policy'
    />
  );
}
