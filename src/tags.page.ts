export const layout = "layouts/tag.vto";

export default function* ({ search }: Lume.Data) {
  const allTags = search.values("tags") as string[];
  const filteredTags = allTags.filter(
    (tag: string) => !["bitacora", "reflexiones"].includes(tag),
  );

  for (const tag of filteredTags) {
    const tagPosts = search.pages(tag, "date=desc");
    yield {
      url: `/tags/${tag}/`,
      title: `Tag: ${tag}`,
      description: `Artículos etiquetados con « ${tag} ».`,
      tag,
      tagPosts,
    };
  }
}
