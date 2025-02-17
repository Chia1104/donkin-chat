import { produce } from 'immer';

export const preventLeavingFn = (e: BeforeUnloadEvent, message?: string) => {
	// set returnValue to trigger alert modal
	// Note: No matter what value is set, the browser will display the standard text
	e.returnValue = message || 'Are you sure you want to leave?';
};

export const toggleBooleanList = (ids: string[], id: string, loading: boolean) => {
	return produce(ids, draft => {
		if (loading) {
			if (!draft.includes(id)) draft.push(id);
		} else {
			const index = draft.indexOf(id);

			if (index >= 0) draft.splice(index, 1);
		}
	});
};
