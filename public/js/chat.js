const socket = io()
// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('#data')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $location = document.querySelector('#location')
// socket.on('connect', () => {
//     console.log('Connected to server')
// })
socket.on('message', (data) => {
    console.log(data)
    
    // const html =  fs.readFileSync(path.join(__dirname,'../partials/messages.ejs')).toString()
    $messages.insertAdjacentHTML('beforeend','<div class="message"> <p><span class="message__name">'+data.username+'</span> <span class="message__meta">'+moment(data.createdAt).format('h:mm a')+'</span></p><p>'+data.text+'</p></div>')
})
socket.on('loadMessages', (data) => {
    console.log(data)
    data.forEach(element => {
        $messages.insertAdjacentHTML('beforeend','<div class="message"> <p><span class="message__name">'+element.user+'</span> <span class="message__meta">'+moment(element.createdAt).format('h:mm a')+'</span></p><p>'+element.msg+'</p></div>')
    });
})
socket.on('geolocation', (data) => {
    console.log('latitude- '+data.text.latitude)
    console.log('longitude- '+data.text.longitude)
    const url = `https://www.google.com/maps?q=${data.text.latitude},${data.text.longitude}`
    $messages.insertAdjacentHTML('beforeend','<div class="message"> <p><span class="message__name">Username</span> <span class="message__meta">'+moment(data.createdAt).format('h:mm a')+'- Location- <a href="'+url+'" target="_blank">My Location</a></p>')
    // console.log('https://google.com/maps?q='+data.latitude+','+data.longitude)
})
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // disable button
    $messageFormButton.setAttribute('disabled', 'disabled')
    const m = document.querySelector('#data').value
    // comst m = e.target.elements.data.value
    socket.emit('sendMessage', m , (error)=>
    {
        // enable button
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
         
        console.log('Message delivered')

    })
    
})

$sendLocationButton.addEventListener('click', () => {
    // disable button
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, ()=>{
            // enable button
            $sendLocationButton.removeAttribute('disabled')

            console.log('Location shared')
        })
        // console.log(position)
        // console.log(position.coords.latitude, position.coords.longitude)
    })
})
// const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})
// console.log(username, room)
// socket.emit('join', {username, room})

// socket.on('count', (data) => {
//     console.log('count Updated', data)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('clicked')
//     socket.emit('increment')
// })

