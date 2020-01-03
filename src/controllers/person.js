const Person = require('../models/person')

const getPerson =  async function (req, res, next) {
  if (get(req, 'userInfo.user_role') !== 0) {
    try {
      const allPerson = await Person.findOne({})
      res.send({ success: true, person_list: allPerson })
    } catch (error) {
      res.status(403).send({ success: false, message: '获取人员列表失败！error:' + error })
    }
  } else {
    res.status(403).send({ success: false, message: '权限不足，禁止访问！' })
  }
};

const addPerson =  async function (req, res, next) {
  if (get(req, 'userInfo.user_role') > 1) {
    try {
      let newPersonInfo = req.body
      const rows = await User.find({}).sort({'person_id':-1}).limit(1)
      if (rows && rows.length) {
        newPersonInfo.person_id = rows[0].person_id + 1
      } else {
        newPersonInfo.person_id = 0
      }
      newPersonInfo = await Person.create(newPersonInfo)
      res.send({ success: true, person: newPersonInfo })
    } catch (error) {
      res.status(403).send({ success: false, message: '新增人员失败！error:' + error })
    }
  } else {
    res.status(403).send({ success: false, message: '权限不足，禁止访问！' })
  }
};

const updatePerson =  async function (req, res, next) {
  if (get(req, 'userInfo.user_role') > 1) {
    try {
      const personUuid = get(req, 'body.person_uuid')
      const newPersonInfo = await Person.update({ person_uuid: personUuid }, req.body)
      res.send({ success: true, person: newPersonInfo })
    } catch (error) {
      res.status(403).send({ success: false, message: '更新人员失败！error:' + error })
    }
  } else {
    res.status(403).send({ success: false, message: '权限不足，禁止访问！' })
  }
};

const deletePerson =  async function (req, res, next) {
  if (get(req, 'userInfo.user_role') > 1) {
    try {
      const personUuid = get(req, 'body.person_uuid')
      const checkPerson = await Person.findOne({ person_uuid: personUuid })
      if (checkPerson) {
        const newPersonInfo = await Person.remove({
          person_uuid: personUuid
        })
        res.send({ success: true, person: newPersonInfo })
      } else {
        res.status(403).send({ success: false, message: '该人员不存在！' })
      }
    } catch (error) {
      res.status(403).send({ success: false, message: '删除人员失败！error:' + error })
    }
  } else {
    res.status(403).send({ success: false, message: '权限不足，禁止访问！' })
  }
};

module.exports = {
  getPerson,
  addPerson,
  updatePerson,
  deletePerson
};
