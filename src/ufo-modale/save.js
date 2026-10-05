/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

import CloseIcon from './close-icon';
import {
	CLOSE_BUTTON_CLASSES,
	CLOSE_BUTTON_ICON_ONLY_CLASSES,
	CLOSE_BUTTON_WITH_LABEL_CLASSES,
	CLOSE_ICON_CLASSES,
	CONTENT_CLASSES,
	DIALOG_CLASSES,
	HEADER_CLASSES,
	cx,
} from './classes';
import {
	getHeadingTagName,
	getPanelProps,
	getTitleId,
	getTitleProps,
} from './utils';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
const MODAL_ID_PREFIX = 'modal-';

export default function save( { attributes } ) {
	const {
		closedBy,
		displayIconOnly,
		enableCloseButton,
		closeButtonLabel,
		headingLevel,
		modalId,
		preventScroll,
		title,
	} = attributes;

	const dialogId = modalId ? MODAL_ID_PREFIX + modalId : undefined;
	const hasTitle = ! RichText.isEmpty( title );
	const hasCloseButton = enableCloseButton && closedBy !== 'none';
	const titleId = hasTitle ? getTitleId( dialogId ) : undefined;

	return (
		<dialog
			{ ...useBlockProps.save( {
				className: cx(
					DIALOG_CLASSES,
					preventScroll && 'wp-block-ufo-modale--prevent-scroll'
				),
			} ) }
			id={ dialogId }
			aria-modal="true"
			aria-labelledby={ titleId }
			aria-label={ titleId ? undefined : __( 'Modal', 'ufo-modale' ) }
			// closedBy is a valid dialog attribute (HTML spec); ESLint doesn't recognize it yet.
			// eslint-disable-next-line react/no-unknown-property
			closedBy={ closedBy }
		>
			<div { ...getPanelProps( attributes ) }>
				{ ( hasTitle || hasCloseButton ) && (
					<div
						className={ cx(
							'wp-block-ufo-modale__header',
							HEADER_CLASSES
						) }
					>
						{ hasTitle && (
							<RichText.Content
								{ ...getTitleProps( attributes ) }
								id={ titleId }
								tagName={ getHeadingTagName( headingLevel ) }
								value={ title }
							/>
						) }
						{ hasCloseButton && (
							<button
								type="button"
								className={ cx(
									'wp-block-ufo-modale__close-button',
									CLOSE_BUTTON_CLASSES,
									displayIconOnly
										? CLOSE_BUTTON_ICON_ONLY_CLASSES
										: CLOSE_BUTTON_WITH_LABEL_CLASSES
								) }
							>
								<span
									className={
										displayIconOnly ? 'sr-only' : undefined
									}
								>
									{ closeButtonLabel ||
										__(
											'Close this dialog window',
											'ufo-modale'
										) }
								</span>
								<CloseIcon className={ CLOSE_ICON_CLASSES } />
							</button>
						) }
					</div>
				) }
				<div
					className={ cx(
						'wp-block-ufo-modale__content',
						CONTENT_CLASSES
					) }
				>
					<InnerBlocks.Content />
				</div>
			</div>
		</dialog>
	);
}
