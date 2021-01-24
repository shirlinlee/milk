// liff.getAccessToken()
var accessToken = 'tokenJunx'
window.req = axios.create({
	baseURL: 'https://cell.bigc.tw/klim-healthcoin/api',
	headers: {
		Authorization: 'Bearer ' + accessToken,
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
					is_finished: 0,
					is_received: 0,
					currentCount: 0,
					name: 'first_time',
					title: '測試',
					description: '未達成',
					icon: 'first_time.jpg',
					amount: 1,
					reward: 0,
				},
				{
					is_finished: 1,
					is_received: 0,
					currentCount: 0,
					name: 'first_time',
					title: 'Test',
					description: '未領取',
					icon: 'first_time.jpg',
					amount: 1,
					reward: 0,
				},
				{
					is_finished: 1,
					is_received: 1,
					currentCount: 0,
					name: 'first_time',
					title: 'Test',
					description: '已領取',
					icon: 'first_time.jpg',
					amount: 1,
					reward: 0,
				},
			],
			isFirst: false,
			isSignInToday: true,
			signInCount: 1,
			reward_type: null,
			reward_item: null,
			coins: 100,
		},
	})

	return window.req.get('/info')
}
