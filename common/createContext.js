module.exports = function (uid, projectId,interfaceId) {
  if(!uid || !projectId || !interfaceId){
    console.error('uid projectId interfaceId 不能为空', uid, projectId,interfaceId)
  }

  /**
   * 统一转换为number
   */
  return {
    uid: +uid,
    projectId: +projectId,
    interfaceId: +interfaceId
  }
}