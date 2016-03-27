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
 * wtimeout - >超时时间记住有w前缀 
 * withCredentials - > boolean类型 是否跨域，默认是不跨域
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

使用demo ??

get方式提交数据
```
window.gxhr({	
			url : "/whats/task/xmlHttpRequest?name=liuxg&age=32",
			type :  "GET",
			dataType : "json",
			success : function(data,ev,xhr){
				console.log("success");
			},
			error : function(ev){
				console.log("error");
			}
			
		});
```
用post方式提交数据

1. 提交json数据

```
window.gxhr({
	
			url : "/whats/task/xmlHttpRequest",
			data : {"name" : "lihua","age" : 32},
			dataType : "json",
			success : function(data,ev,xhr){
				console.log("success");
			},
			error : function(ev){
				console.log("error");
			}
			
		});
```
2. post提交表单

```
//前段代码
 <form id = "myform">
     <input type = "file" name = "file"/>
     <input type = "text" value = "lihua" name = "name" />
     <input type = "text" value = "32" name = "age" />
     <button type = "button" id = "mybutton">提交表单</button>
  </form>

//js代码
document.getElementById("mybutton").onclick = function(){
	window.gxhr({
				url : "/whats/task/xmlHttpRequest",
				data : new FormData(document.getElementById('myform')),
				dataType : "json",
				success : function(data,ev,xhr){
					console.log("success");
				},
				error : function(ev){
					console.log("error");
				}
				
			});
};

//后台springmvc接收数据
@RequestMapping("/xmlHttpRequest")
	@ResponseBody
	public String xmlHttpRequest(MultipartFile file ,String name,Integer age ,HttpServletRequest req ,HttpServletResponse res) throws IOException{
		
		File tfile = FileUtil.makefile("D:\\upload\\20160325\\color.png");
	    FileUtils.copyInputStreamToFile(file.getInputStream(),  tfile);//保存上传的文件
		System.out.println(req.getContentType());
		
		JSONObject kk = new JSONObject();
		kk.put("name", name);
		kk.put("age", age);
		
		return kk.toString() ;
	}
```

3. 利用send(blod) ，直接读取input type = file 标签上传文件

```
//前段代码
  <input type = "file" name = "file" id = "myfile"/>
//js代码

var file = document.getElementById("myfile").files[0];	
	window.gxhr({
		
				url : "/whats/task/xmlHttpRequest",
				data : file, //file集成于blod
				dataType : "json",
				success : function(data,ev,xhr){
					console.log("success");
				},
				error : function(ev){
					console.log("error");
				}
				
			});
//后台用springmvc接收数据
@RequestMapping("/xmlHttpRequest")
	@ResponseBody
	public String xmlHttpRequest(HttpServletRequest req ,HttpServletResponse res) throws IOException{
		
		File tfile = FileUtil.makefile("D:\\upload\\20160325\\color.png");
	    FileUtils.copyInputStreamToFile(req.getInputStream(), tfile);
		System.out.println(req.getContentType());
		
		JSONObject kk = new JSONObject();
		kk.put("name", name);
		kk.put("age", age);
		
		return kk.toString() ;
	}
```
4. 利用send(blod) 以及FormData上传文件

```
//前段代码
  <input type = "file" name = "file" id = "myfile"/>
//js代码

var file = document.getElementById("myfile").files[0];	

var fd = new FormData(); //formdata构造函数参数可以为空
fd.append("file",file); //模拟表单提交
	window.gxhr({
		
				url : "/whats/task/xmlHttpRequest",
				data : fd, //file集成于blod
				dataType : "json",
				success : function(data,ev,xhr){
					console.log("success");
				},
				error : function(ev){
					console.log("error");
				}
				
			});
//后台用springmvc接收数据
@RequestMapping("/xmlHttpRequest")
	@ResponseBody
	public String xmlHttpRequest(MultipartFile file,String name,Integer age ,HttpServletRequest req ,HttpServletResponse res) throws IOException{
		
		File tfile = FileUtil.makefile("D:\\upload\\20160325\\color.png");
	    FileUtils.copyInputStreamToFile(file.getInputStream(), tfile);
		System.out.println(req.getContentType());
		
		JSONObject kk = new JSONObject();
		kk.put("name", name);
		kk.put("age", age);
		
		return kk.toString() ;
	}
```
3. 利用send(blod) ，利用FileReader.readAsArrayBuffer来获取二进制数据上传

```
//前段代码
<input type = "file" name = "file" id = "myfile"/>

//js代码
var $file = document.getElementById("myfile");
var reader = new FileReader();

reader.onload = function(ev){ //读取完成触发
  var result = reader.result;
  window.gxhr({
		
		url : "/whats/task/xmlHttpRequest",
		data : result,
		dataType : "json",
		success : function(data,ev,xhr){
		    this.getAllResponseHeaders();//获取所有响应头
		    this.getResponseHeader("content-type"); //根据key获取响应头
			console.log("success");
		},
		error : function(ev){
			console.log("error");
		}
		
	});
}

$file.onchange = function(){
	
	var file = $file.files[0]; //获取文件对象file,file继承Blob对象  
    reader.readAsArrayBuffer(file); //已文本的方式读取
	
};

//后台用springmvc
@RequestMapping("/xmlHttpRequest")
	@ResponseBody
	public String xmlHttpRequest(HttpServletRequest req ,HttpServletResponse res) throws IOException{
		
		File tfile = FileUtil.makefile("D:\\upload\\20160325\\color.png");
	    FileUtils.copyInputStreamToFile(req.getInputStream(), tfile);
		System.out.println(req.getContentType());
		
		JSONObject kk = new JSONObject();
		kk.put("name", name);
		kk.put("age", age);
		
		return kk.toString() ;
	}

```

