<template>
	<div class="dark-background">
		<div class="inner">
			<div class="text">
				To upload files and images, You must link your Google Drive account with your Nertivia account.
			</div>
			<div class="images">
					<div class="image GDrive-img"></div>
					<div class="arrow">></div>
					<div class="image nertivia-img"></div>
			</div>
			<div class="button">Link me</div>
		</div>
	</div>
</template>

<style scoped>
.dark-background {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.781);
    z-index: 1;
    display: flex;
}
.inner {
    margin: auto;
    height: 400px;
    width: 400px;
    background: rgb(32, 32, 32);
		display: flex;
		flex-direction: column;
		color: white;
		border-radius: 3px;
}
.text{
	color: white;
	text-align: center;
	margin-top: 30px;
	font-size: 17px;
}
.images{
	display: flex;
	margin: auto;
	margin-top: 40px;
}
.image {
	width: 120px;
	height: 120px;
	background-position: center;
	background-size: 100%;
}
.nertivia-img {
	background-image: url(./../../assets/logo.png);
}
.arrow{
	font-size: 40px;
	margin: auto;
	padding: 20px;
}
.GDrive-img {
	background-image: url(./../../assets/Google_Drive_logo.png);
}
.button{
	display: inline-block;
	margin: auto;
	background: rgb(32, 118, 255);
	padding: 10px;
	border-radius: 2px;
	cursor: default;
	user-select: none;
	transition: 0.3s;
}
.button:hover {
	background:rgb(58, 134, 255);
}

</style>

