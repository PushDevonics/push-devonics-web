#Manual

1. Клонировать этот репозиторий в папку вашего проекта
2. Переместить webpush.js в папку с вашими ассетами
3. Переместить firebase-messaging-sw.js в корень <b>вашего</b> проекта
4. В файле firebase-messaging-sw.js, в константу SENDER_ID прописать sender id вашего приложения, который вы можете найти по этой ссылке:   
   https://push.devonics.pro/app/your-app-id/configure
5. Добавить код ниже в футер вашего приложения и подставить свой app-id для инициализации пушей
```html
<script type="text/javascript" src="https://www.gstatic.com/firebasejs/6.6.2/firebase-app.js"></script>
<script type="text/javascript" src="https://www.gstatic.com/firebasejs/6.6.2/firebase-messaging.js"></script>
<script src="/path-to-webpush/webpush.js"></script>
<script>
    DevonicsPush.initialize('your-app-id')
</script>
```

