/**
 * Formats generated TSX with prettier's standalone build. Loaded on demand
 * so the playground only pays for it when the Code tab opens.
 */
export async function formatCode(source: string): Promise<string> {
  const [prettier, babel, estree] = await Promise.all([
    import('prettier/standalone'),
    import('prettier/plugins/babel'),
    import('prettier/plugins/estree'),
  ])
  return prettier.format(source, {
    parser: 'babel-ts',
    plugins: [babel, estree],
    semi: false,
    printWidth: 90,
  })
}
