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
;
(function(window) {

	window.gxhr = function(plain) {

		if (plain == undefined)
			plain = {}; // 避免空指针

		/**
		 * 设置属性
		 */
		function setProperties(gxhr) {
			if (plain.dataType)
				gxhr.responseType = plain.dataType; // 设置服务器返回的数据类型
			if (plain.wtimeout)
				gxhr.timeout = plain.wtimeout; // 设置timeout时间
			if (plain.crossDomain)
				gxhr.withCredentials = plain.crossDomain; // 设置是否跨域

		}

		/**
		 * error的处理函数
		 */
		function error(gxhr) {
			return {
				status : gxhr.status,
				readyState : gxhr.readyState,
				statusText : gxhr.statusText
			};
		}

		/**
		 * 设置事件回调
		 */
		function setCallback(gxhr) {

			// 下载事件
			gxhr.onstartload = function(ev) {
				if (plain.beforeSend)
					plain.beforeSend.call(this, null, "download", ev);
			}

			gxhr.onabort = function(ev) {
				if (plain.error)
					plain.error.call(this, error(this), "download", ev);
			}
			gxhr.onerror = function(ev) {
				if (plain.error)
					plain.error.call(this, error(this), "download", ev);
			}
			gxhr.onload = function(ev) {

				if (100 <= this.status < 399) { // 成功
					if (plain.success)
						plain.success.call(this, this.response, "download", ev);
				} else {// 失败
					if (plain.error)
						plain.error.call(this, error(this), "download", ev);
				}

			}
			gxhr.onloadend = function(ev) {
				if (plain.complete)
					plain.complete.call(this, null, "download", ev);
			}
			gxhr.onprogress = function(ev) {
				if (ev.lengthComputable) {
					if (plain.progress) {
						var pencent = ((ev.loaded / ev.total) * 100).toFixed(2)
								+ "%";
						plain.progress.call(this, pencent, "download", ev);
					}

				}
			}

			// 上传事件
			gxhr.upload.onstartload = function(ev) {
				if (plain.beforeSend)
					plain.beforeSend.call(this, null, "upload", ev);
			}

			gxhr.upload.onabort = function(ev) {
				if (plain.error)
					plain.error.call(this, error(this), "upload", ev);
			}
			gxhr.upload.onerror = function(ev) {
				if (plain.error)
					plain.error.call(this, error(this), "upload", ev);
			}
			gxhr.upload.onload = function(ev) {

				if (100 <= this.status < 399) { // 成功
					if (plain.success)
						plain.success.call(this, this.response, "upload", ev);
				} else {// 失败
					if (plain.error)
						plain.error.call(this, error(this), "upload", ev);
				}
			}
			gxhr.upload.onloadend = function(ev) {
				if (plain.complete)
					plain.complete.call(this, null, "upload", ev);
			}
			gxhr.upload.onprogress = function(ev) {
				if (ev.lengthComputable) {
					var pencent = ((ev.loaded / ev.total) * 100).toFixed(2)
							+ "%";
					if (plain.progress)
						plain.progress.call(this, pencent, "upload", ev);
				}
			}

			// 状态改变
			gxhr.onreadystatechange = function(ev) {

				if (this.readyState == 1 && plain.headers
						&& isPlainObject(plain.headers)) // 状态为opend
					for ( var key in plain.headers) {
						gxhr.setRequestHeader(key, plain.headers[key]);
					}

				if (plain.readystatechange)
					plain.readystatechange.call(this, this.readyState,
							"global", ev);
			}

			// 时间延时
			gxhr.ontimeout = function(ev) {
				if (plain.timeout)
					plain.timeout.call(this, null, "global", ev);
			}

		}

		/**
		 * 设置上传参数
		 */
		function setPlainObjectData() {
			var fd = new FormData();
			if (plain.data && isPlainObject(plain.data)) { // 有data数据
				for ( var key in plain.data) {
					fd.append(key, plain.data[key]);
				}
			}
			return fd;
		}

		/**
		 * 判断是否json对象
		 */
		function isPlainObject(obj) {

			if (typeof obj !== "object" || obj.nodeType || obj === obj.window) {// 不是对象，不是dom节点，不是window对象
				return false;
			}

			if (obj.constructor
					&& !{}.hasOwnProperty.call(obj.constructor.prototype,
							"isPrototypeOf")) {
				return false;
			}

			return true;

		}

		var gxhr = new XMLHttpRequest();
		var agent = false; // 用户是否自己需要代理XMLHttpRequest
		if (plain.xhr)// 给调用者传递一个XMLHttpRequest对象，如果用户执行返回true，则说明用户自己处理XMLHttpRequest对象，否则自己处理XMLHttpRequest对象
			agent = plain.xhr.call(this);

		if (!agent) {
			setProperties(gxhr);
			setCallback(gxhr);
			gxhr.open(plain.type ? plain.type : "POST", plain.url,
					plain.async ? plain.async : true, plain.username,
					plain.password);
			gxhr.send(isPlainObject(plain.data) ? setPlainObjectData()
					: plain.data);
		}

		return gxhr;

	};
})(window)
