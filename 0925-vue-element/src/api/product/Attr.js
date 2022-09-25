import request from '@/utils/request';

//获取一级分类的接口
export const reqCategroy1Id = () => request({ url: '/admin/product/getCategory1', method: 'get' });

//获取二级分类的接口
export const reqCategroy2Id = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' });

//获取三级分类的接口
export const reqCategroy3Id = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' });

//获取三级分类数据的接口--平台属性
export const reqattrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' });

//添加或更新属性的接口
export const reqaddOrupdateAttr = (data) => request({ url: '/admin/product/saveAttrInfo', method: 'post', data });

//删除某个属性值的接口
export const reqdeleteAttrvalue = (attrId) => request({ url: `/admin/product/deleteAttr/${attrId}`, method: 'delete' });