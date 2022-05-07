/*
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2021-04-21 15:55:34
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-09 14:53:58
 */
import request from '@/utils/request'
import URL from '@/api/baseUrl'
export default class Menu {
  /**
   * 获取菜单列表
   * @param {} data
   */
  static list (data = {}) {
    return request.get(`${URL.system}/menu/list`, data)
  }
  /**
   * 新增菜单
   * @param {} data
   */
  static add (data = {}) {
    return request.post(`${URL.system}/menu/add`, data)
  }
  /**
   * 修改菜单
   * @param {} data
   */
  static edit (data = {}) {
    return request.put(`${URL.system}/menu/edit`, data)
  }
  /**
   * 删除菜单
   * @param {} data
   */
  static remove (data) {
    return request.delete(`${URL.system}/menu/delete`, null, {
      params: data
    })
  }
  /**
   * 根据菜单编号获取详细信息
   * @param {} data
   */
  static getInfo (params) {
    return request.get(`${URL.system}/menu/${params}`)
  }
  /**
   * 获取菜单下拉树列表
   * @param {} data
   */
  static getMenuList (params) {
    return request.get(`${URL.system}/menu/treeselect`, params)
  }
  /**
   * 加载对应角色菜单列表树
   * @param {} data
   */
  static getMenuListByRole (params) {
    return request.get(`${URL.system}/menu/roleMenuTreeselect`, params)
  }
  /**
   * 获取下级菜单
   * @param {} data
   */
  static listByParentId (id) {
    return request.get(`${URL.system}/menu/listByParentId/${id}`)
  }
}
