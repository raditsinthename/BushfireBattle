function validatePassword(){
				var password = document.getElementById("password");
				var confirmPassword = document.getElementById('confirmPassword');
				if (password.value != confirmPassword.value) {
					confirmPassword.setCustomValidity('Password Must be Matching.');
				} else {
					// input is valid -- reset the error message
					confirmPassword.setCustomValidity('');
				}
			}