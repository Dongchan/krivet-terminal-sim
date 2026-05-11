const NORMALIZERS = {
  none: (s) => s,
  trim: (s) => s.trim(),
  trimCollapseSpaces: (s) => s.trim().replace(/\s+/g, ' '),
};

export function normalize(input, kind = 'trim') {
  const fn = NORMALIZERS[kind] || NORMALIZERS.trim;
  return fn(input);
}

export function matchCommand(input, expected) {
  if (!expected || expected.type !== 'command') return { ok: false };

  const caseSensitive = expected.caseSensitive === true;
  const normKind = expected.normalize || 'trim';
  const normInput = normalize(input, normKind);
  const cmp = caseSensitive ? normInput : normInput.toLowerCase();

  for (const alias of expected.match) {
    const normAlias = normalize(alias, normKind);
    const target = caseSensitive ? normAlias : normAlias.toLowerCase();
    if (cmp === target) return { ok: true, matchedAlias: alias, normalizedInput: normInput };
  }
  return { ok: false, normalizedInput: normInput };
}

const GLOBAL_COMMANDS = {
  whoami:  { type: 'line', text: 'KRIVET\\researcher' },
  pwd:     { type: 'line', text: 'C:\\KRIVET\\연구' },
  date:    { type: 'line', text: () => new Date().toLocaleString('ko-KR') },
  echo:    { type: 'echo' },
  cls:     { type: 'clear' },
  clear:   { type: 'clear' },
  help:    { type: 'line', text: '시뮬레이터에서 사용 가능한 명령: ls, cat, whoami, pwd, date, echo, clear' },
};

export function matchGlobal(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const [head, ...rest] = trimmed.split(/\s+/);
  const key = head.toLowerCase();
  const def = GLOBAL_COMMANDS[key];
  if (!def) return null;

  if (def.type === 'echo') {
    return { kind: 'output', output: [{ type: 'line', text: rest.join(' ') }] };
  }
  if (def.type === 'clear') {
    return { kind: 'clear' };
  }
  const text = typeof def.text === 'function' ? def.text() : def.text;
  return { kind: 'output', output: [{ type: def.type, text }] };
}
