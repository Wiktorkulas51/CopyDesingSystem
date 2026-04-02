const ICONS = {
  overview: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
  media: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`,
  svgs: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17 2 2 4-4"></path><path d="m3 17 2 2 4-4"></path><path d="m13 6 2-2 4 4"></path><path d="m5 6 2-2 4 4"></path></svg>`,
  colors: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 0-10 10c0 5.52 4.48 10 10 10a10 10 0 0 0 10-10c0-1.85-.5-3.59-1.39-5.08"></path><path d="M12 6a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z"></path><path d="M20 7h-4"></path><path d="M18 5v4"></path></svg>`,
  fonts: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>`,
  history: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M12 7v5l4 2"></path></svg>`,
};

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: ICONS.overview },
  { id: 'media', label: 'Media', icon: ICONS.media },
  { id: 'svgs', label: 'SVGs', icon: ICONS.svgs },
  { id: 'colors', label: 'Colors', icon: ICONS.colors },
  { id: 'fonts', label: 'Fonts', icon: ICONS.fonts },
  { id: 'history', label: 'History', icon: ICONS.history },
];

export const renderNavigation = (activeTab) => `
  <div class="bottom-nav__list">
    ${NAV_ITEMS.map(
      (item) => `
        <button
          class="tab-btn ${item.id === activeTab ? 'is-active' : ''}"
          type="button"
          data-tab="${item.id}"
          aria-selected="${item.id === activeTab ? 'true' : 'false'}"
        >
          <span class="tab-btn__icon" aria-hidden="true">${item.icon}</span>
          <span class="tab-btn__label">${item.label}</span>
        </button>
      `
    ).join('')}
  </div>
`;
