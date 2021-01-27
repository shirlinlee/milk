var Index = {
	instanceVue: undefined,

	setups: {
		Vue: function () {
			Index.instanceVue = new Vue({
				el: '#app',
				data: {
					imgAvatar: '',
					gifStoreTree: null,
					isMounted: false,
					isShowGuide: false,
					popLogin: false,
					popReceive: false,
					popReceiveShort: false,
					popLoginAward_1: false,
					popLoginAward_2: false,
					popLoginAward_3: false,
					popLoginAward_4: false,
					popLoginAward_5: false,
					popLoginAward_6: false,
					popLoginAward_7: false,
					popSuccess: false,
					popFailure: false,
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
						isFirst: true,
						isSignInToday: false,
						signInCount: 1,
						reward_type: null,
						reward_item: null,
						coins: '',
					},
					lottery: {
						is_winning: null,
						type: null,
						lottery_id: null,
						isInfo: null,
						isInfoNotFill: null,
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
				},
				computed: {},

				methods: {
					LiffInit() {},
					LiffGetProfile() {
						window.liff
							.getProfile()
							.then(({ pictureUrl }) => {
								this.imgAvatar = pictureUrl
							})
							.catch((err) => {})
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
											'12',
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
											this.upload.imgThumbnail = cropped.toDataURL()
											CoverFrame(
												cropped,
												frame,
												this.upload.type
											).then((covered) => {
												this.upload.imgMerged = covered.toDataURL()
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

									// draw our image at position 0, 0 on the canvas
									const ctx = outputImage.getContext('2d')
									ctx.drawImage(inputImage, outputX, outputY)

									resolve(outputImage)
								}

								// start loading our image
								inputImage.src = url
							})
						}

						function CoverFrame(target, frame, type) {
							return new Promise((resolve) => {
								var c = document.createElement('canvas')

								c.width = frame.width
								c.height = frame.height

								var ratioX = c.width / target.width
								var ratioY = c.height / target.height
								var ratio = Math.min(ratioX, ratioY)
								var ctx = c.getContext('2d')
								console.log(type)
								var XPosition = type === 'newyear' ? 150 : 0
								ctx.drawImage(
									target,
									0,
									XPosition,
									target.width * ratio,
									target.height * ratio
								)

								ctx.drawImage(
									frame,
									0,
									0,
									frame.width,
									frame.height
								)

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
							.then((res) => {
								const { data } = res
								if (data.isFirst == true) {
									this.info.coins++
								}
								this.upload.id = data.id
							})
							.catch((res) => {})
							.finally(() => {
								this.upload.step = 2
							})
					},
					SendShare() {
						console.log(this.upload.id)

						if (!liff.isApiAvailable('shareTargetPicker')) {
							alert('shareTargetPicker Error')
							return
						}
						liff.shareTargetPicker([
							{
								type: 'text',
								text: 'ID: ' + this.upload.id,
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
											console.log(data)
											if (data.isFirst == true) {
												this.info.coins++
											}
										})
										.catch((res) => {
											console.log(res.response)
										})
										.finally(() => {
											console.log('shared')
										})
								}
							})
							.catch(function (error) {
								// something went wrong before sending a message
								console.log('something wrong happen')
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
										Index.instanceVue.popLogin = true
										Index.instanceVue[
											'popLoginAward_' +
												Index.instanceVue.info
													.signInCount
										] = true
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
						window.GetInfo().then(({ data }) => {
							this.info = data
						})
					},
					GetAchievement(name) {
						window
							.GetAchievement({ name })
							.then((res) => {
								console.log(res.data)
							})
							.catch((err) => {
								console.log(err.response)
							})
							.finally(() => {
								this.OpenPopReceiveShort()
							})
					},
					GetReward() {
						this.ClosePopAward()
						this.popReceiveShort = true
					},
					GetRewardWithMessage(text) {
						this.ClosePopAward()
						liff.sendMessages([
							{
								type: 'text',
								text: text,
							},
						])
							.then(() => {
								console.log('message sent')
							})
							.catch((err) => {
								console.log('error', err)
							})
							.finally((err) => {
								this.popReceive = true
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
								const {
									is_winning,
									type,
									lottery_id,
									isInfo,
									isInfoNotFill,
								} = data
								this.lottery = data

								if (this.lottery.is_winning) {
									this.OpenPopSuccess()
								} else {
									this.OpenPopFailure()
								}
							})
							.catch(() => {
								this.OpenPopFailure()
							})
					},
					ReLottery() {
						this.ClosePopSuccess()
						this.ClosePopFailure()
						this.gifStoreTree.play()
					},
					OpenPopLogin() {
						this.popLogin = true
					},
					ClosePopLogin() {
						this.popLogin = false
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
					this.LiffInit()
					window.liff
						.init({
							liffId: '1655275883-ax5XoZAk',
						})
						.then(() => {
							// if (!liff.isInClient()) {
							// 	alert('請使用 LINE 開啟')
							// 	return
							// }
							window.GetInfo().then(({ data }) => {
								this.info = data
								if (this.info.isFirst) {
									this.ShowGuide()
								}

								if (
									!this.info.isFirst &&
									!this.info.isSignInToday
								) {
									this.popLogin = true
									this.ShowAward()
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
									console.log(err)
								})
						})
						.catch((err) => {
							console.log(err)
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
							this.gifStoreTree.play()
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
