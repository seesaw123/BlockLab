/* Line icons drawn with currentColor so they follow the theme. */

const base = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const CheckIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" strokeWidth="3" {...base}><path d="M4 10.5l4 4 8-9" /></svg>
);

export const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" strokeWidth="2.5" {...base}><path d="M4 10h12M11 5l5 5-5 5" /></svg>
);

export const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" strokeWidth="2.5" {...base}><path d="M16 10H4M9 5l-5 5 5 5" /></svg>
);

export const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" strokeWidth="2.5" {...base}><rect x="3" y="8" width="14" height="10" rx="2" /><path d="M6.5 8V6a3.5 3.5 0 0 1 7 0v2" /></svg>
);

export const KeyIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" strokeWidth="2.5" style={{ flex: 'none' }} {...base}><circle cx="11" cy="15" r="6" /><path d="M17 15h10M23 15v5M27 15v3" /></svg>
);

export const ShieldIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="#F2B441" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: 'none' }}>
    <path d="M22 4l15 6v10c0 10-6.5 16.5-15 20C13.5 36.5 7 30 7 20V10z" /><path d="M15 22l5 5 9-10" />
  </svg>
);

export const ChainIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" strokeWidth="2.5" style={{ flex: 'none' }} {...base}><rect x="2" y="12" width="13" height="12" rx="3" /><rect x="21" y="12" width="13" height="12" rx="3" /><path d="M15 18h6" /></svg>
);

export const LogoIcon = () => (
  <svg width="34" height="34" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="13" height="13" rx="3" /><rect x="20" y="20" width="13" height="13" rx="3" fill="#F2B441" /><path d="M16 9.5h6.5a4 4 0 0 1 4 4V20" />
  </svg>
);

export const BADGE_ICONS = {
  Codebreaker: (
    <svg width="30" height="30" viewBox="0 0 30 30" strokeWidth="2.5" {...base}><circle cx="15" cy="15" r="11" /><circle cx="15" cy="15" r="5" /><path d="M15 4v4M15 22v4M4 15h4M22 15h4" /></svg>
  ),
  'Hash hero': (
    <svg width="30" height="30" viewBox="0 0 30 30" strokeWidth="2.5" {...base}><path d="M9 6c-3 3-3 15 0 18M15 4c-2 4-2 18 0 22M21 6c3 3 3 15 0 18" /></svg>
  ),
  'Key keeper': <KeyIcon size={30} />
};
