/**
 * Utility functions for the ufo/modale block.
 */

import { select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
// These helpers are only exported under an __experimental name, but they are
// the ones core blocks use to apply skipped block supports to an inner element.
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	getColorClassName,
	getFontSizeClass,
	__experimentalGetColorClassesAndStyles as getColorClassesAndStyles,
	__experimentalGetSpacingClassesAndStyles as getSpacingClassesAndStyles,
	__experimentalGetDimensionsClassesAndStyles as getDimensionsClassesAndStyles,
} from '@wordpress/block-editor';
/* eslint-enable @wordpress/no-unsafe-wp-apis */

import { PANEL_CLASSES, TITLE_CLASSES, cx } from './classes';

export const MODAL_BLOCK_NAME = 'ufo/modale';
export const LINKED_MODAL_ATTR = 'linkedModalId';

/** Default block names allowed inside the modal (filterable via ufo_modale_inner_allowed_blocks). */
export const DEFAULT_INNER_ALLOWED_BLOCKS = [
	'core/paragraph',
	'core/heading',
	'core/list',
	'core/list-item',
	'core/file',
	'core/quote',
	'core/math',
	'core/details',
	'core/pullquote',
	'core/table',
	'core/embed',
	'core/shortcode',
	'core/html',
	'core/separator',
	'core/image',
	'core/gallery',
	'core/video',
	'core/spacer',
	'ufo-blocks/ufo-buttons-group',
	'ufo-blocks/ufo-button',
	'contact-form-7/contact-form-selector',
];

/**
 * Returns blocks allowed inside the modal from localized PHP data.
 *
 * @return {string[]} Allowed block names.
 */
export function getInnerAllowedBlocks() {
	const localized = window.ufoModaleEditorSettings?.innerAllowedBlocks;

	if ( Array.isArray( localized ) && localized.length > 0 ) {
		return localized;
	}

	try {
		const settings = select( 'core/block-editor' ).getSettings();
		const list = settings?.ufoModaleInnerAllowedBlocks;

		if ( Array.isArray( list ) && list.length > 0 ) {
			return list;
		}
	} catch {
		// Block editor store may not be ready yet.
	}

	return DEFAULT_INNER_ALLOWED_BLOCKS;
}

/**
 * Returns blocks allowed as modal triggers from localized PHP data.
 *
 * @return {string[]} Allowed block names.
 */
export function getTriggerAllowedBlocks() {
	const localized = window.ufoModaleEditorSettings?.triggerAllowedBlocks;

	if ( Array.isArray( localized ) ) {
		return localized;
	}

	try {
		const settings = select( 'core/block-editor' ).getSettings();
		const list = settings?.ufoModaleTriggerAllowedBlocks;

		if ( Array.isArray( list ) ) {
			return list;
		}
	} catch {
		// Block editor store may not be ready yet.
	}

	return [ 'ufo-blocks/ufo-button' ];
}

/**
 * Generates a stable unique id for a modal (persists across page refresh).
 * Not tied to clientId, which is regenerated when the editor loads.
 *
 * @return {string} Unique id safe for HTML id attribute.
 */
export function generateStableModalId() {
	if ( typeof crypto !== 'undefined' && crypto.randomUUID ) {
		return 'm-' + crypto.randomUUID().replace( /-/g, '' ).slice( 0, 12 );
	}
	return (
		'm-' +
		Date.now().toString( 36 ) +
		'-' +
		Math.random().toString( 36 ).slice( 2, 10 )
	);
}

/**
 * Collect modal options from the block editor store using getClientIdsWithDescendants
 * and getBlock, so modals inside reusable blocks (core/block) and patterns are included.
 *
 * @param {Function} storeSelect - The wp.data select function (e.g. from useSelect).
 * @return {Object[]} Options for ComboboxControl.
 */
export function getModalOptionsFromEditor( storeSelect ) {
	const blockEditor = storeSelect( 'core/block-editor' );
	const clientIds = blockEditor.getClientIdsWithDescendants();
	if ( ! Array.isArray( clientIds ) ) {
		return [];
	}
	const options = [];
	for ( const clientId of clientIds ) {
		const block = blockEditor.getBlock( clientId );
		if ( ! block || block.name !== MODAL_BLOCK_NAME ) {
			continue;
		}
		const modalId = block.attributes?.modalId || block.clientId;
		const title =
			block.attributes?.title?.trim() || __( 'Modal', 'ufo-modale' );
		options.push( {
			value: modalId,
			label: title || `#${ String( modalId ).slice( 0, 8 ) }`,
		} );
	}
	return options;
}

/**
 * Merges linkedModalId attribute into block type settings (for filter / re-registration).
 *
 * @param {Object} settings - Block type settings.
 * @return {Object} Settings with linkedModalId attribute.
 */
export function addLinkedModalAttribute( settings ) {
	return {
		...settings,
		attributes: {
			...settings.attributes,
			[ LINKED_MODAL_ATTR ]: {
				type: 'string',
				default: '',
			},
		},
	};
}

/**
 * Returns the tag name for the modal title (level 0 = paragraph).
 *
 * @param {number} level Heading level from the block attributes.
 * @return {string} Tag name.
 */
export function getHeadingTagName( level ) {
	return level ? `h${ String( level ) }` : 'p';
}

/**
 * Props of the modal content card. Color, padding and dimensions block
 * supports are applied here (not on the <dialog>), see block.json
 * __experimentalSkipSerialization.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} className and style props.
 */
export function getPanelProps( attributes ) {
	const color = getColorClassesAndStyles( attributes );
	const spacing = getSpacingClassesAndStyles( attributes );
	const dimensions = getDimensionsClassesAndStyles( attributes );
	const style = { ...color.style, ...spacing.style, ...dimensions.style };

	return {
		className: cx(
			'wp-block-ufo-modale__panel',
			PANEL_CLASSES,
			color.className,
			dimensions.className
		),
		style: Object.keys( style ).length ? style : undefined,
	};
}

/**
 * Returns the id of the modal title, used by the dialog aria-labelledby.
 *
 * @param {string} dialogId Dialog element id.
 * @return {string|undefined} Title id.
 */
export function getTitleId( dialogId ) {
	return dialogId ? `${ dialogId }-title` : undefined;
}

/**
 * Class names and inline styles of the modal title (font family, size and
 * color). Presets use the classes WordPress generates from theme.json;
 * custom values are inline styles.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} className and style props.
 */
export function getTitleProps( attributes ) {
	const {
		titleFontFamily,
		titleFontSize,
		customTitleFontSize,
		titleTextColor,
		customTitleTextColor,
	} = attributes;

	const style = {};
	if ( ! titleFontSize && customTitleFontSize ) {
		style.fontSize = customTitleFontSize;
	}
	if ( ! titleTextColor && customTitleTextColor ) {
		style.color = customTitleTextColor;
	}

	return {
		className: cx(
			'wp-block-ufo-modale__title',
			TITLE_CLASSES,
			titleFontFamily && `has-${ titleFontFamily }-font-family`,
			titleFontSize && getFontSizeClass( titleFontSize ),
			( titleTextColor || customTitleTextColor ) && 'has-text-color',
			titleTextColor && getColorClassName( 'color', titleTextColor )
		),
		style: Object.keys( style ).length ? style : undefined,
	};
}
