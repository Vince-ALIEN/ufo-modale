/**
 * Sidebar panel for the modal title: font family, font size and color,
 * using the presets declared in theme.json.
 */
import { __ } from '@wordpress/i18n';
import {
	getColorObjectByColorValue,
	useSettings,
} from '@wordpress/block-editor';
import {
	BaseControl,
	ColorPalette,
	FontSizePicker,
	PanelBody,
	SelectControl,
} from '@wordpress/components';

/**
 * Flattens a preset setting that may be returned per origin
 * ({ default, theme, custom }) or as a plain array.
 *
 * @param {Object|Array|undefined} setting Preset setting.
 * @return {Array} Presets.
 */
function flattenPresets( setting ) {
	if ( Array.isArray( setting ) ) {
		return setting;
	}
	if ( ! setting ) {
		return [];
	}
	return [
		...( setting.default ?? [] ),
		...( setting.theme ?? [] ),
		...( setting.custom ?? [] ),
	];
}

/**
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update attributes.
 * @return {Element} Panel.
 */
export default function TitleSettings( { attributes, setAttributes } ) {
	const {
		titleFontFamily,
		titleFontSize,
		customTitleFontSize,
		titleTextColor,
		customTitleTextColor,
	} = attributes;

	const [
		fontSizesSetting,
		paletteSetting,
		fontFamiliesSetting,
		customFontSizeEnabled,
		customColorEnabled,
	] = useSettings(
		'typography.fontSizes',
		'color.palette',
		'typography.fontFamilies',
		'typography.customFontSize',
		'color.custom'
	);

	const fontSizes = flattenPresets( fontSizesSetting );
	const palette = flattenPresets( paletteSetting );
	const fontFamilies = flattenPresets( fontFamiliesSetting );

	const fontSizeValue = titleFontSize
		? fontSizes.find( ( size ) => size.slug === titleFontSize )?.size
		: customTitleFontSize;

	const colorValue = titleTextColor
		? palette.find( ( color ) => color.slug === titleTextColor )?.color
		: customTitleTextColor;

	return (
		<PanelBody title={ __( 'Title', 'ufo-modale' ) } initialOpen={ false }>
			{ fontFamilies.length > 0 && (
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __( 'Font', 'ufo-modale' ) }
					value={ titleFontFamily ?? '' }
					options={ [
						{ label: __( 'Default', 'ufo-modale' ), value: '' },
						...fontFamilies.map( ( family ) => ( {
							label: family.name ?? family.slug,
							value: family.slug,
						} ) ),
					] }
					onChange={ ( slug ) =>
						setAttributes( { titleFontFamily: slug || undefined } )
					}
				/>
			) }
			<div style={ { marginTop: '16px' } }>
				<FontSizePicker
					__next40pxDefaultSize
					fontSizes={ fontSizes }
					value={ fontSizeValue }
					disableCustomFontSizes={ ! customFontSizeEnabled }
					withReset
					onChange={ ( newSize ) => {
						const preset = fontSizes.find(
							( size ) => size.size === newSize
						);
						setAttributes( {
							titleFontSize: preset?.slug,
							customTitleFontSize: preset ? undefined : newSize,
						} );
					} }
				/>
			</div>
			<BaseControl
				__nextHasNoMarginBottom
				id="ufo-modale-title-color"
				label={ __( 'Color', 'ufo-modale' ) }
			>
				<ColorPalette
					colors={ palette }
					value={ colorValue }
					disableCustomColors={ ! customColorEnabled }
					onChange={ ( newColor ) => {
						const preset = newColor
							? getColorObjectByColorValue( palette, newColor )
							: undefined;
						setAttributes( {
							titleTextColor: preset?.slug,
							customTitleTextColor: preset ? undefined : newColor,
						} );
					} }
				/>
			</BaseControl>
		</PanelBody>
	);
}
