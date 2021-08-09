<template>
    <div class="chat-box">
        <div class="chat-box__header">
            <span>Label: <span class="bold-text itali-text">Private chat</span></span>
            <span class="icon">
                <font-awesome-icon :icon="['fas', 'calendar-plus']"/>
            </span>
        </div>

        <div class="chat-box__body">
            <div id='chats-body' class="chat-box__chats">
                <div class="chat-box__chat-by-date" v-for="(chatGroup, index) in chatsContent" :key="index">
                    <div class="chat-box__date">
                        <span>
                            {{ chatGroup.date }}
                        </span>
                    </div>
                    <div class="chat-box__content-wrap">
                        <div @click="onDeeleteChat(chat.id)" v-for="(chat, ind) in chatGroup.chats" :key="ind"
                            :class="['chat-box__content',
                            chat.userId == userId ? 'chat-from--me':'chat-from--someone']" >
                                <div v-if="chat.userId == userId">&nbsp;</div>
                                <div class="main-chat">
                                    <div class="main-chat__title">
                                        <span>{{ chat.userName }}</span>
                                        <span>{{ chat.date.time }}</span>
                                    </div>
                                    <div class="main-chat__body">
                                        {{ chat.text }}
                                    </div>
                                </div>
                                <div v-if="chat.userId !== userId">&nbsp;</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="chat-box__suggestions">
                <div >
                    <swiper class="swiper" :options="swiperOption" ref="mySwiperRef">
                        <swiper-slide :id="`sss${index}`" class="chat-box__suggestion-item" :key="index" v-for="(suggest, index) in suggestions">
                            <div @click="onSelectSuggestionText(index)">
                                {{suggest}}
                            </div>
                        </swiper-slide>
                        <div class="swiper-pagination" slot="pagination">
                            <div class="pagination-buttons">
                                <span class="icon" @click="onSlidePrev">
                                    <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                                </span>
                                <span class="icon" @click="onSlideNext">
                                    <font-awesome-icon :icon="['fas', 'chevron-right']"/>
                                </span>
                            </div>
                        </div>
                    </swiper>
                </div>
            </div>
        </div>
        <div class="chat-box__footer">
            <span class="icon bars">
                <font-awesome-icon :icon="['fas', 'bars']" />
            </span>
            <input type="text" v-model="chatText" />
            <span class="icon paperclip">
                <font-awesome-icon slot="button-prev" :icon="['fas', 'paperclip']"/>
            </span>
            <span class="icon paper-plane">
                <font-awesome-icon @click="onCreateChat()" slot="button-next" :icon="['fas', 'paper-plane']"/>
            </span>
        </div>

    </div>
</template>

<script>
    import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
    import 'swiper/swiper-bundle.css'
    import Resource from '@/util/Resource.js'
    const Posts = new Resource();

    export default{
        name: "ChatBox",
        components: {
        Swiper,
        SwiperSlide
        },

        data(){
            return{
                userId: 1,
                userName: 'Thuso Mokopotsa',
                chatsContent: [],
                suggestions: [],
                chatText:"",

                swiperOption: {
                    slidesPerView: 3,
                    spaceBetween: 10,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true
                    },
                    speed: 500,
                    navigation: {
                        nextEl: '.chat--next',
                        prevEl: '.chat--prev',
                    },
                }
            };
        },

        mounted(){
            this.scrollToChatsBottom();
        },

        created(){
            this.chatsContent = this.getChats();
            this.suggestions = this.getSuggestions();
        },

        methods: {

            onCreateChat(){
                if( this.chatText !== ""){
                    let newChat = {
                        userId: this.userId,
                        userName: this.userName,
                        text: this.chatText,
                    }
                    /** The 'create' funtion creates new chat and returns new grouped list  */
                    this.chatsContent = Posts.create('chat', newChat);
                    this.chatText = "";
                }
            },

            onDeeleteChat( chatId){
                let response = Posts.delete(chatId);
                this.chatsContent = response;
            },

            onSlidePrev(){
            this.$refs.mySwiperRef.$swiper.slidePrev();
            },

            onSlideNext(){
                this.$refs.mySwiperRef.$swiper.slideNext();
            },
            
            onSelectSuggestionText(index){
                if( this.chatText.endsWith(" ")){
                    this.chatText = this.chatText + this.suggestions[index];
                }
                else{
                    this.chatText = this.chatText +" "+ this.suggestions[index];
                }
            },
            /**Scroll the chats section and display the bottom part */
            scrollToChatsBottom(){
                let chatElement = document.getElementById('chats-body');
                chatElement.scrollTo(500, 10000);
            },

            getChats() {
                return Posts.get('chats');
            },

            getSuggestions(){
                return Posts.get('suggestions');
            },

        }
    }
</script>
