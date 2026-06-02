import { PagePlaceholder } from '@/components/PagePlaceholder'

/** Category management: custom categories + excluded type (issue 0007). */
export function CategoriesScreen() {
  return (
    <PagePlaceholder
      title="Categories"
      intent="See system and custom categories as a two-level tree, add your own, and mark a category as excluded so internal transfers don't count."
    />
  )
}
