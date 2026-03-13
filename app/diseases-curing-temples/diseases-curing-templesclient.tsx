/* Auto-refactored to server-safe static page wrapper. */
import StaticNamespacePage from '@components/common/StaticNamespacePage';

type GenericProps = Record<string, unknown>;

export default function PageClientServerWrapper(_props: GenericProps) {
  return (
    <StaticNamespacePage
      namespace='diseases_curing_temples'
      metaKey='diseases_curing_temples'
      breadcrumbLabel='Diseases curing temples'
    />
  );
}
