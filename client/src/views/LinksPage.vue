<template>
	<main>
		<h2>Список ваших ссылок</h2>
		<div class="vld-parent">
			<Loading :active="isFetching" :is-full-page="false" :opacity="0" color="#6e14ef" />
			<table v-if="linksList.length > 0 && !isFetching">
				<thead>
					<tr>
						<th>№</th>
						<th>Оригинальная</th>
						<th>Новая</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="link in linksList" :key="link" @click="toDetails(link.code)"
						@keypress.enter.space="toDetails(link.code)" tabindex="0">
						<th scope="row">{{ link.idx }}</th>
						<td>{{ link.original }}</td>
						<td>{{ link.short }}</td>
					</tr>
				</tbody>
			</table>
			<p v-else-if="!isFetching">
				У вас пока нет ссылок
			</p>
		</div>
	</main>
</template>

<style lang="scss" scoped>
table {
	border-collapse: collapse;
	font-size: 1rem;
	width: 100%;
}

td,
th {
	padding: 5px;
}

th {
	font-weight: bold;
	font-size: 1.1em;
	text-align: left;
}

tbody tr {
	cursor: pointer;
	word-wrap: anywhere;
	overflow-wrap: anywhere;

	&:hover,
	&:focus {
		background: #6e14ef;
		color: white;
	}

	a {
		color: inherit;
	}
}

tr {
	border-bottom: 2px solid #6e14ef;
}
</style>

<script>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { getLinks } from '../utils'

export default {
	name: 'Links',
	components: {
		Loading
	},
	data() {
		return {
			linksList: [],
			isFetching: true,
		}
	},

	methods: {
		toDetails(code) { this.$router.push(`/detail/${code}`) }
	},

	async mounted() {
		this.isFetching = true
		try {
			this.linksList = await getLinks(localStorage.getItem('token'))
		} catch (e) {
			console.log(e.message)
		}
		this.isFetching = false
	}

}
</script>
