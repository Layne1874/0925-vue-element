import request from '@/utils/request';

//获取页面spu数据
export const reqgetpageList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } });


//获取spu基本属性的接口
export const reqgetSpubyspuId = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' });


//销售属性的接口
export const reqgetbaseAttr = () => request({ url: `/admin/product/baseSaleAttrList`, method: 'get' });

//删除某个spu的接口
export const reqgdeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' });

//品牌的接口
export const reqbaseTrademarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' });


//销售属性的接口
export const reqsaleValue = () => request({ url: `/admin/product/baseSaleAttrList`, method: 'get' });

//获取spu图片数据的接口
export const reqgetspuimgList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });

//修改或添加spu
export const reqAddOrUpdateSpu = (spuInfo) => {
    //携带的参数有id--修改spu
    if (spuInfo.id) {
        return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo });
    } else {
        //携带的参数不带id--添加spu
        return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo });
    }
};

//获取spu添加sku
export const reqfindspuByid = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' });

//获取spu销售属性
export const reqspuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' });

//获取spu图片数据
export const reqspuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });

//获取平台属性数据接口
export const reqAttrInfoList = (category1Id, category2Id, category3Id,) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' });

//添加sku的接口
export const reqAddSku = (skuInfo) => request({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo });