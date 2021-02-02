$(function () {
	if (typeof Vue === 'undefined') {
		$('#app, #app_form').show()
	}

	$('body').on('click', '#menuToggle', function () {
		$('#menu').toggleClass('show')
		$(this).toggleClass('show')
	})
})

if (window.location.hostname === 'cell.bigc.tw') {
	var vConsole = new VConsole()
}
