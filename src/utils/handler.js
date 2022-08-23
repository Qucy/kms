export const asyncFuncHandler = async (callback) => {
  try {
    const response = await callback();
    return [response, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};
