/**
 * Lucide "X" icon as a plain SVG (no hooks).
 *
 * lucide-react components call useContext, which throws (React error #321)
 * when the block save() output is serialized by @wordpress/element outside
 * of a React render. Same markup as lucide-react's <X />.
 *
 * @see https://lucide.dev/icons/x
 *
 * @param {Object} props           Component props.
 * @param {string} props.className Extra classes for the svg element.
 * @return {Element} Close icon.
 */
export default function CloseIcon( { className } ) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={ [ 'lucide lucide-x', className ]
				.filter( Boolean )
				.join( ' ' ) }
			aria-hidden="true"
		>
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</svg>
	);
}
