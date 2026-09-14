import request from '@/request/request';
export function login(method,params ){
    return request.post('/api/system/user',{
            method: method,
            params: params
    })
}
export function cfListFun(method, params ){
    return request.post('/api2/axd/prePrescriptionInfo/'+ method,params)
}

export function viewLogFun(method, params ){
    return request.post('/api2/axd/viewLog/'+ method,params)
}

export function userFun(method, params ){
    return request.post('/api2/axd/user/'+ method,params)
}

export function cfTraceFun(method, params ){
    return request.post('/api/wptp/trace/'+ method,params)
}
export function statisticFun(method, params ){
    return request.post('/api/stat/statistic/'+ method,params)
}

export function configModuleFun(method, params ){
    return request.post('/api2/axd/configModule/'+ method,params)
}
