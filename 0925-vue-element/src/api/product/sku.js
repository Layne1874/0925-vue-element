import request from '@/utils/request';

//获取一级分类的接口
export const reqCategroy1Id = () => request({ url: '/admin/product/getCategory1', method: 'get' });

//获取二级分类的接口
export const reqCategroy2Id = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' });

//获取三级分类的接口
export const reqCategroy3Id = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' });



//获取sku列表数据的接口
export const reqSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' });


//上架商品接口
export const reqonSale = (skuId) => request({ url: `admin/product/onSale/${skuId}`, method: 'get' });

//下架sku接口
export const reqcancelSale = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' });

//获取sku的接口
export const reqgetSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' });

//删除某个sku的接口
export const reqdeleteSku = (skuId) => request({ url: `/admin/product/deleteSku/${skuId}`, method: 'delete' });
