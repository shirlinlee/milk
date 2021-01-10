$(function () {
	$('body').on('click', '.pages li', function () {
		$('.pages li').removeClass('active')
		$(this).addClass('active')
	})
})
