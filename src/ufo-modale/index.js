/**
 * Registers the modal block and adds "Open modal on click" to blocks allowed as triggers.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { useSelect } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ComboboxControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { AppWindow } from 'lucide-react';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 */
import './style.scss';

import Edit from './edit';
import save from './save';
import metadata from './block.json';

import {
	MODAL_BLOCK_NAME,
	LINKED_MODAL_ATTR,
	getModalOptionsFromEditor,
	addLinkedModalAttribute,
	getTriggerAllowedBlocks,
} from './utils';

registerBlockType( metadata.name, {
	icon: <AppWindow />,
	edit: Edit,
	save,
} );

// Add linkedModalId attribute only to blocks allowed as modal triggers.
addFilter(
	'blocks.registerBlockType',
	'ufo-modale/add-linked-modal-attribute',
	( settings, blockName ) => {
		const allowedBlocks = getTriggerAllowedBlocks();
		if ( ! allowedBlocks.includes( blockName ) ) {
			return settings;
		}
		return addLinkedModalAttribute( settings );
	}
);

// Add "Attached modal" panel with Combobox only to blocks allowed as modal triggers (see filter ufo_modale_trigger_allowed_blocks).
addFilter(
	'editor.BlockEdit',
	'ufo-modale/with-modal-trigger-control',
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;

		if ( name === MODAL_BLOCK_NAME ) {
			return <BlockEdit { ...props } />;
		}

		const triggerAllowedBlocks = getTriggerAllowedBlocks();

		if ( ! triggerAllowedBlocks.includes( name ) ) {
			return <BlockEdit { ...props } />;
		}

		const modalOptions = useSelect( ( storeSelect ) => {
			return getModalOptionsFromEditor( storeSelect );
		}, [] );

		const options = [
			{ value: '', label: __( 'None', 'ufo-modale' ) },
			...modalOptions,
		];

		const value = attributes[ LINKED_MODAL_ATTR ] || '';

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls key="ufo-modale-trigger">
					<PanelBody
						title={ __( 'Attached modal', 'ufo-modale' ) }
						initialOpen={ false }
					>
						<ComboboxControl
							label={ __(
								'Modal to open when block is clicked',
								'ufo-modale'
							) }
							value={ value }
							options={ options }
							onChange={ ( newValue ) =>
								setAttributes( {
									[ LINKED_MODAL_ATTR ]: newValue || '',
								} )
							}
							placeholder={ __(
								'Select a modal…',
								'ufo-modale'
							) }
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	}
);
