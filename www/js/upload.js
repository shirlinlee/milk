;(function () {
	'use strict'

	const imageURL = '/images/Kcoin.png'

	$('#file_0').on('change', function () {
		readFile(this)
	})
	function readFile(input) {
		if (input.files && input.files[0]) {
			var reader = new FileReader()
			reader.onload = function (e) {
				GetFrame('/images/photostyle_01.png').then((frame) => {
					Crop(e.target.result, frame.width / frame.height).then(
						(cropped) => {
							CoverFrame(cropped, frame).then((covered) => {
								$('.img-thumbnail').attr(
									'src',
									covered.toDataURL()
								)
							})
						}
					)
				})
			}

			reader.readAsDataURL(input.files[0])
		}
	}

	/**
	 * @url - Source of the image to use
	 * @aspectRatio - The aspect ratio to apply
	 */
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
				const inputImageAspectRatio = inputWidth / inputHeight

				// if it's bigger than our target aspect ratio
				let outputWidth = inputWidth
				let outputHeight = inputHeight
				if (inputImageAspectRatio > aspectRatio) {
					outputWidth = inputHeight * aspectRatio
				} else if (inputImageAspectRatio < aspectRatio) {
					outputHeight = inputWidth / aspectRatio
				}

				// calculate the position to draw the image at
				const outputX = (outputWidth - inputWidth) * 0.5
				const outputY = (outputHeight - inputHeight) * 0.5

				// create a canvas that will present the output image
				const outputImage = document.createElement('canvas')

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

	function CoverFrame(target, frame) {
		return new Promise((resolve) => {
			var c = document.createElement('canvas')

			c.width = frame.width
			c.height = frame.height

			var ratioX = c.width / target.width
			var ratioY = c.height / target.height
			var ratio = Math.min(ratioX, ratioY)
			var ctx = c.getContext('2d')
			ctx.drawImage(
				target,
				0,
				0,
				target.width * ratio,
				target.height * ratio
			)

			ctx.drawImage(frame, 0, 0, frame.width, frame.height)

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
})()
