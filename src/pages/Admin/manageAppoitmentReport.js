import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";

const UsersTable = () => {
  const { batarianId } = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/users", {
      headers: {
        Authorization: `Bearer YOUR_ACCESS_TOKEN`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Filter users based on batarianId
          const filteredUsers = data.users.filter(
            (user) => user.batarianId === batarianId
          );
          setUsers(filteredUsers);
        }
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, [batarianId]);

  return (
    <div>
      <h2>Users under Batarian ID: {batarianId}</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstname} {user.lastname}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No users found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default UsersTable;
