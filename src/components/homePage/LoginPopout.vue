<template>
    <div class="bg" @click="backgroundClick">
        <div class="box">
            <div class="material-icons heart">favorite</div>
            <div class="text">Thanks for trying out Nertivia!</div>
            <div class="sub-text text">Fill in the information below to get started.</div>
            <form class="form" action="#" @submit.prevent="login" @keydown="keyDown">
                <custom-input class="input" name="Email" type="email"/>
                <custom-input class="input" name="Username"/>
                <custom-input class="input" name="Password" type="password"/>
                <div class="links">
                    <div class="link">Register instead</div>
                    <div class="link disabled" style="cursor: not-allowed;" title="This feature is coming soon.">I forgot my password</div>
                </div>
                <button class="button"><span class="material-icons">check</span></button>
            </form>
        </div>
    </div>
</template>

<script>
import CustomInput from '@/components/global/CustomInput';
export default {
    components: {CustomInput},
    methods: {
        backgroundClick(e) {
            if (e.target.classList.contains("bg")) {
                this.$emit("close")
            }
        },
        keyDown(event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                this.login();
            }
        },
        login() {

        },

    }
}
</script>

<style lang="scss" scoped>

@import "@/styles/global";
.bg {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1111111;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
}
.box {
    display: flex;
    flex-direction: column;
    background: rgba(34, 34, 34, 0.8);
    align-self: center;
    padding: 10px;
    color: white;
    border-radius: 10px;
    overflow: auto;

    box-shadow: 0px 0px 6px 1px black;
}
.input {
    align-self: center;
    margin-top: 10px;
    margin-bottom: 10px;
}
.text {
    text-align: center;
}
.sub-text {
    opacity: 0.8;
}
.form {
    display: flex;
    align-self: center;
    align-items: center;
    align-content: center;
    flex-direction: column;
}
.heart {
    align-self: center;
    margin-bottom: 10px;
    font-size: 60px;
    color: red;
    text-shadow: 0px 0px 8px #00000070;
}
.button {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    outline: none;
    display: flex;
    color: white;
    justify-content: center;
    align-items: center;
    justify-items: center;
    border: none;
    cursor: pointer;
    opacity: 0.8;
    box-shadow: 0px 0px 10px 2px black;
    background: linear-gradient(90deg, rgba(54,40,255,1) 0%, rgba(69,214,252,1) 100%);
    transition: 0.2s;
    &:hover {
        opacity: 1;
    }
}
.link {
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
    &.disabled {
        opacity: 0.4;
        &:hover {
            text-decoration: initial;
        }
    }
}
.links {
    font-size: 14px;
    margin-bottom: 10px;
    align-self: flex-start;
}
@media (max-width: 406px) {
    .box {
        max-width: initial;
        border-radius: initial;
    }
}
</style>