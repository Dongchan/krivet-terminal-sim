export function formatPrompt({ kind = 'powershell', cwd = 'C:\\KRIVET\\연구' } = {}) {
  if (kind === 'powershell') return `PS ${cwd}> `;
  if (kind === 'bash')       return `${cwd} $ `;
  return `${cwd}> `;
}
