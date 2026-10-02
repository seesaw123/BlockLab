/* Renders a short piece of the course's own text that may contain <b> tags.
   Only use it for the static strings in src/data and src/i18n, never for
   anything a student types. */
export function Rich({ as: Tag = 'p', html, ...rest }) {
  return <Tag {...rest} dangerouslySetInnerHTML={{ __html: html }} />;
}
