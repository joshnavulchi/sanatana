# Strict Static Export Solution

Apply this solution to all pages and OpenSpec artifacts:

```ts
export async function generateStaticParams() {
  const data = await getAllStories(); // your source
  return data
    .filter(item => item?.id && item?.localeExists) // filter invalid
    .map(item => ({ id: item.id }));
}
```

- Ensure output: 'export' is used for static generation
- Filter out invalid items and those missing locales
- This solution must be applied to all pages and OpenSpec artifacts

Refer to copilot-instructions.md for full build and locale handling rules.
