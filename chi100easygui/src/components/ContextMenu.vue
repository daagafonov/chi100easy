<template>
    <div>
        <ul
            :id="elementId"
            class="vue-simple-context-menu"
            v-click-outside="onClickOutside"
        >
            <li
                v-for="(option, index) in options"
                :key="index"
                @click.stop="optionClicked(option)"
                class="vue-simple-context-menu__item"
                :class="[option.class, (option.type === 'divider' ? 'vue-simple-context-menu__divider' : '')]"
            >
                {{option.name}}
            </li>
        </ul>
    </div>
</template>


<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

export interface Option {
    name: string;
    class: string;
    type: string;
}

@Component({

})
export default class ContextMenuComponent extends Vue {

    @Prop({
        required: true,
    })
    readonly elementId!: string;

    @Prop({
        required: true
    })
    readonly options!: [];

    data() {
        return {
            item: null,
            menuWidth: null,
            menuHeight: null,
        };
    }

    created() {

    }

    onClickOutside() {
        this.hideContextMenu();
    }

    optionClicked(option: any) {
        this.hideContextMenu();
        this.$emit('option-clicked', {
            item: this.$data.item,
            option,
        });
    }

    onEscKeyRelease (event: any) {
        if (event.keyCode === 27) {
            this.hideContextMenu();
        }
    }

    hideContextMenu () {
        let element = document.getElementById(this.elementId)
        if (element) {
            element.classList.remove('vue-simple-context-menu--active');
        }
    }

    showMenu(event: any, item: any) {
        this.$data.item = item;

        const menu = document.getElementById(this.elementId);
        if (!menu) {
            return;
        }

        if (!this.$data.menuWidth || !this.$data.menuHeight) {
            menu.style.visibility = "hidden";
            menu.style.display = "block";
            this.$data.menuWidth = menu.offsetWidth;
            this.$data.menuHeight = menu.offsetHeight;
            menu.removeAttribute("style");
        }

        if ((this.$data.menuWidth + event.pageX) >= window.innerWidth) {
            menu.style.left = (event.pageX - this.$data.menuWidth + 2) + "px";
        } else {
            menu.style.left = (event.pageX - 2) + "px";
        }

        if ((this.$data.menuHeight + event.pageY) >= window.innerHeight) {
            menu.style.top = (event.pageY - this.$data.menuHeight + 2) + "px";
        } else {
            menu.style.top = (event.pageY - 2) + "px";
        }

        menu.classList.add('vue-simple-context-menu--active');
    }

    beforeCreate() {
        Vue.directive('click-outside', {
            bind: (el: any, binding, vNode: any) => {
                if (typeof binding.value !== "function") {
                    const compName = vNode.context.name;
                    let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`;
                    if (compName) {
                        warn += `Found in component '${compName}'`;
                    }

                    console.warn(warn);
                }
                // Define Handler and cache it on the element
                const bubble = binding.modifiers.bubble;
                const handler = (e: any) => {
                    if (bubble || (!el.contains(e.target) && el !== e.target)) {
                        binding.value(e);
                    }
                };
                el.__vueClickOutside__ = handler;
                // add Event Listeners
                document.addEventListener("mousedown", handler);
            },
            unbind: (el: any, binding) => {
                // Remove Event Listeners
                document.removeEventListener("mousedown", el.__vueClickOutside__);

                el.__vueClickOutside__ = null;
            }
        });
    }

}
</script>

<style lang="scss">
$light-grey: #ecf0f1;
$grey: darken($light-grey, 15%);
$blue: #007aff;
$white: #fff;
$black: #333;

.vue-simple-context-menu {
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    display: none;
    list-style: none;
    position: absolute;
    z-index: 1000000;
    background-color: $light-grey;
    border-bottom-width: 0px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
    box-shadow: 0 3px 6px 0 rgba($black, 0.2);
    border-radius: 4px;

&--active {
     display: block;
 }

&__item {
     display: flex;
     color: $black;
     cursor: pointer;
     padding: 5px 15px;
     align-items: center;

&:hover {
     background-color: $blue;
     color: $white;
 }
}

&__divider {
     height: 10px;
     background-color: $grey;
     padding: 4px 0;
     background-clip: content-box;
     pointer-events: none;
 }

// Have to use the element so we can make use of `first-of-type` and
// `last-of-type`
    li {
&:first-of-type {
     margin-top: 4px;
 }

&:last-of-type {
     margin-bottom: 4px;
 }
}
}
</style>
