# RMS Backend
<!--
node-blog
	|----bin
		|---- www.js 服务器的创建
	|----node_modules
	|----src
		|----config 数据库配置模块（mysql和redis）
			|----db.js
		|----controllers MVC中的C，用户数据与视图的衔接处理
			|----blog.js
			|----user.js
		|----db MVC中的M，用于数据处理
			|----mysql.js
			|----redis.js
		|----models 处理响应的数据，是数据模型
			|----resModel.js
		|----routes 路由模块
			|----blog.js
			|----user.js
	|----app.js 服务器处理程序
	|----package.json
-->