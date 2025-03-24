export type BirdeyeResponse<T = unknown> =
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
			message: string;
	  };
