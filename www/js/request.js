// liff.getAccessToken()
window.accessToken = 'tokenJunx'
window.req = axios.create({
	baseURL: 'https://cell.bigc.tw/klim-healthcoin/api',
	headers: {
		Authorization: 'Bearer ' + window.accessToken,
		'Content-Type': 'application/json',
	},
})

const fakeAPI = (data) => {
	return new Promise((resolve, reject) => {
		console.log(data)
		setTimeout(() => {
			resolve(data)
		}, 1000)
	})
}

window.GetInfo = () => {
	return fakeAPI({
		data: {
			achievements: [
				{
					isFinished: false,
					isReceived: false,
					currentCount: 0,
					name: 'first_time',
					title: '測試',
					description: '未達成',
					icon: 'first_time.jpg',
					amount: 1,
					reward: 0,
				},
				{
					isFinished: true,
					isReceived: false,
					currentCount: 0,
					name: 'first_time',
					title: 'Test',
					description: '未領取',
					icon: 'first_time.jpg',
					amount: 1,
					reward: 0,
				},
				{
					isFinished: true,
					isReceived: true,
					currentCount: 0,
					name: 'first_time',
					title: 'Test',
					description: '已領取',
					icon: 'first_time.jpg',
					amount: 1,
					reward: 0,
				},
			],
			isFirst: true,
			isSignInToday: false,
			signInCount: 6,
			reward_type: null,
			reward_item: null,
			coins: 100,
		},
	})

	return window.req.get('/info')
}

window.GetAchievement = ({ name }) => {
	return window.req.put('/achievement', {
		name,
		isReceived: true,
	})
}

window.StartLottery = () => {
	// is_winning	    是否中獎	             boolean
	// type	            獎項	                integer
	// lottery_id	    抽獎id	                integer
	// isInfo	        是否需要填寄送資料	       boolean
	// isInfoNotFill	是否有未填寫的中獎寄送資料	boolean
	return window.req.post('/lottery', {})
}

window.UploadPicture = (base64) => {
	return window.req.post('/picture', { file: base64 })
}
window.SharePicture = ({ id, is_shared }) => {
	return window.req.post('/shared', { id, is_shared })
}
