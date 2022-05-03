<template>
	<main>
		<h2>Информация о ссылке</h2>
		<div class="vld-parent">
			<Loading :active="isFetching" :is-full-page="false" :opacity="0" color="#6e14ef" />
			<div v-show="!isFetching" class="link-info">
				<p>Оригинальная: <a :href="source" rel="nofollower norefferer" target="_blank">{{ source }}</a></p>
				<p>Новая: <a :href="`http://${short}`" rel="nofollower norefferer" target="_blank">{{ short }}</a></p>
				<p>Дата создания: <time :datetime="datetime">{{ date }}</time></p>
				<p>Переходов по ссылке: {{ clicks }}</p>
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

<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { deleteLink, getDetails, myToast } from '../utils'

export default {
	name: 'Detail',
	components: {
		Loading
	},
	data() {
		return {
			source: '',
			short: '',
			date: '',
			clicks: '',
			datetime: '',
			isFetching: true
		}
	},

	methods: {
		async linkDelete() {
			this.isFetching = true
			try {
				await deleteLink(this.$route.params.code)

				myToast({
					text: 'Ссылка удалена',
					type: 'success'
				})
				this.$router.push('/links')
			} catch (e) {
				console.error(e.message)
			}
			this.isFetching = false
		}
	},

	async created() {
		this.isFetching = true
		try {
			const data = await getDetails(this.$route.params.code)
			Object.assign(this, data)
		} catch (e) {
			console.log(e.message)
			this.$router.push('/links')
		}
		this.isFetching = false
	}
}
</script>
