<template>
    <main>
        <h2>Создать новую ссылку</h2>
        <form @submit.prevent="createLink">
            <label class="input input-label" >
                <input type="url" name="link" v-model="link" class="input input-text">
                <span :class="{active: link, placeholder: true}">Ваша ссылка</span>
            </label>
            <button class="btn" type="submit" :disabled="inProcess">Сократить</button>
        </form>
    </main>
</template>

<script>
import { myToast } from '../utils'

export default {
    name: 'Create',
    data() {
        return {
            link: '',
            inProcess: false,
        }
    },

    methods: {
        async createLink() {
            try {
                this.inProcess = true
                const response = await fetch('/api/link/new/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        to: this.link
                    })
                })

                const data = await response.json()

                if (!response.ok) throw Error(data.message)

                myToast({
                    text: data.message,
                    type: 'success'
                })
                this.link = ''
                this.inProcess = false
                this.$emit('createLink')
                this.$router.push(`/detail/${data.link.code}`)
            } catch (e) {
                console.error(e.message)
                this.$emit('error', e)
            }
        }
    }
}

</script>

<style lang="scss" scoped>
form {
    text-align: right;
}
</style>