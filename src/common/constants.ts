/**
 * Application Constants
 *
 * Contains configuration values and environment detection logic
 * for the ak4 investment calculator application.
 */

// Router Configuration
export const USE_BROWSER_ROUTER = true;

// Environment Detection
// Check current hostname to determine deployment environment
export const BETA_DOMAIN = window.location.host.includes('beta');
export const IO_DOMAIN = window.location.host.includes('.io');
export const DEV_DOMAIN = window.location.host.includes('.dev');
export const TECH_DOMAIN = window.location.host.includes('.tech');

// Domain Resolution
// Determine the current domain environment for branding and configuration
export const domain = IO_DOMAIN ? 'io' : DEV_DOMAIN ? 'dev' : TECH_DOMAIN ? 'tech' : 'local';

// Application Branding
// Generate application name based on current environment
export const APP_NAME = `ak4.${domain}${BETA_DOMAIN ? ' (beta)' : ''}`;
