/**
 * Represents the position of a series marker relative to a bar.
 */
export type SeriesMarkerPosition = 'aboveBar' | 'belowBar' | 'inBar';

/**
 * Represents the type of a series marker.
 */
export type SeriesMarkerType = 'loudspeaker' | 'avatar' | 'text' | 'buy' | 'sell';

/**
 * Represents a series marker.
 */
export interface SeriesMarker<TimeType> {
	/**
	 * The time of the marker.
	 */
	time: TimeType;
	/**
	 * The position of the marker.
	 */
	position: SeriesMarkerPosition;
	/**
	 * The type of the marker.
	 */
	type: SeriesMarkerType;
	/**
	 * The color of the marker.
	 */
	color: string;
	/**
	 * The ID of the marker.
	 */
	id?: string;
	/**
	 * The optional text of the marker.
	 */
	text?: string;
	/**
	 * The optional size of the marker.
	 *
	 * @defaultValue `1`
	 */
	size?: number;
	/**
	 * The avatar of src.
	 */
	src?: string;
}

export type MarkerPositions = Record<SeriesMarkerPosition, boolean>;

export type InternalSeriesMarker<TimeType> = SeriesMarker<TimeType> & {
	internalId: number;
};
