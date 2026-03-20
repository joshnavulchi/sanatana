import { createGenerateMetadata } from "@lib/pageUtils";
import StructuredData from "@components/structured-data/StructuredData";
import ExploreClient from "./exploreclient";

export const generateMetadata = createGenerateMetadata("explore");

export default function Page() {
  return (
    <>
      <StructuredData metaKey="explore" />
      <ExploreClient />
    </>
  );
}
