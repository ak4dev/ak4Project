export const USE_BROWSER_ROUTER = true;
export const BETA_DOMAIN = window.location.host.includes('beta') ? true : false;
export const IO_DOMAIN = window.location.host.includes('.io') ? true : false;
export const DEV_DOMAIN = window.location.host.includes('.dev') ? true : false;
export const TECH_DOMAIN = window.location.host.includes('.tech') ? true : false;
export const domain = IO_DOMAIN ? 'io' : DEV_DOMAIN ? 'dev' : TECH_DOMAIN ? 'tech' : 'local';
export const APP_NAME = `ak4.${domain}${BETA_DOMAIN ? ` (beta)` : ``}`;
