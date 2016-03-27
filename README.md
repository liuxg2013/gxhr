# gxhr
javascript请求http协议，可以传输xml，二进制，json，字符串，document数据
@author liuxg

/**
 * 封装XMLHttpRequest对象，XMLHttpRequest
 * api参考http://blog.csdn.net/yingxiake/article/details/50981265 
 * 参数如下 
 * url - >请求路径 
 * type - > 请求方法类型get or post 
 * async - > boolean是否异步，默认是true异步 
 * username ->用户名 
 * possword - >密码 
 * xhr - >给调用者传递一个XMLHttpRequest对象，如果用户执行返回true，则说明用户自己处理XMLHttpRequest对象，否则自己处理XMLHttpRequest对象
 * dataType -> 服务器响应类型有,有arraybuffer，blob，document，json，text 
 * headers - >设置头部信息，例如 headers : {"content-type" : "image/png","Accept" : "text/plain,text/html"} 
 * wtimeout - >超时时间记住有w前缀 withCredentials - > boolean类型 是否跨域，默认是不跨域
 * false 事件列表 所有事件的回调的参数为data flag event 
 * data 为请求的返回数据， 
 * flag 有来区分xmlHttpRequest，upload事件还是downlaod事件还是全局事件 
 * event 事件对象 
 * 事件如下： 
 * timeout 超时的回调，必须手动设置wtimeout才会触发 
 * readystatechange 对象状态改有UNSENT,OPENED,HEADERS_RECEIVED,LOADING,DONE对应的value是0，1，2，3，4 
 * beforeSend 请求之前的回调
 * success 请求成功的回调状态码是100~399 
 * error 请求失败的回调 
 * progress进度回调，根据flag为upload还是download来区分是上传进度还是下载进度 
 * complete 请求完成的回调，不管请求成功或者失败
 * 返回数据
 * 返回XMLHttpRequest对象
 */
