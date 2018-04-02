const INITIAL_STATE = {
	user: null
};

export default (state = INITIAL_STATE, action) => {
	console.log(action);

	switch(action.type) {
		default:
			return state;
	}
};
