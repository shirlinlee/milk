// 正式：klim-healthcoin.bigc.tw
// 開發：cell.bigc.tw
window.baseURL =
	window.location.hostname === 'klim-healthcoin.bigc.tw'
		? 'https://klim-healthcoin.bigc.tw/api'
		: 'https://cell.bigc.tw/klim-healthcoin/api'

window.req = () => {
	window.accessToken =
		typeof liff !== 'undefined' && liff.getAccessToken()
			? liff.getAccessToken()
			: 'tokenJunx'
	return axios.create({
		baseURL: window.baseURL,
		headers: {
			Authorization: 'Bearer ' + window.accessToken,
			'Content-Type': 'application/json',
		},
	})
}

const fakeAPI = (data) => {
	return new Promise((resolve, reject) => {
		console.log(data)
		setTimeout(() => {
			resolve(data)
		}, 20)
	})
}

window.GetInfo = () => {
	// return fakeAPI({
	// 	data: {
	// 		achievements: [
	// 			{
	// 				isFinished: false,
	// 				isReceived: false,
	// 				currentCount: 0,
	// 				name: 'first_time',
	// 				title: '測試',
	// 				description: '未達成',
	// 				icon:
	// 					'https://cell.bigc.tw/klim-healthcoin/api/storage/app/public/icon/medal_3dayX_no.png',
	// 				amount: 1,
	// 				reward: 0,
	// 			},
	// 			{
	// 				isFinished: true,
	// 				isReceived: false,
	// 				currentCount: 0,
	// 				name: 'first_time',
	// 				title: 'Test',
	// 				description: '未領取',
	// 				icon:
	// 					'https://cell.bigc.tw/klim-healthcoin/api/storage/app/public/icon/medal_3dayX_no.png',
	// 				amount: 1,
	// 				reward: 0,
	// 			},
	// 			{
	// 				isFinished: true,
	// 				isReceived: true,
	// 				currentCount: 0,
	// 				name: 'first_time',
	// 				title: 'Test',
	// 				description: '已領取',
	// 				icon:
	// 					'https://cell.bigc.tw/klim-healthcoin/api/storage/app/public/icon/medal_3dayX_no.png',
	// 				amount: 1,
	// 				reward: 0,
	// 			},
	// 		],
	// 		isFirst: true,
	// 		isSignInToday: false,
	// 		signInCount: 0,
	// 		reward_type: 'momo',
	// 		reward_item: 'test',
	// 		coins: 10,
	// 	},
	// })
	var path = window.location.pathname.split('/').pop()
	var isIndex = path === '' || path === 'index.html' ? 'index' : ''
	return window.req().get('/info', { params: { from: isIndex } })
}

window.GetAchievement = ({ name }) => {
	return window.req().put('/achievement', {
		name,
		isReceived: true,
	})
}

window.StartLottery = () => {
	// isWinning	    是否中獎	             boolean
	// type	            獎項	                integer
	// lottery_id	    抽獎id	                integer
	// isInfo	        是否需要填寄送資料	       boolean
	// isInfoNotFill	是否有未填寫的中獎寄送資料	boolean
	return window.req().post('/lottery', {})
}

window.UploadPicture = (base64) => {
	return window.req().post('/picture', { file: base64 })
}

window.SharePicture = ({ id, is_shared }) => {
	return window.req().put('/share', { id, is_shared })
}

window.SendInfo = ({ name, phone, email, address, lottery_id }) => {
	return window.req().post('/sendInfo', {
		name,
		phone,
		email,
		address,
		lottery_id,
	})
}

window.CheckBind = () => {
	axios.get(window.baseURL + '/isBind').then(({ data }) => {
		if (!data.isBind) {
			window.location.href = 'https://liff.line.me/1655235209-YmOz1vaz'
		}
	})
}

// window.CheckBind()
