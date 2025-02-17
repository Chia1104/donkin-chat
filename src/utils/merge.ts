import type { merge as _merge } from 'lodash-es';
import { isEmpty, mergeWith } from 'lodash-es';

/**
 * Merge two objects, arrays, or values with custom merge strategy
 * @param target
 * @param source
 */
export const merge: typeof _merge = <T = object>(target: T, source: T) =>
	mergeWith({}, target, source, (obj, src) => {
		if (Array.isArray(obj)) return src;
	});

interface MergeableItem {
	[key: string]: any;
	id: string;
}

/**
 * Merge two arrays based on id, preserving metadata from default items
 * @param defaultItems Items with default configuration and metadata
 * @param userItems User-defined items with higher priority
 */
export const mergeArrayById = <T extends MergeableItem>(defaultItems: T[], userItems: T[]): T[] => {
	// Create a map of default items for faster lookup
	const defaultItemsMap = new Map(defaultItems.map(item => [item.id, item]));

	// Process user items with default metadata
	const mergedItems = userItems.map(userItem => {
		const defaultItem = defaultItemsMap.get(userItem.id);
		if (!defaultItem) return userItem;

		// Merge strategy: use default value when user value is null or undefined
		const mergedItem: T = { ...defaultItem };
		Object.entries(userItem).forEach(([key, value]) => {
			// Only use user value if it's not null and not undefined
			// and not empty object
			if (value !== null && value !== undefined && !(typeof value === 'object' && isEmpty(value))) {
				// @ts-expect-error - value is of type any
				mergedItem[key] = value;
			}
		});

		return mergedItem;
	});

	// Add items that only exist in default configuration
	const userItemIds = new Set(userItems.map(item => item.id));
	const onlyInDefaultItems = defaultItems.filter(item => !userItemIds.has(item.id));

	return [...mergedItems, ...onlyInDefaultItems];
};
