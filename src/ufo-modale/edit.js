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
import {
	useBlockProps,
	BlockControls,
	HeadingLevelDropdown,
	InspectorControls,
	InnerBlocks,
	RichText,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/* eslint-disable @wordpress/no-unsafe-wp-apis -- ToggleGroupControl is the intended UI for "Closed by" options; allow until stable. */
import {
	PanelBody,
	ToggleControl,
	ToolbarGroup,
	ToolbarButton,
	TextControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { useMergeRefs } from '@wordpress/compose';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import { Eye, EyeOff } from 'lucide-react';
import CloseIcon from './close-icon';
import { useState, useRef, useEffect } from '@wordpress/element';

import {
	generateStableModalId,
	getHeadingTagName,
	getInnerAllowedBlocks,
	getPanelProps,
	getTitleProps,
	MODAL_BLOCK_NAME,
} from './utils';
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
import TitleSettings from './title-settings';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Component props.
 * @param {string}   props.clientId      Block client ID.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update attributes.
 * @return {Element} Element to render.
 */
export default function Edit( { clientId, attributes, setAttributes } ) {
	const {
		closedBy,
		displayIconOnly,
		enableCloseButton,
		closeButtonLabel,
		headingLevel: HeadingTag,
		modalId,
		preventScroll,
		title,
	} = attributes;
	const [ isPreview, setIsPreview ] = useState( false );
	const dialogRef = useRef( null );
	const blockProps = useBlockProps( {
		className: DIALOG_CLASSES,
		'data-ufo-badge': modalId
			? `${ __( 'Modal', 'ufo-modale' ) } · #${ modalId }`
			: __( 'Modal', 'ufo-modale' ),
	} );
	const mergedRef = useMergeRefs( [ dialogRef, blockProps.ref ] );

	const modalBlocksWithSameId = useSelect(
		( select ) => {
			if ( ! modalId ) {
				return [];
			}
			const blocks = select( 'core/block-editor' ).getBlocks();
			const modals = [];
			function traverse( list ) {
				list.forEach( ( block ) => {
					if (
						block.name === MODAL_BLOCK_NAME &&
						block.attributes?.modalId === modalId
					) {
						modals.push( block );
					}
					if ( block.innerBlocks?.length ) {
						traverse( block.innerBlocks );
					}
				} );
			}
			traverse( blocks );
			return modals;
		},
		[ modalId ]
	);

	// Use a stable id (UUID-style) so it persists after refresh. Only set when empty
	// or when this block is a duplicate (same modalId as another modal) — then give
	// this block a new id so the first one keeps the original.
	useEffect( () => {
		if ( ! modalId ) {
			setAttributes( { modalId: generateStableModalId() } );
			return;
		}
		if ( modalBlocksWithSameId.length > 1 ) {
			const sorted = [ ...modalBlocksWithSameId ].sort( ( a, b ) =>
				a.clientId.localeCompare( b.clientId )
			);
			if ( sorted[ 0 ].clientId !== clientId ) {
				setAttributes( { modalId: generateStableModalId() } );
			}
		}
		// Intentionally depend on modalId, clientId, length and setAttributes only.
		// eslint-disable-next-line react-hooks/exhaustive-deps -- modalBlocksWithSameId identity changes every render.
	}, [ modalId, clientId, modalBlocksWithSameId.length, setAttributes ] );

	useEffect( () => {
		if ( ! isPreview ) {
			return;
		}

		let cleanup = null;
		const timeoutId = setTimeout( () => {
			const dialog = dialogRef.current;
			if ( ! dialog ) {
				return;
			}
			dialog.showModal();
			const onClose = () => setIsPreview( false );
			dialog.addEventListener( 'close', onClose );
			cleanup = () => {
				dialog.removeEventListener( 'close', onClose );
				dialog.close();
			};
		}, 0 );

		return () => {
			clearTimeout( timeoutId );
			if ( cleanup ) {
				cleanup();
			}
		};
	}, [ isPreview ] );

	const allowedBlocks = getInnerAllowedBlocks();

	return (
		<>
			<dialog
				{ ...blockProps }
				ref={ mergedRef }
				open={ ! isPreview }
				// closedBy is a valid dialog attribute (HTML spec); ESLint doesn't recognize it yet.
				// eslint-disable-next-line react/no-unknown-property
				closedBy={ isPreview ? 'any' : false }
				aria-modal="true"
			>
				<div { ...getPanelProps( attributes ) }>
					<div
						className={ cx(
							'wp-block-ufo-modale__header',
							HEADER_CLASSES
						) }
					>
						<RichText
							{ ...getTitleProps( attributes ) }
							tagName={ getHeadingTagName( HeadingTag ) }
							value={ title }
							onChange={ ( newTitle ) =>
								setAttributes( { title: newTitle } )
							}
							placeholder={ __( 'Heading…', 'ufo-modale' ) }
						/>
						{ enableCloseButton && closedBy !== 'none' && (
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
					<div
						className={ cx(
							'wp-block-ufo-modale__content',
							CONTENT_CLASSES
						) }
					>
						<InnerBlocks allowedBlocks={ allowedBlocks } />
					</div>
				</div>
			</dialog>
			<BlockControls>
				<ToolbarGroup>
					<HeadingLevelDropdown
						value={ HeadingTag }
						onChange={ ( headingLevel ) =>
							setAttributes( { headingLevel } )
						}
						options={ [ 0, 2, 3, 4, 5, 6 ] }
					/>
					<ToolbarButton
						disabled={ true }
						icon={ isPreview ? <EyeOff /> : <Eye /> }
						onClick={ () => setIsPreview( ! isPreview ) }
						label={
							isPreview
								? __( 'Hide', 'ufo-modale' )
								: __( 'Preview', 'ufo-modale' )
						}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Modal settings', 'ufo-modale' ) }>
					<ToggleGroupControl
						__next40pxDefaultSize
						isBlock
						label={ __( 'Closed by', 'ufo-modale' ) }
						help={ __(
							'Determines how the modal will be closed.',
							'ufo-modale'
						) }
						onChange={ ( newClosedBy ) =>
							setAttributes( { closedBy: newClosedBy } )
						}
						value={ closedBy }
					>
						<ToggleGroupControlOption
							label={ __( 'Any', 'ufo-modale' ) }
							value="any"
						/>
						<ToggleGroupControlOption
							label={ __( 'Close request', 'ufo-modale' ) }
							value="closerequest"
						/>
						<ToggleGroupControlOption
							label={ __( 'None', 'ufo-modale' ) }
							value="none"
						/>
					</ToggleGroupControl>
					<ToggleControl
						__next40pxDefaultSize
						label={ __( 'Prevent page scroll', 'ufo-modale' ) }
						help={ __(
							'If enabled, the modal will prevent the user from scrolling the page while the modal is open.',
							'ufo-modale'
						) }
						checked={ preventScroll }
						onChange={ ( newPreventScroll ) =>
							setAttributes( { preventScroll: newPreventScroll } )
						}
					/>
				</PanelBody>
				<TitleSettings
					attributes={ attributes }
					setAttributes={ setAttributes }
				/>
				<PanelBody title={ __( 'Close button', 'ufo-modale' ) }>
					<ToggleControl
						label={ __( 'Enable close button', 'ufo-modale' ) }
						help={
							closedBy === 'none'
								? __(
										'You have chosen to not close the modal by clicking the close button. Therefore, the close button will not be displayed.',
										'ufo-modale'
								  )
								: __(
										'If enabled, a close button will be displayed in the modal. The close button will close the modal when clicked.',
										'ufo-modale'
								  )
						}
						checked={ enableCloseButton }
						onChange={ ( newEnableCloseButton ) =>
							setAttributes( {
								enableCloseButton: newEnableCloseButton,
							} )
						}
						disabled={ closedBy === 'none' }
					/>
					{ enableCloseButton && closedBy !== 'none' && (
						<TextControl
							label={ __( 'Close button label', 'ufo-modale' ) }
							help={ __(
								'If not set, the default label will be used.',
								'ufo-modale'
							) }
							value={ closeButtonLabel }
							onChange={ ( newCloseButtonLabel ) =>
								setAttributes( {
									closeButtonLabel: newCloseButtonLabel,
								} )
							}
							placeholder={ __(
								'Close this dialog window',
								'ufo-modale'
							) }
						/>
					) }
					<ToggleControl
						label={ __( 'Display icon only', 'ufo-modale' ) }
						help={ __(
							'If enabled, only the close icon will be displayed in the close button. The label will not be displayed.',
							'ufo-modale'
						) }
						checked={ displayIconOnly }
						onChange={ ( newDisplayIconOnly ) =>
							setAttributes( {
								displayIconOnly: newDisplayIconOnly,
							} )
						}
						disabled={ ! enableCloseButton || closedBy === 'none' }
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
