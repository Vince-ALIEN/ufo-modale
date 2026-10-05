# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.10]

* Fork of Blockparty Modal 1.0.9 as UFO Modale: block `ufo/modale`, PHP namespace `Ufo\Modale`, text domain `ufo-modale`, filters `ufo_modale_*`, CSS classes `wp-block-ufo-modale*`.
* Set UFO Agency as author and update project links.
* Require the UFO Blocks plugin: `ufo-blocks/ufo-button` is now the default modal trigger.
* Allow UFO buttons group, UFO button and Contact Form 7 blocks inside the modal; remove `core/buttons` and `core/button`.
* New front markup using the ufo-boilerplate Tailwind utilities (`not-prose`, content card, header and body); color, padding and dimensions supports apply to the card.
* Add title font family, font size and color settings based on theme.json presets.
* Label the dialog with its title (`aria-labelledby`), with an `aria-label` fallback.
* Allow the modal markup and close icon in post content for users without `unfiltered_html`.
* Use Lucide icons (block icon `PictureInPicture`, close icon as a hook-free SVG).
* Align the editor design with the UFO Blocks grid and row blocks.
* Fix: heading level 0 now renders a `<p>` instead of `<h0>`.
* Fix: do not register the block when the build manifest is missing.
* Use a unique Composer autoloader suffix so the plugin can run next to Blockparty Modal.
* Remove the WordPress Playground demo and the wp-env environment.
* CI: prevent script injection in the release workflow and grant it `contents: write`.

## [1.0.9]

* Fix `ufo_modale_inner_allowed_blocks` and `ufo_modale_trigger_allowed_blocks` filters not being applied in the block editor on recent WordPress versions.
* Pass allowed block lists to the editor script via `wp_localize_script` so they are available despite the block editor settings allowlist.

## [1.0.8]

* Add GitHub Actions check and `tests/bin/check-release-version.sh` to validate that release version bumps are consistent across all versioned files.
* Add this changelog file (Keep a Changelog format).
* Update WordPress Playground `blueprint.json` demo page content.
* Run the JavaScript quality workflow when `package.json` changes.
* Exclude the `tests/` directory from plugin distribution archives.
* Remove Psalm from development dependencies and GrumPHP.

## [1.0.7]

* Add block setting for the close button label.

## [1.0.6]

* Fix `blueprint.json` config.

## [1.0.5]

* Add `blueprint.json` to test the plugin on WordPress Playground.
* Add `screen-reader-text` class to close button element when display icon only is selected.

## [1.0.4]

* Filter `ufo_modale_inner_allowed_blocks` to control allowed blocks in the modal.

## [1.0.3]

* Fix: prevent adding linkedModalId attribute to non allowed blocks.
* Set min required PHP version to 8.1

## [1.0.2]

* Filter `ufo_modale_trigger_allowed_blocks` to control which blocks can be modal triggers; dialog margin and InnerBlocks fixes.
* Crawl Modal blocks from patterns
* Style issues

## [1.0.1]

* Fix margin style for dialog element; set to auto by default instead of 0.
* Remove dupplicated InnerBlocks.Content

## [1.0.0]

* Initial release
