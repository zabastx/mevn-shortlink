<template>
    <aside class="feedback" aria-label="Форма обратной связи" >
        <h2 class="heading">
            Обратная связь
        </h2>
        <button class="material-icons btn-expand" @click="toggleForm">close</button>
        <form @submit.prevent="submit" class="feedback-form" >
            <label class="input input-label">
                <input type="text" class="input input-text" v-model="name" required>
                <span :class="{active: name, placeholder: true}" name="name">Имя<sup>*</sup></span>
            </label>
            <label class="input input-label">
                <input type="email" class="input input-text" v-model="email" required>
                <span :class="{active: email, placeholder: true}" name="email">Email<sup>*</sup></span>
            </label>
            <label class="input input-label">
                <textarea class="input input-text" v-model="message" name="message" required></textarea>
                <span :class="{active: message, placeholder: true}">Сообщение<sup>*</sup></span>
            </label>
            <loading-button :styled="false" :loading="!formReady" class="btn" />
        </form>
    </aside>
</template>

<style src="./feedback.scss" lang="scss" scoped></style>

<script>
import { myToast } from '../utils'
import LoadingButton from "./LoadingButton.vue"

export default {
    name: 'Feedback',
    components: {
        LoadingButton
    },
    
    data() {
        return {
            name: '',
            message: '',
            email: '',
            formReady: true
        }
    },

    methods: {
        async submit() {
            try {
                this.formReady = false
                const response = await fetch('/api/bot/feedback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: this.name,
                        email: this.email,
                        message: this.message
                    })
                })
                const {message} = await response.json()

                myToast({
                    text: message,
                    type: 'success'
                })

                this.clearForm()
                this.formReady = true
            } catch (error) {
                this.formReady = true
            }
        },

        clearForm() {
            this.name = '',
            this.message = '',
            this.email = ''
        },

        toggleForm() {
            this.$emit('toggle', true)
        }
    }
}

</script>