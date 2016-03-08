$(document).ready(
        function  () {
            var showButton = $('#showLogin');
            var loginForm = $('#authform').hide();
            showButton.on('click', toggleForm);
            function toggleForm () {
                loginForm.toggle('show');
                if (showButton.text() === 'Я орг') {
                    showButton.text('Я передумал');
                } else {
                    showButton.text('Я орг');
                }
            }
        }
    );