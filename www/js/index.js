var Index = {
	instanceVue: undefined,

	setups: {
		Vue: function () {
			Index.instanceVue = new Vue({
				el: '#app',
				data: {
					isMounted: false,
					isShowGuide: false,
					popLogin: false,
					popReceive: false,
					popLoginAward_1: false,
					popLoginAward_2: false,
					popLoginAward_3: false,
					popLoginAward_4: false,
					popLoginAward_5: false,
					popLoginAward_6: false,
					popLoginAward_7: false,
					info: {
						achievements: [
							// {
							// 	is_finished: 0,
							// 	is_received: 0,
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
						coins: 0,
					},
				},
				computed: {},
				created: function () {},
				mounted: function () {
					this.isMounted = true
					// this.isShowGuide = true
					// this.popLoginAward_7 = true

					window.GetInfo().then(({ data }) => {
						console.log(data)
						this.info = data
						console.log(this.isFirst)
						if (this.info.isFirst) {
							this.ShowGuide()
						}

						if (!this.info.isFirst && this.info.isSignInToday) {
							this.popLogin = true
							this.ShowAward()
						}
					})

					this.$nextTick(function () {})
				},
				methods: {
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
										Index.instanceVue.popLoginAward_1 = true
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

					GetReward() {
						this.ClosePopAward()
						this.popReceive = true
					},
					ClosePopLogin() {
						this.popLogin = false
					},
					ClosePopReceive() {
						this.popReceive = false
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
