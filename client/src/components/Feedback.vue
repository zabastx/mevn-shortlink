<template>
	<aside class="feedback" aria-label="Форма обратной связи">
		<h2 class="heading">
			Обратная связь
		</h2>
		<button class="material-icons btn-expand" @click="$emit('toggle', true)">close</button>
		<form @submit.prevent="submit" class="feedback-form">
			<label class="input input-label">
				<input type="text" class="input input-text" v-model="state.name" required>
				<span :class="{ active: state.name, placeholder: true }" name="name">Имя<sup>*</sup></span>
			</label>
			<label class="input input-label">
				<input type="email" class="input input-text" v-model="state.email" required>
				<span :class="{ active: state.email, placeholder: true }" name="email">Email<sup>*</sup></span>
			</label>
			<label class="input input-label">
				<textarea class="input input-text" v-model="state.message" name="message" required></textarea>
				<span :class="{ active: state.message, placeholder: true }">Сообщение<sup>*</sup></span>
			</label>
			<loading-button :styled="false" :loading="!state.formReady" class="btn" />
		</form>
	</aside>
</template>

<style src="./feedback.scss" lang="scss" scoped>
</style>

<script lang="ts" setup>
import { reactive } from 'vue'
import { myToast } from '../utils'
import LoadingButton from './LoadingButton.vue'
import axios from 'axios'

defineEmits<{ (e: 'toggle', value: boolean): void }>()

const state = reactive({
	name: '',
	message: '',
	email: '',
	formReady: true
})

const clearForm = () => {
	state.email = ''
	state.name = ''
	state.message = ''
}

const submit = async () => {
	try {
		state.formReady = false
		const { name, message, email } = state
		const { data }: { data: { message: string } } = await axios.post('/api/bot/feedback', { name, message, email })

		myToast({ text: data.message, type: 'success' })

		clearForm()
	} catch (e) {
		console.error(e)
	} finally {
		state.formReady = true
	}
}
</script>
