$(function () {
	if (typeof Vue ==='undefined'){
		$('#app').show()
	}

	$('body').on('click', '#menuToggle', function () {
		$('#menu').toggleClass('show')
		$(this).toggleClass('show')
	})
})
