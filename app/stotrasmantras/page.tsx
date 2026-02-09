import { createGenerateMetadata } from 'lib/pageUtils';

export const generateMetadata = createGenerateMetadata('stotrasmantras');

export default function Page() {
  return (
    <>
      <h1 className="text-2xl md:text-3xl text-gray-900 dark:text-amber-100">Stotras and Mantras</h1>
    </>
  )
}