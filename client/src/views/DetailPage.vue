<template>
	<main>
		<h2>Информация о ссылке</h2>
		<div class="vld-parent">
			<Loading :active="isFetching" :is-full-page="false" :opacity="0" color="#6e14ef" />
			<div v-show="!isFetching" class="link-info">
				<p>Оригинальная: <a :href="state.original" rel="nofollower norefferer" target="_blank">{{ state.original }}</a></p>
				<p>Новая: <a :href="`http://${state.short}`" rel="nofollower norefferer" target="_blank">{{ state.short }}</a>
				</p>
				<p>Дата создания: <time :datetime="state.datetime">{{ state.date }}</time></p>
				<p>Переходов по ссылке: {{ state.clicks }}</p>
			</div>
		</div>
		<div class="actions">
			<button type="button" class="material-icons" title="назад к списку ссылок"
				@click="$router.push('/links')">arrow_back</button>
			<button type="button" class="material-icons" title="удалить ссылку" @click="linkDelete"
				style="color:red;">delete</button>
		</div>
	</main>
</template>

<style lang="scss" scoped>
.actions {
	display: flex;
	justify-content: space-between;

	button {
		font-size: 36px;
	}
}

.link-info {
	word-wrap: anywhere;
	overflow-wrap: anywhere;
}
</style>

<script lang="ts" setup>
import { onBeforeMount, reactive, ref } from 'vue';
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { useRoute, useRouter } from 'vue-router';
import { deleteLink, getDetails, myToast } from '../utils'

const isFetching = ref(true)

const state = reactive({
	original: '',
	short: '',
	date: '',
	clicks: 0,
	datetime: ''
})

const route = useRoute()
const router = useRouter()

async function linkDelete(): Promise<void> {
	isFetching.value = true
	try {
		await deleteLink(route.params.code as string)

		myToast({
			text: 'Ссылка удалена',
			type: 'success'
		})

		router.push('/links')
	} catch (e) {
		const text = (e as Error).message
		myToast({
			text,
			type: 'danger'
		})
	}
	isFetching.value = false
}

onBeforeMount(async () => {
	isFetching.value = true
	try {
		const data = await getDetails(route.params.code as string)
		Object.assign(state, data)
	} catch (e) {
		console.error('Error', (e as Error).message)
		router.push('/links')
	}
	isFetching.value = false
})

</script>
