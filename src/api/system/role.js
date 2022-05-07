/*
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2021-04-21 15:55:34
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-02-28 14:39:15
 */
import request from '@/utils/request'
import URL from '@/api/baseUrl'
export default class Role {
  /**
   * 获取角色列表
   * @param {} data
   */
  static list (data = {}) {
    return request.get(`${URL.system}/role/list`, data)
  }
  /**
   * 新增修改角色
   * @param {} data
   */
  static addEdit (data = {}) {
    if (data.roleId) {
      return request.put(`${URL.system}/role/edit`, data)
    } else {
      return request.post(`${URL.system}/role/add`, data)
    }
  }
  /**
   * 删除角色
   * @param {} data
   */
  static remove (data) {
    return request.delete(`${URL.system}/role/delete`, data)
  }
  /**
   * 获取权限树
   * @param {} data
   */
  static getTree(data = {}) {
    return request.get(`${URL.system}/menu/roleMenuTreeselect`, data)
  }
  /**
   * 新增/编辑权限
   * @param {} data
   */
  static addEditRole (data = {}, checkedKeys) {
    const urlStr = checkedKeys ? 'editRoleMenuByRoleId' : 'addRoleMenuByRoleId'
    return request.post(`${URL.system}/role/${urlStr}`, data)
  }
}
