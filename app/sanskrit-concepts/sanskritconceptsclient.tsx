/* Auto-refactored to server-safe static page wrapper. */
import StaticNamespacePage from '@components/common/StaticNamespacePage';

type GenericProps = Record<string, unknown>;

export default function PageClientServerWrapper(_props: GenericProps) {
  return (
    <StaticNamespacePage
      namespace='sanskrit_concepts'
      metaKey='sanskrit_concepts'
      breadcrumbLabel='Sanskrit concepts'
    />
  );
}
