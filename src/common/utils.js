const isEmpty = (str) => !str || 0 === str.length;

const isBlank = (str) => !str || str.trim().length === 0;

export { isEmpty, isBlank };
