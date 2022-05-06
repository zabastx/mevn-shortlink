<template>
	<main>
		<h2>Создать новую ссылку</h2>
		<form @submit.prevent="createLink">
			<label class="input input-label">
				<input type="url" name="link" v-model="link" class="input input-text">
				<span :class="{ active: link, placeholder: true }">Ваша ссылка</span>
			</label>
			<button class="btn" type="submit" :disabled="inProcess">Сократить</button>
		</form>
	</main>
</template>

<script lang="ts" setup>
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Link, myToast } from '../utils'

const emit = defineEmits<{
	(e: 'error'): void
}>()

const link = ref('')
const inProcess = ref(false)

const router = useRouter()

async function createLink() {
	inProcess.value = true
	try {
		const res: AxiosResponse<{ message: string, link: Link }> = await axios.post('/api/link/new/', {
			to: link.value
		}, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})

		myToast({
			text: res.data.message,
			type: 'success'
		})

		link.value = ''
		inProcess.value = false

		router.push(`/detail/${res.data.link.code}`)
	} catch (e) {
		const err = e as AxiosError<{ message: string }>
		myToast({
			text: err.response?.data.message || 'Неизвестная ошибка',
			type: 'danger'
		})
		emit('error')
	}
	inProcess.value = false
}
</script>

<style lang="scss" scoped>
form {
	text-align: right;
}
</style>
