<template>
	<main class="auth-page">
		<h1>zx shortlink</h1>
		<h2>Авторизация</h2>
		<form class="auth-form" @submit.prevent>
			<label class="input input-label input-login">
				<input type="text" name="username" v-model="state.username" class="input input-text" required>
				<span :class="{ active: state.username, placeholder: true }">Логин</span>
			</label>
			<label class="input input-label input-pass">
				<input type="password" name="password" v-model="state.password" class="input input-text" required>
				<span :class="{ active: state.password, placeholder: true }">Пароль</span>
			</label>
			<div class="buttons">
				<button :disabled="state.inProcess" class="btn login" @click="handleLog">
					Войти
				</button>
				<button :disabled="state.inProcess" class="btn register" @click="handleReg">
					Регистрация
				</button>
			</div>
		</form>
		<Loading :active="state.inProcess" :is-full-page="true" :opacity="0" color="#6e14ef" />
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

<script lang="ts" setup>
import { myToast } from '../utils'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { reactive } from 'vue'
import axios, { AxiosResponse } from 'axios'
import { useRouter } from 'vue-router'

interface LogData {
	username: string
	token: string
	userId: string
}

const emit = defineEmits<{
	(e: 'login', data: LogData): void
}>()

const state = reactive({
	username: '',
	password: '',
	inProcess: false
})

interface LogResponse {
	token: string
	userId: string
	username: string
}

const router = useRouter()

const handleLog = async (): Promise<void> => {
	state.inProcess = true
	try {
		const username = state.username.trim().toLocaleLowerCase()
		const password = state.password.trim().toLocaleLowerCase()

		const res: AxiosResponse<LogResponse> = await axios.post('/api/auth/login', { username, password })

		localStorage.setItem('token', res.data.token)
		localStorage.setItem('username', res.data.username)

		emit('login', res.data)

		router.removeRoute('Auth')
		router.push('/create')
	} catch (e) {
		myToast({
			text: (e as Error).message,
			type: 'danger'
		})
	}
	state.inProcess = false
}

const handleReg = async (): Promise<void> => {
	state.inProcess = true
	try {
		const username = state.username.trim().toLocaleLowerCase()
		const password = state.password.trim().toLocaleLowerCase()

		const res: AxiosResponse<{ message: string }> = await axios.post('/api/auth/register', { username, password })

		if (res.status !== 200) throw new Error(res.data.message)

		await handleLog()
	} catch (e) {
		myToast({
			text: (e as Error).message,
			type: 'danger'
		})
	}
	state.inProcess = false
}
</script>
