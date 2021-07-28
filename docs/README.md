## 安装

```shell
$ git clone https://github.com/202780181/img-parse.git

$ npm install
```

## 运行

```shell
$ npm run dev
```



## 1. 图片压缩API接口

**请求类型 :**  `method`: `POST`

**必选参数 :**   `file`: 文件流(`stream`)

**可选参数 :**  
`isFile`: `(true|false)` 不传默认为`true`, 即返回二进制文件流；`false` 时返回文件url地址。

**提交方式 :**   `Content-Type`: `multipart/form-data`

**接口地址 :** `https://img.gitbycode.cn/api/parse`

**使用提示 :** `5-7MB 大小文件平均响应时间为 ~5s 左右;请添加try catch 捕获可能发生的异常情况。`

## 错误类型  
	[.jpg  .jpeg  .jpeg  .png  .gif] -- 受支持
	
	其他格式格式文件上传匀返回(400 Bad request)


## 测试地址


[https://img.gitbycode.cn/test/upload](https://img.gitbycode.cn/test/upload)
	


## 关于此文档

[Squoosh](https://github.com/GoogleChromeLabs/squoosh/) 是一种图像压缩 Web 应用程序，可通过多种格式减小图像大小。  
`img-parse` 不会将您的图像保存在服务器以及其他地方。所有图像压缩后不存档。

## License	

[The MIT License (MIT)](https://github.com/Binaryify/NeteaseCloudMusicApi/blob/master/LICENSE)
