/**
 * Stub blog registry for the standalone landing app.
 * The full blog reads MDX files from the filesystem; the landing app
 * has no content directory so we return an empty list.
 * The Navbar BlogDropdown gracefully handles an empty posts array.
 */
export async function getNavBlogPosts(): Promise<
  { slug: string; title: string; ogImage: string }[]
> {
  return []
}
