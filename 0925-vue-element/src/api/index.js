import * as spu from '@/api/product/spu';
import * as sku from '@/api/product/sku';
import * as Attr from '@/api/product/Attr';
import * as tradeMark from '@/api/product/tradeMark';

import permission from '@/api/acl/permission'
import role from '@/api/acl/role'
import * as user from '@/api/acl/user'


//对外暴露4个产品接口
export default {
    spu,
    sku,
    Attr,
    tradeMark,
    permission,
    role,
    user
}