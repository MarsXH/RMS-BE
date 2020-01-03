const Resource = require('../models/resource')

const getResource =  async function (req, res, next) {
  if (get(req, 'userInfo.user_role') !== 0) {
    try {
      const allResource = await Resource.findOne({})
      res.send({ success: true, resource_list: allResource })
    } catch (error) {
      res.status(403).send({ success: false, message: '获取资源列表失败！error:' + error })
    }
  } else {
    res.status(403).send({ success: false, message: '权限不足，禁止访问！' })
  }
};

const addResource =  async function (req, res, next) {
  if (get(req, 'userInfo.user_role') > 1) {
    try {
      let newResourceInfo = req.body
      const rows = await User.find({}).sort({'resource_id':-1}).limit(1)
      if (rows && rows.length) {
        newResourceInfo.resource_id = rows[0].resource_id + 1
      } else {
        newResourceInfo.resource_id = 0
      }
      newResourceInfo = await Resource.create(newResourceInfo)
      res.send({ success: true, resource: newResourceInfo })
    } catch (error) {
      res.status(403).send({ success: false, message: '新增资源失败！error:' + error })
    }
  } else {
    res.status(403).send({ success: false, message: '权限不足，禁止访问！' })
  }
};

const updateResource =  async function (req, res, next) {
  if (get(req, 'userInfo.user_role') > 1) {
    try {
      const resourceUuid = get(req, 'body.resource_uuid')
      const newResourceInfo = await Resource.update({ resource_uuid: resourceUuid }, req.body)
      res.send({ success: true, resource: newResourceInfo })
    } catch (error) {
      res.status(403).send({ success: false, message: '更新资源失败！error:' + error })
    }
  } else {
    res.status(403).send({ success: false, message: '权限不足，禁止访问！' })
  }
};

const deleteResource =  async function (req, res, next) {
  if (get(req, 'userInfo.user_role') > 1) {
    try {
      const resourceUuid = get(req, 'body.resource_uuid')
      const checkResource = await Resource.findOne({ resource_uuid: resourceUuid })
      if (checkResource) {
        const newResourceInfo = await Resource.remove({
          resource_uuid: resourceUuid
        })
        res.send({ success: true, resource: newResourceInfo })
      } else {
        res.status(403).send({ success: false, message: '该资源不存在！' })
      }
    } catch (error) {
      res.status(403).send({ success: false, message: '删除资源失败！error:' + error })
    }
  } else {
    res.status(403).send({ success: false, message: '权限不足，禁止访问！' })
  }
};

module.exports = {
  getResource,
  addResource,
  updateResource,
  deleteResource
};
