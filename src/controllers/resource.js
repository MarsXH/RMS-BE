const Resource = require('../models/resource')
const { get } = require('lodash')

const getResource =  async function (req, res, next) {
  if (get(req, 'userInfo.user_role') !== 0) {
    try {
      const { page = 1, size = 10, keyword = '' } = req.body
      const allResource = await Resource.find({})
      return res.send({ success: true, code: 1, resource_list: allResource || [] })
    } catch (error) {
      return res.send({ success: true, code: 0, message: '获取资源列表失败！error:' + error })
    }
  } else {
    return res.send({ success: true, code: 0, message: '权限不足，禁止访问！' })
  }
};

const addResource =  async function (req, res, next) {
  if (get(req, 'userInfo.user_role') > 1) {
    try {
      let newResourceInfo = req.body
      const rows = await Resource.find().sort({'resource_id':-1}).limit(1)
      if (rows && rows.length) {
        newResourceInfo.resource_id = rows[0].resource_id + 1
      } else {
        newResourceInfo.resource_id = 0
      }
      newResourceInfo = await Resource.create(newResourceInfo)
      return res.send({ success: true, code: 1, resource: newResourceInfo })
    } catch (error) {
      return res.send({ success: true, code: 0, message: '新增资源失败！error:' + error })
    }
  } else {
    return res.send({ success: true, code: 0, message: '权限不足，禁止访问！' })
  }
};

const updateResource =  async function (req, res, next) {
  if (get(req, 'userInfo.user_role') > 1) {
    try {
      const resourceUuid = get(req, 'body.resource_uuid')
      const resourceInfo = get(req, 'body.resource_info')
      const newResourceInfo = await Resource.update({ resource_uuid: resourceUuid }, resourceInfo)
      return res.send({ success: true, code: 1, resource: newResourceInfo })
    } catch (error) {
      return res.send({ success: true, code: 0, message: '更新资源失败！error:' + error })
    }
  } else {
    return res.send({ success: true, code: 0, message: '权限不足，禁止访问！' })
  }
};

const deleteResource =  async function (req, res, next) {
  if (get(req, 'userInfo.user_role') > 1) {
    try {
      const resourceUuid = get(req, 'query.resource_uuid')
      const checkResource = await Resource.findOne({ resource_uuid: resourceUuid })
      if (checkResource) {
        const newResourceInfo = await Resource.remove({
          resource_uuid: resourceUuid
        })
        return res.send({ success: true, code: 1, resource: newResourceInfo })
      } else {
        return res.send({ success: true, code: 0, message: '该资源不存在！' })
      }
    } catch (error) {
      return res.send({ success: true, code: 0, message: '删除资源失败！error:' + error })
    }
  } else {
    return res.send({ success: true, code: 0, message: '权限不足，禁止访问！' })
  }
};

module.exports = {
  getResource,
  addResource,
  updateResource,
  deleteResource
};
