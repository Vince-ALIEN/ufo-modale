/**
 * Utility classes used by the modal markup (save + edit).
 *
 * They come from the ufo-boilerplate Tailwind build: keep this list limited
 * to classes that already exist in theme/style.css so the theme stylesheet
 * does not grow. The theme scans this file only (see tailwind-theme.css).
 */

// Native <dialog>: the browser handles the overlay, centering and focus.
export const DIALOG_CLASSES =
	'w-full max-w-xl p-4 bg-transparent overflow-y-auto';

// Modal content card.
export const PANEL_CLASSES =
	'relative bg-background text-foreground rounded-lg shadow';

export const HEADER_CLASSES =
	'flex items-center justify-between gap-4 p-4 border-b border-slate-100';

export const TITLE_CLASSES = 'text-xl font-semibold';

export const CONTENT_CLASSES = 'flex flex-col gap-4 p-4';

export const CLOSE_BUTTON_CLASSES =
	'inline-flex items-center justify-center gap-2 h-8 ml-auto rounded-lg text-sm text-slate-400 bg-transparent hover:bg-slate-100 hover:text-primary cursor-pointer';

export const CLOSE_BUTTON_ICON_ONLY_CLASSES = 'w-8';

export const CLOSE_BUTTON_WITH_LABEL_CLASSES = 'px-2';

export const CLOSE_ICON_CLASSES = 'size-4';

/**
 * Joins class names, skipping empty values.
 *
 * @param {...(string|false|undefined)} names Class names.
 * @return {string} Class attribute value.
 */
export function cx( ...names ) {
	return names.filter( Boolean ).join( ' ' );
}
