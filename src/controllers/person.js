const getPerson =  async function (req, res, next) {
  try {
    res.send('hello, user!')
  } catch (e) {
    res.status(404).send(e.message)
  }
};

module.exports = {
  getPerson
};
