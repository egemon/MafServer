$(document).ready(
        function  () {
            var showButton = $('#showLogin');
            var loginForm = $('#authform').hide();
            var authButton = $('#authButton');
            var userInput = $('#user');
            var passwordInput = $('#password');
            showButton.on('click', toggleFormState);
            authButton.on('click', requestForProtocol);

            function requestForProtocol () {
                var user = userInput.val();
                var password = passwordInput.val();
                $.post('/login', {
                    user: user,
                    password: password
                }, function(data, textStatus, xhr) {
                    console.log('arguments', arguments);
                    if (data === 'Не правильный пароль!') {
                        alert(data);
                    } else {
                        window.location.pathname = data;
                    }
                });
            }

            function toggleFormState () {
                loginForm.toggle('show');
                if (showButton.text() === 'Я орг') {
                    showButton.text('Я передумал');
                } else {
                    showButton.text('Я орг');
                }
            }
        }
    );