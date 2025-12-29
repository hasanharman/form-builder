import path from 'node:path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ['@svgr/webpack'],
      },
      {
        test: /\.tsx$/i,
        resourceQuery: /raw/,
        use: 'raw-loader',
      },
    )

    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
  // Configure Turbopack explicitly to avoid root inference issues
  turbopack: {
    // Force the workspace root to this project
    root: path.join(path.dirname(new URL(import.meta.url).pathname)),
    // Port Webpack loaders to Turbopack rules
    rules: {
      // Convert all .svg imports to React components via SVGR
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
      // Allow importing component source with ?raw to display code samples
      '*?raw': {
        loaders: ['raw-loader'],
      },
    },
  },
  // Update image configuration for Next 16 security model
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'randomuser.me' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}

export default nextConfig
