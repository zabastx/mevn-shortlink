import 'mosha-vue-toastify/dist/style.css'
import { createToast } from 'mosha-vue-toastify'
import axios from 'axios'

/**
 * Notification snackbar
 * @param {Object} opts опции для Mosha-Vue-Toastify
 * @param {String} opts.text - текст в оповещении
 * @param {('success'|'danger'|'info'|'warning'|'default')} opts.type - тип оповещения
 */

interface ToastOpts {
	text: string
	type: 'success' | 'danger' | 'info' | 'warning' | 'default'
}

export interface Link {
	to: string
	from: string
	code: string
	_id: string
	clicks: number
}

export interface LinkFront {
	original: string
	short: string
	id?: string
	idx?: number
	code?: string
	clicks: number
	date: string
	datetime: string
}

export interface LoginData {
	username: string
	token: string
	userId: string
}

export function myToast(opts: ToastOpts) {
	createToast(opts.text, {
		position: 'bottom-center',
		type: opts.type,
		transition: 'slide',
		swipeClose: true,
		showIcon: true,
		hideProgressBar: true,
		timeout: 2000,
		showCloseButton: true,
	})
}

/**
 * Запрос списка ссылок с сервера
 * @param {string} token - Токен юзера
 * @returns {Promise<Array>} Список ссылок
 */

export async function getLinks(token: string): Promise<LinkFront[]> {
	const res = await axios.get('/api/link/', {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	})

	if (res.status === 401) throw Error('token expired')

	const { data } = res
	return data.map((val: Link, i: number) => {
		return {
			original: val.to,
			short: val.from.replace('http://', ''),
			id: val._id,
			idx: ++i,
			code: val.code
		}
	})
}

export const authRoute = {
	path: '/',
	name: 'Auth',
	component: () => import(/* webpackChunkName: "Auth" */ './views/AuthPage.vue')
}

/**
 * Запрос информации о ссылке с сервера
 * @param {string} code - Код ссылки
 * @returns {Promise} Детали Ссылки
 */

export async function getDetails(code: string): Promise<LinkFront> {
	const response = await fetch(`/api/link/${code}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('token')}`
		}
	})
	const data = await response.json()

	if (!response.ok) throw Error(data.message)

	return {
		original: data.to,
		short: data.from.replace('http://', ''),
		date: new Date(data.date).toLocaleDateString(),
		datetime: new Date(data.date).toISOString(),
		clicks: data.clicks
	}
}

/**
 * Удаление ссылки из БД
 * @param {string} code - Код ссылки
 */

export async function deleteLink(code: string) {
	const response = await fetch(`/api/link/del/${code}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('token')}`
		}
	})

	const data = await response.json()

	if (!response.ok) throw Error(data.message)
}
