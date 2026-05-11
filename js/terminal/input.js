export function attachKeyHandlers(inputEl, { history, onSubmit, onCtrlL, onCtrlC }) {
  let cursor = history.length;

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = inputEl.value;
      if (value.trim()) history.push(value);
      cursor = history.length;
      inputEl.value = '';
      onSubmit?.(value);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cursor > 0) {
        cursor--;
        inputEl.value = history[cursor] ?? '';
        moveCaretEnd(inputEl);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cursor < history.length - 1) {
        cursor++;
        inputEl.value = history[cursor] ?? '';
      } else {
        cursor = history.length;
        inputEl.value = '';
      }
      moveCaretEnd(inputEl);
      return;
    }
    if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
      e.preventDefault();
      onCtrlL?.();
      return;
    }
    if (e.ctrlKey && (e.key === 'c' || e.key === 'C') && !inputEl.value) {
      e.preventDefault();
      onCtrlC?.();
      return;
    }
  });
}

function moveCaretEnd(inputEl) {
  requestAnimationFrame(() => {
    const len = inputEl.value.length;
    inputEl.setSelectionRange(len, len);
  });
}
