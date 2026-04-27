export function normalizeProposalUrl(url?: string | null): string {
  if (!url) return ''

  return url.replace(/^https?:\/\/app\.seedao\.xyz\/proposal\//, 'https://seedao.top/proposal/')
}
