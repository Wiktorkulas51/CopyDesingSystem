export const setupCopyListeners = (card, copyValue) => {
  card.querySelectorAll('.token-name').forEach((token) => {
    token.addEventListener('click', (event) => {
      event.stopPropagation();
      navigator.clipboard.writeText(token.dataset.copy);
      const originalText = token.innerText;
      token.innerText = 'COPIED!';
      token.classList.add('copied');
      setTimeout(() => {
        token.innerText = originalText;
        token.classList.remove('copied');
      }, 800);
    });
  });

  card.addEventListener('click', () => {
    navigator.clipboard.writeText(copyValue);
    const meta = card.querySelector('.color-meta');
    const originalMeta = meta.innerHTML;
    meta.innerHTML = '<div class="copied-full">COPIED!</div>';
    setTimeout(() => {
      meta.innerHTML = originalMeta;
    }, 1000);
  });
};

export const createTokenList = (tokens = []) =>
  tokens.length
    ? `
      <div class="card-tokens">
        ${tokens.map((token) => `<span class="token-name" data-copy="${token}">${token}</span>`).join('')}
      </div>
    `
    : '';
