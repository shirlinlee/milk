$(function () {
	console.log('123')
	$('body').on('click', '#menuToggle', function () {
		$('#menu').toggleClass('show')
	})
})
