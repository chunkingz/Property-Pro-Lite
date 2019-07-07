
const getProps = (data, res, errMsg) => {
  if (data !== undefined) {
    return res.status(200).send({
      status: 'success',
      data: {
        message: 'Property successfully retrieved',
        data
      }
    });
  }
  return res.status(400).send({
    status: 'error',
    error: errMsg,
  });
};

export default getProps;
