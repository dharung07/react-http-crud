import { Button, EditableText, InputGroup, OverlayToaster, Position } from '@blueprintjs/core';
import { useEffect, useState } from 'react';

import './App.css';

function App() {
   const [users, setUsers] = useState([])
   const [newName, setNewName] = useState('')
   const [newEmail, setNewEmail] = useState('')
   const [newWebsite, setNewWebsite] = useState('')

   const AppToster = OverlayToaster.createAsync({
      position: Position.TOP
   })

   const showUserAddedToast = async (msg, int) => {
      (await AppToster).show({
         message: msg,
         intent: int,
         timeout: 2000
      })
   }

   useEffect(() => {
      fetch(`https://jsonplaceholder.typicode.com/users`)
         .then((response) => response.json())
         .then((data) => setUsers(data))
   }, [])

   function addUser() {
      const name = newName.trim()
      const email = newEmail.trim()
      const website = newWebsite.trim()

      if (name && email && website) {
         fetch(`https://jsonplaceholder.typicode.com/users`,
            {
               method: "POST",
               body: JSON.stringify({
                  name,
                  email,
                  website
               }),
               headers: {
                  "Content-Type": "application/json; charset=UTF-8"
               }
            }).then((response) => response.json())
            .then((data) => {
               setUsers([...users, data])
               showUserAddedToast('New user added', 'success')
               setNewName('')
               setNewEmail('')
               setNewWebsite('')
            })
      }
   }

   function updateUser(id, value, key) {
      setUsers((users) => {
         return (users.map(user => {
            return user.id === id ? { ...user, [key]: value } : user;
         }))
      })
   }

   function updateUserButton(id) {
      const user = users.find((user) => user.id === id);
      fetch(`https://jsonplaceholder.typicode.com/users`, {
         method: 'PUT',
         body: JSON.stringify(user),
         headers: {
            'Content-Type': 'application/json; charset=UTF-8'
         }
      }).then((response) => response.json())
         .then((data) => showUserAddedToast('User updated', 'primary'))
   }

   function deleteUser(id) {
      fetch(`https://jsonplaceholder.typicode.com/users/${id}`, { method: "DELETE" })
         .then((data) => {
            setUsers((users) => {
               return users.filter(user => user.id !== id)
            })
            showUserAddedToast('User deleted', 'danger')
         })
   }

   return (
      <div className="App">
         <table className="custom-bp4-html-table modifier">
            <thead>
               <th>Id</th>
               <th>Name</th>
               <th>Email</th>
               <th>Website</th>
               <th>Action</th>
            </thead>
            <tbody>
               {users.map(user =>
                  <tr key={user.id}>
                     <td><EditableText value={user.id} /></td>
                     <td><EditableText value={user.name} onChange={(value) => updateUser(user.id, value, 'name')} /></td>
                     <td><EditableText value={user.email} onChange={(value) => updateUser(user.id, value, 'email')} /></td>
                     <td><EditableText value={user.website} onChange={(value) => updateUser(user.id, value, 'website')} /></td>
                     <td>
                        <Button intent='primary' onClick={() => updateUserButton(user.id)}>Update</Button>
                        &nbsp;
                        <Button intent='danger' onClick={() => deleteUser(user.id)}>Delete</Button>
                     </td>
                  </tr>
               )}
            </tbody>
            <tfoot>
               <tr>
                  <td></td>
                  <td><InputGroup placeholder='Enter name' value={newName} onChange={(e) => setNewName(e.target.value)} /></td>
                  <td><InputGroup placeholder='Enter email' value={newEmail} onChange={(e) => setNewEmail(e.target.value)} /></td>
                  <td><InputGroup placeholder='Enter website' value={newWebsite} onChange={(e) => setNewWebsite(e.target.value)} /></td>
                  <td>
                     <Button intent='success' onClick={addUser}>Add user</Button>
                  </td>
               </tr>
            </tfoot>
         </table>
      </div>
   );
}

export default App;