3. 利用progress上传文件，并读进度

```
//前段代码
 <form id = "myform">
     <input type = "file" name = "file" id = "myfile"/>
     <button type = "button" id = "mybutton">点击执行</button>
     <button type = "button" id = "abort">停止执行</button>
  </form>
  <div class = "pb">
     <div class = "progress" ></div>
  </div>

//js代码
var progress = document.querySelector(".progress");
var $file = document.getElementById("myfile");
var xhr = null;
document.getElementById("mybutton").onclick = function() {
	var file = $file.files[0];
	xhr = window.gxhr({

		url : "/whats/task/xmlHttpRequest",
		data : file,
		dataType : "json",
		progress : function(data, flag, ev) {
			if(flag == "upload"){//根据flag判断是上传还是下载进度
				progress.style.width = data;
				progress.innerHTML = flag + "- >" + data;
			}
			console.log("progress data为：" + data + "--flag为：" + flag
					+ " -- readystatechange为： -- " + this.status);
		}

	});
};
document.getElementById("abort").onclick = function() {
	xhr.abort();
}

//springmvc代码
@RequestMapping("/xmlHttpRequest")
	@ResponseBody
	public byte[] xmlHttpRequest(HttpServletRequest req ,HttpServletResponse res) throws IOException{
		
		File tfile = FileUtil.makefile("D:\\upload\\20160325\\color.zip");
	  FileUtils.copyInputStreamToFile(req.getInputStream(), tfile);
	
	}
   
```

3. 利用progress下载文件，并读取下载进度

```
//前段代码
 <form id = "myform">
     <button type = "button" id = "mybutton">点击执行</button>
     <button type = "button" id = "abort">停止执行</button>
  </form>
  <div class = "pb">
     <div class = "progress" ></div>
  </div>

//js代码
var progress = document.querySelector(".progress");
var xhr = null;
document.getElementById("mybutton").onclick = function() {
	xhr = window.gxhr({

		url : "/whats/task/xmlHttpRequest",
		data : {},
		dataType : "blob",
		success : function(data, flag, ev) {//获取二进制数据流，通过URL.createObjectURL可以获取文件链接，
			  
			if(flag == "download"){//手动触发下载
				var aLink = document.createElement('a');
			    var evt = document.createEvent("HTMLEvents");
			    evt.initEvent("click", false, false);
			    aLink.download = "color.png";
			    aLink.href = URL.createObjectURL(data);
			    aLink.dispatchEvent(evt);
			}
		    console.log("success data为：" + data + "--flag为：" + flag
				+ " -- readystatechange为： -- " + this.status);
		},
		progress : function(data, flag, ev) {
			if(flag == "download"){//根据flag判断是上传还是下载进度
				progress.style.width = data;
				progress.innerHTML = flag + "- >" + data;
			}
			console.log("progress data为：" + data + "--flag为：" + flag
					+ " -- readystatechange为： -- " + this.status);
		}

	});
};
document.getElementById("abort").onclick = function() {
	xhr.abort();
}
//springmvc代码
@RequestMapping("/xmlHttpRequest")
	@ResponseBody
	public byte[] xmlHttpRequest(HttpServletRequest req ,HttpServletResponse res) throws IOException{
	return FileCopyUtils.copyToByteArray(new File("D:\\SOFEWARE\\color.png"));
	}
```

3. 请求参数为xml

```
document.getElementById("mybutton").onclick = function() {
	var file = $file.files[0];
	var xml = '<?xml version="1.0" encoding="utf-8" ?>'+
				'<country>'+
				'  <name>中国</name>'+
				'  <province>'+
				'    <name>黑龙江</name>'+
				'    <citys>'+
				'      <city>哈尔滨</city>'+
				'      <city>大庆</city>'+
				'    </citys>'+
				'  </province>'+
				'</country>';
	xhr = window.gxhr({
		url : "/whats/task/xmlHttpRequest",
		data : xml,
		dataType : "json",
		success : function(data, flag, ev) {
			  
			
		    console.log("success data为：" + data + "--flag为：" + flag
				+ " -- readystatechange为： -- " + this.status);
		},
		error : function(error, flag, ev) {
			console.log("error data为：" + error + "--flag为：" + flag
					+ " -- readystatechange为： -- " + this.status);
		}
	});
};

//springmvc解析xml流
@RequestMapping("/xmlHttpRequest")
	@ResponseBody
	public byte[] xmlHttpRequest(HttpServletRequest req ,HttpServletResponse res) throws IOException, ParserConfigurationException, SAXException{
		System.out.println(req.getContentType());
		InputStream is = req.getInputStream();
		DocumentBuilderFactory domfac = DocumentBuilderFactory.newInstance();
		DocumentBuilder dombuilder = domfac.newDocumentBuilder();
		Document doc = dombuilder.parse(is);
		Element root = doc.getDocumentElement();
	}

```


