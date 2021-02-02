var Index = {
	instanceVue: undefined,

	setups: {
		Vue: function () {
			const el = document.getElementById('app') ? '#app' : '#app_form'
			Index.instanceVue = new Vue({
				el,
				data: {
					imgAvatar: '',
					gifStoreTree: null,
					isMounted: false,
					isShowGuide: false,
					popRules: false,
					popPersonal: false,
					popLogin: false,
					popReceive: false,
					popReceiveShort: false,
					popShareSuccess: false,
					popLoginAward_1: false,
					popLoginAward_2: false,
					popLoginAward_3: false,
					popLoginAward_4: false,
					popLoginAward_5: false,
					popLoginAward_6: false,
					popLoginAward_7: false,
					popSuccess: false,
					popFailure: false,
					popClose: false,
					info: {
						achievements: [
							// {
							// 	isFinished: 0,
							// 	isReceived: 0,
							// 	currentCount: 0,
							// 	name: 'first_time',
							// 	title: '見面禮',
							// 	description: '上傳第一張照片',
							// 	icon: 'first_time.jpg',
							// 	amount: 0,
							// 	reward: 0,
							// },
						],
						isFirst: false,
						isSignInToday: false,
						signInCount: 0,
						reward_type: null,
						reward_item: null,
						coins: '',
						isLotteried: false,
						lottery: {
							type: null,
							lottery_id: null,
							icon: null,
							title: null,
							name: null,
						},
					},
					lottery: {
						isWinning: null,
						type: null,
						title: null,
						name: null,
						icon: null,
						lottery_id: null,
						isInfo: null,
						isInfoNotFill: null,
					},
					picture: {
						id: '',
						image_url: '',
						isFirst: '',
					},
					upload: {
						id: '',
						step: 1,
						type: null,
						cropped: null,
						frame: null,
						imgThumbnail: 'images/milkphoto1.jpg',
						imgMerged: '',
					},
					form: {
						id: 0,
						award: '尚未中獎',
						step: 'form',
						name: '',
						mobile: '',
						email: '',
						address: '',
						agreeRule: false,
						agreePersonal: false,
					},
				},
				computed: {},

				methods: {
					LiffGetProfile() {
						window.liff
							.getProfile()
							.then((data) => {
								this.imgAvatar = data.pictureUrl
							})
							.catch((err) => {
								console.log('getProfile: ', err)
							})
					},
					EnableApp() {
						this.isMounted = true
					},
					GoToURL(url) {
						window.location.href = url
					},
					GoToUpload(step) {
						this.GetInfo()
						this.upload.step = step
					},
					GetRandom(min, max) {
						return Math.floor(Math.random() * (max - min + 1)) + min
					},
					HandleUpload({ target: input }) {
						if (input.files && input.files[0]) {
							this.upload.imgThumbnail = ''
							var reader = new FileReader()
							reader.onload = (e) => {
								var frames = [
									{
										name: 'normal',
										list: [
											'1',
											'2',
											'3',
											'4',
											'5',
											'6',
											'7',
											'8',
											'9',
											'10',
											'11',
											'13',
											'14',
										],
									},
									{
										name: 'newyear',
										list: ['1', '2', '3'],
									},
								]
								// 	新年版 新年才開
								selectedFrame = frames[this.GetRandom(0, 0)]
								url =
									'./images/frame/' +
									selectedFrame.name +
									'/' +
									selectedFrame.list[
										this.GetRandom(
											0,
											selectedFrame.list.length - 1
										)
									] +
									'.png'

								this.upload.type = selectedFrame.name

								GetFrame(url).then((frame) => {
									Crop(e.target.result, 1 / 1).then(
										(cropped) => {
											this.upload.imgThumbnail = cropped.toDataURL(
												'image/jpeg',
												0.5
											)
											CoverFrame(
												cropped,
												frame,
												this.upload.type
											).then((covered) => {
												this.upload.imgMerged = covered.toDataURL(
													'image/jpeg',
													0.5
												)
											})
										}
									)
								})
							}

							reader.readAsDataURL(input.files[0])
						}
						function Crop(url, aspectRatio) {
							return new Promise((resolve) => {
								// this image will hold our source image data
								const inputImage = new Image()

								// we want to wait for our image to load
								inputImage.onload = () => {
									// let's store the width and height of our image
									const inputWidth = inputImage.naturalWidth
									const inputHeight = inputImage.naturalHeight

									// get the aspect ratio of the input image
									const inputImageAspectRatio =
										inputWidth / inputHeight

									// if it's bigger than our target aspect ratio
									let outputWidth = inputWidth
									let outputHeight = inputHeight
									if (inputImageAspectRatio > aspectRatio) {
										outputWidth = inputHeight * aspectRatio
									} else if (
										inputImageAspectRatio < aspectRatio
									) {
										outputHeight = inputWidth / aspectRatio
									}

									// calculate the position to draw the image at
									const outputX =
										(outputWidth - inputWidth) * 0.5
									const outputY =
										(outputHeight - inputHeight) * 0.5

									// create a canvas that will present the output image
									const outputImage = document.createElement(
										'canvas'
									)

									// set it to the same size as the image
									outputImage.width = outputWidth
									outputImage.height = outputHeight

									// // 固定大小 360
									// outputImage.width = 360
									// outputImage.height = 360

									// draw our image at position 0, 0 on the canvas
									const ctx = outputImage.getContext('2d')
									ctx.drawImage(
										inputImage,
										outputX,
										outputY
										// 360,
										// 360
									)

									resolve(outputImage)
								}

								// start loading our image
								inputImage.src = url
							})
						}

						function CoverFrame(target, frame, type) {
							return new Promise((resolve) => {
								var c = document.createElement('canvas')

								c.width = frame.width / 2
								c.height = frame.height / 2

								var ratioX = c.width / target.width
								var ratioY = c.height / target.height
								var ratio = Math.min(ratioX, ratioY)
								var ctx = c.getContext('2d')
								var XPosition = type === 'newyear' ? 150 : 0
								ctx.drawImage(
									target,
									0,
									XPosition,
									target.width * ratio,
									target.height * ratio
								)

								ctx.drawImage(frame, 0, 0, c.width, c.height)

								resolve(c)
							})
						}

						function GetFrame(urlFrame) {
							return new Promise((resolve) => {
								var frame = document.createElement('img')
								frame.onload = function () {
									resolve(frame)
								}
								frame.src = urlFrame
							})
						}
					},
					TriggerUpload() {
						this.$refs.fileInput.click()
					},
					SendUpload() {
						if (!this.upload.imgMerged) {
							alert('請選擇照片')
							return
						}

						window
							.UploadPicture(this.upload.imgMerged)
							.then(({ data }) => {
								// 第一次上傳圖片
								this.picture = data
								this.upload.id = this.picture.id
								if (this.picture.isFirst == true) {
									this.info.coins++
									this.GetInfo()
								}
								this.upload.step = 2
							})
							.catch((res) => {
								alert('圖片上傳失敗')
							})
					},
					SendShare() {
						if (!liff.isApiAvailable('shareTargetPicker')) {
							alert('您不同意 Line 的分享功能')
							return
						}
						liff.shareTargetPicker([
							{
								type: 'image',
								originalContentUrl: this.picture.image_url,
								previewImageUrl: this.picture.image_url,
							},
							{
								type: 'text',
								text:
									'好朋友，快來一起參加天天喝克寧存健康活動',
							},
							{
								type: 'text',
								text:
									'只要上傳天天喝克寧照片，就有機會抽到涵碧樓之旅、Switch+健身環等超過1500項大禮👇🏼👇🏼',
							},
							{
								type: 'text',
								text: 'https://maac.io/1ouNl',
							},
						])
							.then((res) => {
								if (res) {
									window
										.SharePicture({
											id: this.upload.id,
											is_shared: true,
										})
										.then((res) => {
											const { data } = res
											console.log('put.share success')
											console.log(data)
											if (data.isFirst == true) {
												this.info.coins++
												this.GetInfo()
												this.OpenPopShareSuccess()
											}
										})
										.catch((res) => {
											console.log('put.share fail')
											console.log(res.response)
										})
								}
							})
							.catch(function (error) {
								// something went wrong before sending a message
								console.log('something wrong happen')
							})
					},
					SendForm() {
						function ValidateEmail(text) {
							if (
								text.match(
									/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
								)
							) {
								return true
							} else {
								return false
							}
						}

						if (!this.info.isLotteried) {
							alert('目前無獲獎紀錄')
							return
						}

						if (!this.form.agreeRule || !this.form.agreePersonal) {
							alert('請同意活動辦法與個資法')
							return
						}

						if (
							!this.form.name ||
							!this.form.mobile ||
							!this.form.email ||
							!this.form.address
						) {
							alert('表單資料未完成')
							return
						}

						if (!ValidateEmail(this.form.email)) {
							alert('Email 格式錯誤')
							return
						}
						window
							.SendInfo({
								lottery_id: this.info.lottery.lottery_id,
								name: this.form.name,
								phone: this.form.mobile,
								email: this.form.email,
								address: this.form.address,
							})
							.then((res) => {
								const { data } = res
								console.log(data)
								this.form.step = 'sent'
							})
							.catch((res) => {
								console.log(res.response)
								alert('表單送出失敗')
							})
					},
					ShowGuide() {
						this.isShowGuide = true
						$('.slider').on(
							'init',
							function (event, slick, direction) {
								$('.btn.red').addClass('spotLight')
							}
						)

						$('.slider').slick({
							arrows: false,
							dots: true,
							speed: 600,
							infinite: false,
						})

						$('.slider').on(
							'beforeChange',
							function (event, slick, direction) {
								$('.spotLight').removeClass('spotLight')
							}
						)

						$('.slider').on(
							'afterChange',
							function (event, slick, direction) {
								var currentSlide = slick.currentSlide
								switch (currentSlide) {
									case 0:
										{
											$('.btn.red').addClass('spotLight')
										}
										break
									case 1:
										{
											$('.btn.small').addClass(
												'spotLight'
											)
										}
										break
									case 2: {
										$('.notYet')
											.first()
											.addClass('spotLight')
									}
								}
							}
						)

						$('.slider').on(
							'edge',
							function (event, slick, direction) {
								if (direction === 'left') {
									Index.instanceVue.isShowGuide = false
									setTimeout(function () {
										$('.spotLight').removeClass('spotLight')
										// Index.instanceVue.popLogin = true
										// Index.instanceVue[
										// 	'popLoginAward_' +
										// 		Index.instanceVue.info
										// 			.signInCount
										// ] = true
									}, 620)
								}
							}
						)
					},
					ShowAward() {
						const popAward =
							'popLoginAward_' + this.info.signInCount
						this[popAward] = true
					},
					GetInfo() {
						window
							.GetInfo()
							.then(({ data }) => {
								this.info = data
								console.log(data)
							})
							.catch((err) => {
								console.log(err.response)
							})
					},
					GetAchievement(name) {
						window
							.GetAchievement({ name })
							.then((res) => {
								this.OpenPopReceiveShort()
								this.GetInfo()
							})
							.catch((err) => {
								console.log(err)
								alert('領取失敗，請聯繫客服')
							})
					},
					GetReward() {
						this.ClosePopAward()
						this.GetInfo()
						this.popReceiveShort = true
					},
					GetRewardWithMessage() {
						this.ClosePopAward()
						var message = []
						switch (this.info.reward_type) {
							case 'momo':
								message = [
									{
										type: 'text',
										text:
											'恭喜您獲得克寧純生乳奶粉momo$50元折價序號',
									},
									{
										type: 'text',
										text: '請複製以下序號使用👇🏼👇🏼',
									},
									{
										type: 'text',
										text: this.info.reward_item,
									},
								]

								break
							case 'line':
								message = [
									{
										type: 'text',
										text:
											'恭喜您獲得LINE POINTS 30點，請點擊以下連結儲值👇🏼👇🏼',
									},
									{
										type: 'text',
										text: this.info.reward_item,
									},
								]
								break
							default:
								break
						}
						console.log('(sendMessages) liff.id: ', window.liff.id)
						window.liff.sendMessages(message)
							.then(() => {
								this.popReceive = true
							})
							.catch((err) => {
								console.log(err)
								alert('領取失敗，請聯繫客服')
							})
					},
					PlayLottery() {
						if (this.info.coins <= 0) {
							alert('對不起，您的健康幣餘額不足')
							return
						}
						window
							.StartLottery()
							.then(({ data }) => {
								this.lottery = data
								console.log('window.StartLottery(): ', data)
								if (this.lottery.isWinning) {
									this.OpenPopSuccess()
								} else {
									this.OpenPopFailure()
								}
								this.GetInfo()
							})
							.catch(() => {
								alert('抽獎失敗，請聯繫客服')
							})
					},
					ReLottery() {
						this.ClosePopSuccess()
						this.ClosePopFailure()

						if (this.info.coins <= 0) {
							alert('對不起，您的健康幣餘額不足')
							return
						}
						this.gifStoreTree.play()
					},
					OpenPopClose() {
						this.popClose = true
					},
					ClosePopClose() {
						this.popClose = false
					},
					OpenPopLogin() {
						this.popLogin = true
					},
					ClosePopLogin() {
						this.popLogin = false
					},
					OpenPopShareSuccess() {
						this.popShareSuccess = true
					},
					ClosePopShareSuccess() {
						this.GetInfo()
						this.popShareSuccess = false
					},
					OpenPopReceiveShort() {
						this.popReceiveShort = true
					},
					ClosePopReceiveShort() {
						this.GetInfo()
						this.popReceiveShort = false
					},
					OpenPopReceive() {
						this.popReceive = true
					},
					ClosePopReceive() {
						this.GetInfo()
						this.popReceive = false
					},
					OpenPopSuccess() {
						this.popSuccess = true
					},
					ClosePopSuccess() {
						this.popSuccess = false
					},
					OpenPopFailure() {
						this.popFailure = true
					},
					ClosePopFailure() {
						this.popFailure = false
					},
					ClosePopAward() {
						this.popLoginAward_1 = false
						this.popLoginAward_2 = false
						this.popLoginAward_3 = false
						this.popLoginAward_4 = false
						this.popLoginAward_5 = false
						this.popLoginAward_6 = false
						this.popLoginAward_7 = false
					},
				},
				watch: {},
				created: function () {},
				mounted: function () {
					this.isMounted = true
					// this.isShowGuide = true
					// this.popLoginAward_7 = true
					var liffId =
						window.location.hostname === 'klim-healthcoin.bigc.tw'
							? '1655235209-Y2846394'
							: '1655275883-ax5XoZAk'
					console.log('(before init) liff.id: ', window.liff.id)
					window.liff
						.init({
							liffId,
						})
						.then(() => {
							// if (!liff.isInClient()) {
							// 	alert('請使用 LINE 開啟')
							// 	return
							// }
							console.log(
								'(after init) liff.id: ',
								window.liff.id
							)
							window.GetInfo().then(({ data }) => {
								console.log('window.GetInfo().data : ', data)
								this.info = data
								if (this.info.isFirst) {
									this.ShowGuide()
								}

								if (
									!this.info.isFirst &&
									!this.info.isSignInToday &&
									this.info.signInCount > 0
								) {
									this.popLogin = true
									this.ShowAward()
								}

								if (this.info.isLotteried) {
									this.OpenPopClose()
								}
							})
							liff.getFriendship()
								.then((data) => {
									if (data.friendFlag) {
										// user has friendship
										window.accessToken = liff.getAccessToken()
										if (accessToken) {
											this.LiffGetProfile()
										} else {
											console.log('token error')
										}
									} else {
										// 當不是好友，提供客戶加克寧好友
										liff.openWindow({
											url: 'https://lin.ee/dw2zwyq',
											external: true,
										})
										liff.closeWindow()
									}
								})
								.catch((err) => {
									console.log('getFriendship', err)
								})
						})
						.catch((err) => {
							console.error(err)
						})

					tree = document.getElementById('gifStoreTree')
					if (tree) {
						this.gifStoreTree = new SuperGif({
							gif: tree,
							show_progress_bar: false,
							loop_mode: false,
							auto_play: 0,
							on_end: () => {
								this.PlayLottery()
							},
						})
						this.gifStoreTree.load(() => {
							// this.gifStoreTree.play()
						})
					}

					this.$nextTick(function () {})
				},
			})
		},
	},
	init: function () {
		this.setups.Vue()
	},
}

$(function () {
	setTimeout(function () {
		Index.init()
	}, 0)
})
