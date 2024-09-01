export type Result<T> =
	| {
			type: "success";
			data: T;
	  }
	| {
			type: "error";
			error: string;
	  };

export type ResponseError = {
	error: string;
};
