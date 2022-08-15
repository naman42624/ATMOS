const users = []

//addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id,username, room})=>{
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    // Validate the data
    if(!username || !room){
        return {
            error: "Username and room are required"
        }
    }
    // Check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    // Validate username
    if(existingUser){
        return {
            error: "Username is in use"
        }
    }

    // Store user
    const user = {id,username, room}
    users.push(user)
    return {user}
}

const removeUser=(id)=>{
    const index = users.findIndex((user)=> user.id === id)
    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUser=(id)=>{
    return users.find((user)=> user.id === id)
}

const getUsersInRoom=(room)=>{
    return users.filter((user)=> user.room === room)
}
addUser({
    id: 12,
    username:'Naman',
    room:'Project1'
})

addUser({
    id: 15,
    username:'Nam',
    room:'Project1'
})
addUser({
    id: 56,
    username:'Naman',
    room:'Project2'
})

console.log(users)

console.log(removeUser(12))
console.log(users)

console.log(getUser(15))
console.log(getUsersInRoom('project1'))