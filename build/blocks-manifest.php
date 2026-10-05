<?php
// This file is generated. Do not modify it manually.
return array(
	'ufo-modale' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ufo/modale',
		'version' => '1.0.9',
		'title' => 'Modal',
		'category' => 'widgets',
		'description' => 'Insert a modal dialog that opens on trigger. Configure content and behaviour in the editor; the modal is displayed on the frontend when activated.',
		'attributes' => array(
			'headingLevel' => array(
				'type' => 'number',
				'default' => 2
			),
			'title' => array(
				'type' => 'string',
				'default' => ''
			),
			'titleFontFamily' => array(
				'type' => 'string'
			),
			'titleFontSize' => array(
				'type' => 'string'
			),
			'customTitleFontSize' => array(
				'type' => 'string'
			),
			'titleTextColor' => array(
				'type' => 'string'
			),
			'customTitleTextColor' => array(
				'type' => 'string'
			),
			'content' => array(
				'type' => 'string',
				'default' => ''
			),
			'modalId' => array(
				'type' => 'string',
				'default' => ''
			),
			'closedBy' => array(
				'type' => 'string',
				'default' => 'any',
				'enum' => array(
					'any',
					'closerequest',
					'none'
				)
			),
			'enableCloseButton' => array(
				'type' => 'boolean',
				'default' => true
			),
			'closeButtonLabel' => array(
				'type' => 'string'
			),
			'displayIconOnly' => array(
				'type' => 'boolean',
				'default' => false
			),
			'preventScroll' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'example' => array(
			
		),
		'supports' => array(
			'align' => array(
				'wide',
				'full'
			),
			'dimensions' => array(
				'height' => true,
				'minHeight' => true,
				'__experimentalSkipSerialization' => true
			),
			'color' => array(
				'background' => true,
				'text' => true,
				'__experimentalSkipSerialization' => true
			),
			'spacing' => array(
				'padding' => true,
				'blockGap' => true,
				'__experimentalSkipSerialization' => array(
					'padding'
				)
			),
			'html' => false
		),
		'textdomain' => 'ufo-modale',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	)
);
