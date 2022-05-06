<template>
	<div class="app">
		<header v-if="state.isLogged" class="header">
			<h1>zx shortlink</h1>
			<nav class="navigation">
				<ul>
					<router-link v-for="route in navLinks" :key="route" :to="route.link" class="navlinks">
						<li>{{ route.text }}</li>
					</router-link>
				</ul>
			</nav>
			<div class="userinfo">
				<span class="logged_user" aria-label="Логин пользователя">{{ state.username }}</span>
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

<script lang="ts" setup>
import { reactive, ref, watch, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import Feedback from "./components/Feedback.vue"
import { myToast, getLinks, authRoute, LoginData, Link } from './utils'

const navLinks = [
	{ link: '/create', text: 'Создать ссылку' },
	{ link: '/links', text: 'Мои ссылки' }
]

const state = reactive({
	isLogged: false,
	username: localStorage.getItem('username') || '',
	linksData: [] as any[],
	width: 0
})

const showMobMenu = ref(false)
const showFeed = ref(false)

const router = useRouter()

function onLogin(data: LoginData): void {
	state.isLogged = true
	state.username = localStorage.getItem('username') || ''
	myToast({
		text: `Вы вошли как ${data.username}`,
		type: 'success'
	})
}

function onLogout(): void {
	state.isLogged = false
	showMobMenu.value = false
	toAuthPage()
}

function toAuthPage(): void {
	localStorage.removeItem('token')
	localStorage.removeItem('username')
	router.addRoute(authRoute)
	router.push('/')
}

watch(() => state.isLogged, newVal => {
	if (!newVal) toAuthPage()
})

onBeforeMount(async () => {
	const token = localStorage.getItem('token')

	if (token) {
		try {
			state.linksData = await getLinks(token)
			state.isLogged = true
		} catch (e) {
			const msg = (e as Error).message
			console.error('Error', msg)
			toAuthPage()
		}
	} else {
		toAuthPage()
	}
})
</script>
