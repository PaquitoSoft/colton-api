module.exports = function({ newPassword }) {
	return `
		<html>
			<head>
				<title>COLTON - reset password</title>
			</head>
			<body>
				<p>
					Hello,<br><br>
					We're sending you this email because you told us you forgot your password.<br><br>
					We've auto-generated a new one for you: <b>${newPassword}</b><br><br>
					Please, after you log into the system with your new password, take a minute to change it.<br><br>
				</p>
				<p>
					Cheers,<br>
					Colton (your online music player).
				</p>
			</body>
		</html>
	`;
};
