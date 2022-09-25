//这个模块主要获取品牌管理的数据模块
import requst from '@/utils/request'

//获取品牌列表接口
export const reqTradeMarkList = (page, limit) => requst({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' });

//处理新增品牌
export const reqAddorUpdateTradeMark = (tradeMark) => {
    //如果带给服务器数据携带ID--则发送修改的请求
    if (tradeMark.id) {
        return requst({ url: `/admin/product/baseTrademark/update`, method: 'put', data: tradeMark });
    } else {
        //如果没带id，则发送新增品牌的请求
        return requst({ url: `/admin/product/baseTrademark/save`, method: 'post', data: tradeMark });
    }
}

//删除品牌的接口
export const reqDeleteTradeMark = (id) => requst({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' });