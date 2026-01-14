/**
 * Utilities barrel export.
 *
 * This module re-exports common, framework-agnostic helpers used throughout the API.
 *
 * Exports:
 * - `response`   -> standard response envelope helpers (success/error)
 * - `errors`     -> custom error types used by services/controllers
 * - `pagination` -> pagination helpers for page/pageSize -> limit/offset
 */

// Barrel export for all utilities
export * from './response';
export * from './errors';
export * from './pagination';
