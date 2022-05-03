<template>
	<div class="app">
		<header v-if="isLogged" class="header">
			<h1>zx shortlink</h1>
			<nav class="navigation">
				<ul>
					<router-link v-for="route in navLinks" :key="route" :to="route.link" :aria-label="route.label"
						class="navlinks">
						<li>{{ route.text }}</li>
					</router-link>
				</ul>
			</nav>
			<div class="userinfo">
				<span class="logged_user" aria-label="Логин пользователя">{{ username }}</span>
				<button class="logout material-icons" type="button" title="Выйти" @click="onLogout"
					@keyup.space.enter="onLogout">logout</button>
			</div>
			<button class="material-icons mobile" type="button" @click="showMobMenu = !showMobMenu"
				style="font-size: 42px">menu</button>
			<nav v-show="showMobMenu" class="moblinks mobile">
				<ul>
					<router-link v-for="route in navLinks" :key="route" :to="route.link" @click="showMobMenu = !showMobMenu">
						<li>{{ route.text }}</li>
					</router-link>
					<li @click="onLogout" class="link-out" tabindex="0" @keyup.space.enter="onLogout">
						<span>Выйти</span>
						<span class="material-icons">logout</span>
					</li>
				</ul>
			</nav>
		</header>
		<router-view @login="onLogin" class="view-content" @error="toAuthPage" />
		<button type="button" class="material-icons btn-feedback" title="Обратная связь" v-show="!showFeed"
			@click="showFeed = !showFeed">feedback</button>
		<Feedback @toggle="showFeed = !showFeed" :class="{ opened: showFeed }" />
	</div>
</template>

<style lang="scss" src="./app.scss">
</style>

<script>
import Feedback from "./components/Feedback.vue"
import { myToast, getLinks, authRoute } from './utils'

export default {
	name: 'App',
	components: {
		Feedback
	},

	data() {
		return {
			isLogged: false,
			navLinks: [
				{ link: '/create', text: 'Создать ссылку' },
				{ link: '/links', text: 'Мои ссылки' }
			],
			username: localStorage.getItem('username'),
			linksData: [],
			width: 0,
			showMobMenu: false,
			showFeed: false
		}
	},

	methods: {
		onLogin(data) {
			this.isLogged = true
			this.username = localStorage.getItem('username')
			myToast({
				text: `Вы вошли как ${data.username}`,
				type: 'success'
			})
		},

		onLogout() {
			this.isLogged = false
			this.showMobMenu = false
			this.toAuthPage()
		},

		toAuthPage() {
			localStorage.removeItem('token')
			localStorage.removeItem('username')
			this.$router.addRoute(authRoute)
			this.$router.push('/')
		}
	},

	watch: {
		isLogged(val) {
			if (!val) {
				this.toAuthPage()
			}
		}
	},

	async created() {
		const token = localStorage.getItem('token')
		if (token) {
			try {
				this.linksData = await getLinks(token)
				this.isLogged = true
			} catch (e) {
				console.log(e.message)
				this.toAuthPage()
			}
		} else {
			this.toAuthPage()
		}
	}
}
</script>


<!-- <script setup>
import Feedback from './components/Feedback.vue'
import { myToast, getLinks, authRoute } from './utils'
import { ref } from 'vue'

const navLinks = [
	{ link: '/create', text: 'Создать ссылку' },
	{ link: '/links', text: 'Мои ссылки' }
]

const username = localStorage.getItem('username')

const isLogged = ref(false)

onCreated(async () => {
	const token = localStorage.getItem('token')
	if (token) {
		try {
			linksData = await getLinks(token)
			isLogged = true
		} catch (e) {
			console.log(e.message)
			toAuthPage()
		}
	} else {
		toAuthPage()
	}
})
</script> -->
