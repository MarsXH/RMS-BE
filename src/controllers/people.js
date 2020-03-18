const People = require('../models/people')
const { get } = require('lodash')

const getPeople =  async function (req, res, next) {
  if (get(req, 'userInfo.user_role') !== 0) {
    try {
      const allPeople = await People.find({})
      return res.send({ success: true, code: 1, people_list: allPeople || [] })
    } catch (error) {
      return res.send({ success: true, code: 0, message: '获取人员列表失败！error:' + error })
    }
  } else {
    return res.send({ success: true, code: 0, message: '权限不足，禁止访问！' })
  }
};

const addPeople =  async function (req, res, next) {
  if (get(req, 'userInfo.user_role') > 1) {
    try {
      let newPeopleInfo = req.body
      const rows = await People.find().sort({'people_id':-1}).limit(1)
      if (rows && rows.length) {
        newPeopleInfo.people_id = rows[0].people_id + 1
      } else {
        newPeopleInfo.people_id = 0
      }
      newPeopleInfo = await People.create(newPeopleInfo)
      return res.send({ success: true, code: 1, people: newPeopleInfo })
    } catch (error) {
      return res.send({ success: true, code: 0, message: '新增人员失败！error:' + error })
    }
  } else {
    return res.send({ success: true, code: 0, message: '权限不足，禁止访问！' })
  }
};

const updatePeople =  async function (req, res, next) {
  if (get(req, 'userInfo.user_role') > 1) {
    try {
      const peopleUuid = get(req, 'body.people_uuid')
      const peopleInfo = get(req, 'body.people_info')
      const newPeopleInfo = await People.update({ people_uuid: peopleUuid }, peopleInfo)
      return res.send({ success: true, code: 1, people: newPeopleInfo })
    } catch (error) {
      return res.send({ success: true, code: 0, message: '更新人员失败！error:' + error })
    }
  } else {
    return res.send({ success: true, code: 0, message: '权限不足，禁止访问！' })
  }
};

const deletePeople =  async function (req, res, next) {
  if (get(req, 'userInfo.user_role') > 1) {
    try {
      const peopleUuid = get(req, 'query.people_uuid')
      const checkPeople = await People.findOne({ people_uuid: peopleUuid })
      if (checkPeople) {
        const newPeopleInfo = await People.remove({
          people_uuid: peopleUuid
        })
        return res.send({ success: true, code: 1, people: newPeopleInfo })
      } else {
        return res.send({ success: true, code: 0, message: '该人员不存在！' })
      }
    } catch (error) {
      return res.send({ success: true, code: 0, message: '删除人员失败！error:' + error })
    }
  } else {
    return res.send({ success: true, code: 0, message: '权限不足，禁止访问！' })
  }
};

module.exports = {
  getPeople,
  addPeople,
  updatePeople,
  deletePeople
};
