/* Auto-refactored to server-safe static page wrapper. */
import StaticNamespacePage from '@components/common/StaticNamespacePage';

type GenericProps = Record<string, unknown>;

export default function PageClientServerWrapper(_props: GenericProps) {
  return (
    <StaticNamespacePage
      namespace='shakti_peethas'
      metaKey='shakti_peethas'
      breadcrumbLabel='Shakti peethas'
    />
  );
}
