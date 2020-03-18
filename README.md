# RMS Backend

---

## 项目地址

- [测试环境](http://10.99.104.251:8080/#/admin/dashboard)
- [正式环境](http://10.99.104.241/#/admin/dashboard)


## 项目环境

- Node.js + Express + MongoDB


## 获取代码

- [GitLab地址](https://github.com/MZ8023/RMS-FE.git)


## Git规范

### 分支命名

- 1.1 主分支

> ① master ：随时可供在生产环境中部署的代码

> ② develop： 保存当前稳定并且最新的开发分支(多人开发同一分支)

- 1.2 辅助分支

> 主要用于新功能的并行开发、对生产代码的缺陷进行紧急修复工作。合并到 master 后应该立即删除

> ① 用于开发新功能时所使用的 feature 分支

> ② 用于修正生产代码中的缺陷的 bug 分支

### 代码提交流程

- ==> 从 develop 分支 clone 代码

- ==> 在本地创建本地分支 dev-xxx 开发

- ==> 什么时候 commit

> commit 在什么时候都可以，但是不建议为了保存代码而 commit，每一次 commit 一定是代表代码开发进行到了某一个阶段，可以在后续开发或者合并代码出现错误的时候可以快速回到这个阶段。

> commit 注释:每次提交必须要有提交注释，注释根据本次提交情况，进行简洁描述

用于说明 commit 的类别，只允许使用下面7个标识
```
feat：新功能（feature）
fix：修补bug
docs：文档（documentation）
style： 格式（不影响代码运行的变动）
refactor：重构（即不是新增功能，也不是修改 bug 的代码变动）
test：增加测试
chore：构建过程或辅助工具的变动
```

- ==> 什么时候 push

> ① 代码需要提测，并且自己都测试OK了，如果一次性测试通过则可以把 master 合并到自己的分支，然后 push 自己的分支，进行提测。

> ② 代码提测了，如果有问题，把问题修改好后，再 push 自己的分支。

- ==> push 流程

```bash
# 将自己的代码添加到仓库
git add -A
# 添加提交信息
git commit -m "xxxxxxx"
# 切换到 devlop 分支
git checkout develop
# 获取 dev 最新的代码
git pull
# merge 自己的本地分支到 dev
git merge dex-xxx
# push 代码
git push
# 切换到本地分支继续进行开发
git checkout dev-xxx
# merge develop
git merge develop

```

*注意:在开发过程中需要及时 pull develop 的分支到本地，并 merge 到自己的本地开发分支,避免自己的开发分支代码和 develop 分支的代码差异较大*

## 项目结构
```bash
RMS-BE
	|----node_modules
	|----src
		|----common # 公共js (配置文件/二次封装)
			|----passport-local.js # passport local 策略
		|----config # 数据库配置模块
			|----index.js
		|----controllers # MVC中的C，用户数据与视图的衔接处理
			|----auth.js # 登录、退出等权限控制
			|----people.js
		|----middleware # 中间件
			|----auth.js # token鉴权中间件
		|----models # 处理响应的数据，是数据模型
			|----user.js
			|----people.js
		|----routes # 路由模块
			|----authRouter.js # 登录等权限控制路由
			|----people.js
	|----server.js # 入口文件
	|----package.json
```