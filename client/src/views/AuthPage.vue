<template>
	<main class="auth-page">
		<h1>zx shortlink</h1>
		<h2>Авторизация</h2>
		<form class="auth-form" @submit.prevent>
			<label class="input input-label input-login">
				<input type="text" name="username" v-model="username" class="input input-text" required>
				<span :class="{ active: username, placeholder: true }">Логин</span>
			</label>
			<label class="input input-label input-pass">
				<input type="password" name="password" v-model="password" class="input input-text" required>
				<span :class="{ active: password, placeholder: true }">Пароль</span>
			</label>
			<div class="buttons">
				<button :disabled="inProcess" class="btn login" @click="handleLog">
					Войти
				</button>
				<button :disabled="inProcess" class="btn register" @click="handleReg">
					Регистрация
				</button>
			</div>
		</form>
		<Loading :active="inProcess" :is-full-page="true" :opacity="0" color="#6e14ef" />
	</main>
</template>

<style lang="scss" scoped>
.app {
	background: linear-gradient(-45deg, #44079B, #6F14EF, #AE7BF7);
}

.auth-page {
	margin: auto;
	padding: 15px;
	width: 420px;
	height: fit-content;
	background: white;
	border-radius: 5px;
	box-shadow: 0 0 10px black;
}

.buttons {
	display: flex;
	justify-content: space-between;
}

h1 {
	text-transform: uppercase;
	margin-bottom: 20px;
	text-align: center;
	font-size: 3rem;
}

@media (max-width: 420px) {
	h1 {
		font-size: 2.5rem;
	}
}
</style>

<script>
import { myToast } from '../utils'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
	name: 'Auth',
	components: {
		Loading
	},
	data() {
		return {
			username: '',
			password: '',
			inProcess: false
		}
	},

	methods: {
		async authSubmit(event) {
			if (event.submitter.className.includes('login')) {
				await this.handleLog()
				return
			}

			await this.handleReg()
		},

		async handleLog() {
			try {
				this.inProcess = true
				const response = await fetch('/api/auth/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						username: this.username.trim().toLowerCase(),
						password: this.password.trim().toLowerCase()
					})
				})

				const data = await response.json()

				if (!response.ok) throw Error(data.message)

				localStorage.setItem('token', data.token)
				localStorage.setItem('username', data.username)

				this.$emit('login', data)

				this.$router.removeRoute('Auth')
				this.$router.push('/create')

			} catch (e) {
				myToast({
					text: e.message,
					type: 'danger'
				})
			}
			this.inProcess = false
		},
		async handleReg() {
			try {
				this.inProcess = true

				const response = await fetch('/api/auth/register', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						username: this.username.trim().toLowerCase(),
						password: this.password.trim().toLowerCase()
					})
				})

				const data = await response.json()

				if (!response.ok) throw Error(data.message)

				await this.handleLog()
			} catch (e) {
				myToast({
					text: e.message,
					type: 'danger'
				})
			}
			this.inProcess = false
		},
	}
}
</script>
