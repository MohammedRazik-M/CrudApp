import './App.css'
import axios from 'axios'
import { useEffect, useState } from 'react'

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [userData, setUserData] = useState({name: "", age: "", city: ""});

  const getAllUsers = async () => {
    await axios.get("http://localhost:8000/users").then((res) => {
      setUsers(res.data);
      setFilteredUsers(res.data);
    });
  };
  useEffect(()=> {
    getAllUsers();
  }, []);
  
  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchText) ||
    user.city.toLowerCase().includes(searchText));
    setFilteredUsers(filteredUsers);
  };

  const handleDelete = async (id) => {
    const isConformed = window.confirm("Are you sure you want to delete this user?");
    if(isConformed) {
      await axios.delete(`http://localhost:8000/users/${id}`).then((res) => {
        setUsers(res.data);
        setFilteredUsers(res.data);
      });
    }
  };

  const handleAddRecord = () => {
    setUserData({name: "", age: "", city: ""});
    setIsModelOpen(true);
  };

  const handleModelClose = () => {
    setIsModelOpen(false);
    getAllUsers();
  };

  const handleData = (e) => {
    setUserData({...userData, [e.target.name] : e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(userData.id) {
      await axios.patch(`http://localhost:8000/users/${userData.id}`, userData).then((res) => {
        console.log(res);
      });
    }
    else {
      await axios.post("http://localhost:8000/users", userData).then((res) => {
        console.log(res);
      });
    }
    handleModelClose(); 
  };

  const handleEdit = (user) => {
    setUserData(user);
    setIsModelOpen(true);
  };

  return (
    <>
      <div className="container">
        <h3>CRUD application with React.js Frontend and Node.js Backend</h3>
        <div className="input-search">
          <input type="search" placeholder="Search Here" onChange={handleSearch}/>
          <button className="btn green" onClick={handleAddRecord}>Add Record</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              filteredUsers && filteredUsers.map((user, index) => {
                return (
                  <tr key={user.id}>
                    <td>{index+1}</td>
                    <td>{user.name}</td>
                    <td>{user.age}</td>
                    <td>{user.city}</td>
                    <td><button className="btn green" onClick={() => handleEdit(user)}>Edit</button></td>
                    <td><button className="btn red" onClick={() => handleDelete(user.id)}>Delete</button></td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        {isModelOpen && (
          <div className="model">
            <div className="model-content">
              <span className="close" onClick={handleModelClose}>&times;</span>
              <h2>{userData.id? "Update Record":"Add Record"}</h2>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" value={userData.name} name="name" id="name" onChange={handleData}/>
              </div>
              <div className="input-group">
                <label htmlFor="age">Age</label>
                <input type="number" value={userData.age} name="age" id="age" onChange={handleData}/>
              </div>
              <div className="input-group">
                <label htmlFor="city">City</label>
                <input type="text" value={userData.city} name="city" id="city" onChange={handleData}/>
              </div>
              <button className="btn green" onClick={handleSubmit}>{userData.id?"Update Record":"Add Record"}</button>
            </div>
          </div>
        )} 
      </div>
    </>
  )
}

export default App
