// pages/demo/snake/snake.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
		gameStart: false,  // 游戏是否开始
		score: 0, // 当前得分
		maxScore: 0, // 历史最高分
		isMaxActive: false,
		rows: 28, // 操场行数
		cols: 22, // 操场列数
		ground: [[]], // 操场方块位置
		snake: '', // 贪吃蛇的位置
		food: [], // food位置
		startX: 0,
		startY: 0,
		endX: 0,
		endY: 0,
		flag: 0, // 当前贪吃蛇移动的方向，0 右，1 下，2 左， 3 上

		timer: null,
		modaleHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.initGround(this.data.rows, this.data.cols) // 初始化操场
		console.log(wx.getStorageSync("MaxScore"))
		if (wx.getStorageSync("MaxScore")) {
			this.setData({
				maxScore: wx.getStorageSync("MaxScore"),
				isMaxActive: true
			})
		} else {
			this.setData({
				isMaxActive: false
			})
		}
  },

	goStart: function () {
		this.setData({
			gameStart: true
		})
		this.onLoad()
		this.initSnake(3)                               // 初始化贪吃蛇位置
		this.initFood()                                 // 初始化food
		this.move(0)
	},

	/**
	 * 初始化操场
	 */
	initGround: function (rows, cols) {
		this.data.ground = []
		for (let i = 0; i < rows; i++) {
			let arr = []
			this.data.ground.push(arr)
			for (let j = 0; j < cols; j++) {
				this.data.ground[i].push(0)
			}
		}
		this.setData({
			ground: this.data.ground
		})
	},

	/**
	 * 初始化贪吃蛇
	 */
	initSnake: function (n) {
		this.data.snake = []
		for (let i = 0; i < n; i++) {
			this.data.ground[0][i] = 1
			this.data.snake.push([0,i])
		}
		this.setData({
			ground: this.data.ground,
			snake: this.data.snake
		})
	},

	/**
	 * 初始化food
	 */
	initFood: function () {
		let row = Math.floor(Math.random()*this.data.rows)
		let col = Math.floor(Math.random() * this.data.cols)
		var ground = this.data.ground
		// while(row===0 && col<3){
		// 	row = Math.floor(Math.random() * this.data.rows)
		// 	col = Math.floor(Math.random() * this.data.cols)
		// }
		ground[row][col] = 2
		this.setData({
			ground: ground,
			food: [row, col]
		})
		console.log(this.data.food)
	},

	/**
	 * 判断鼠标滑动方向
	 */
	touchStart: function (event) {
		this.data.startX = event.touches[0].pageX
		this.data.startY = event.touches[0].pageY
	},

	touchMove: function (event) {
		this.data.endX = event.touches[0].pageX
		this.data.endY = event.touches[0].pageY
		// console.log(this.data.endX, this.data.endY)
	},

	touchEnd: function (event) {
		let tX = this.data.endX ? (this.data.endX - this.data.startX) : 0
		let tY = this.data.endY ? (this.data.endY - this.data.startY) : 0
		console.log(tX, tY)
		if (!this.data.gameStart) {
			return false
		}
		if (tY < 0 && Math.abs(tX) <= Math.abs(tY)) { // 向上滑动
			this.data.flag = 3
			console.log("向上滑动")
		} else if (tY > 0 && Math.abs(tX) <= Math.abs(tY)) { // 向下滑动
			this.data.flag = 1
			console.log("向下滑动")
		} else if (tX < 0 && Math.abs(tX) > Math.abs(tY)) { // 向左滑动
			this.data.flag = 2
			console.log("向左滑动")
		} else if (tX > 0 && Math.abs(tX) > Math.abs(tY)) { // 向右滑动
			this.data.flag = 0
			console.log("向右滑动")
		}
		if(this.data.modaleHidden){
			this.move(this.data.flag)
		}		
	},
	/**
	 * snake 移动
	 */
	move: function (state) {
		clearInterval(this.data.timer)
		// console.log(this.data.snake.length)
		var that = this
		switch(state){ // 判断滑动方向
			case 0:
				this.data.timer = setInterval(function(){
					that.moveRight()
				}, 600)
				break
			case 1:
				this.data.timer = setInterval(function () {
					that.moveBottom()
				}, 600)
				break
			case 2:
				this.data.timer = setInterval(function () {
					that.moveLeft()
				}, 600)
				break
			case 3:
				this.data.timer = setInterval(function () {
					that.moveTop()
				}, 600)
				break
		}
	},

	moveRight: function () {
		// console.log(this.data.snake)
		var snakeArr = this.data.snake
		var snakeLen = snakeArr.length
		var snakeHead = snakeArr[snakeLen - 1]
		var snakeTail = snakeArr[0]
		var ground = this.data.ground

		for (var i = 0; i < snakeLen - 1; i++) {
			snakeArr[i] = snakeArr[i + 1]
		}

		var x = snakeHead[0]
		var y = snakeHead[1] + 1

		if (y >= this.data.cols) {
			this.gameOver()
			return
		}

		snakeArr[snakeLen - 1] = [x, y]
		ground[x][y] = 1
		ground[snakeTail[0]][snakeTail[1]] = 0
		this.setData({
			snake: snakeArr,
			ground: ground
		})
		this.checkGame(snakeTail, [x, y]) // 检查是否gameover
	},
	moveBottom: function () {
		var snakeArr = this.data.snake
		var snakeLen = snakeArr.length
		var snakeHead = snakeArr[snakeLen - 1]
		var snakeTail = snakeArr[0]
		var ground = this.data.ground

		for (var i = 0; i < snakeLen - 1; i++) {
			snakeArr[i] = snakeArr[i + 1]
		}

		var x = snakeHead[0] + 1
		var y = snakeHead[1]

		if (x >= this.data.rows) {
			this.gameOver()
			return
		}

		snakeArr[snakeLen - 1] = [x, y]
		ground[x][y] = 1
		ground[snakeTail[0]][snakeTail[1]] = 0
		this.setData({
			snake: snakeArr,
			ground: ground
		})
		this.checkGame(snakeTail, [x, y]) // 检查是否gameover
	},
	moveLeft: function () {
		var snakeArr = this.data.snake
		var snakeLen = snakeArr.length
		var snakeHead = snakeArr[snakeLen - 1]
		var snakeTail = snakeArr[0]
		var ground = this.data.ground

		for (var i = 0; i < snakeLen - 1; i++) {
			snakeArr[i] = snakeArr[i + 1]
		}

		var x = snakeHead[0]
		var y = snakeHead[1] - 1

		if (y < 0) {
			this.gameOver()
			return
		}

		snakeArr[snakeLen - 1] = [x, y]
		ground[x][y] = 1
		ground[snakeTail[0]][snakeTail[1]] = 0
		this.setData({
			snake: snakeArr,
			ground: ground
		})
		this.checkGame(snakeTail, [x, y]) // 检查是否gameover
	},
	moveTop: function () {
		var snakeArr = this.data.snake
		var snakeLen = snakeArr.length
		var snakeHead = snakeArr[snakeLen - 1]
		var snakeTail = snakeArr[0]
		var ground = this.data.ground

		for (var i = 0; i < snakeLen - 1; i++) {
			snakeArr[i] = snakeArr[i + 1]
		}

		var x = snakeHead[0] - 1
		var y = snakeHead[1]

		if (x < 0) {
			this.gameOver()
			return
		}

		snakeArr[snakeLen - 1] = [x, y]
		ground[x][y] = 1
		console.log(y)
		ground[snakeTail[0]][snakeTail[1]] = 0
		this.setData({
			snake: snakeArr,
			ground: ground
		})
		this.checkGame(snakeTail, [x, y]) // 检查是否gameover
	},

	/**
	 * 检查gameover
	 * 撞墙 - gameover，弹出框提示是否重新开始，重新load
	 * 自己撞到自己 - gameover
	 * 吃到食物 - snake身体变长，重新生成食物
	 */
	checkGame: function  (snakeTail, snakeHead) {
		console.log("测试snake移动")
		console.log(snakeHead)
		
		var snakeArrs = this.data.snake
		var len = this.data.snake.length
		var food = this.data.food
		var ground = this.data.ground

		console.log(this.data.snake[len-1])
		// 判断有没有撞墙
		if (snakeHead[0] >= 0 & snakeHead[0] < this.data.rows & snakeHead[1] >= 0 & snakeHead[1] < this.data.cols)
		{			
			this.data.modaleHidden = true
			this.collisionSnakeFood(snakeTail, snakeHead, food)
			this.setData({
				// snake: this.data.snakeArr,
				// ground: this.data.ground,
				modaleHidden: this.data.modaleHidden
			})
		} else {
			this.gameOver()
			return
		}
	},

	// 撞到食物，游戏继续
	collisionSnakeFood: function (tail, head, food) {
		let snake = this.data.snake
		let ground = this.data.ground
		let row = food[0]
		let col = food[1]
		let score = this.data.score
		let maxScore = this.data.maxScore
		if (head[0] === food[0] & head[1] === food[1]) {
			ground[row][col] = 1
			snake.unshift(tail)
			ground[tail[0]][tail[1]] = 1
			this.initFood()
			score += 5
			if (!this.data.isMaxActive) {
				maxScore = score
			}
		}
		this.setData({
			snake: snake,
			ground: ground,
			score: score,
			maxScore: maxScore
		})
	},

	// 游戏结束
	gameOver: function () {
		clearInterval(this.data.timer)
		let _that = this
		let maxS = this.data.maxScore
		this.setData({
			modaleHidden: false,
			timer: null
		})
		if (wx.getStorageSync("MaxScore")){
			let hisScore = wx.getStorageSync("MaxScore")
			if (hisScore < maxS) {
				wx.setStorageSync("MaxScore", maxS)
			}
		} else {
			wx.setStorageSync("MaxScore", maxS)
		}
		wx.showModal({
			title: '游戏失败',
			content: '点击确定，重新开始新一局游戏；点击取消，返回首页',
			success: function(res) {
				if(res.confirm) {
					_that.setData({
						score: 0,
						gameStart: false,  // 游戏是否开始
						snake: '', // 贪吃蛇的位置
						food: [], // food位置
						modaleHidden: true
					})
					_that.onLoad()
				}
			}
		})
	},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})