import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Pagination } from 'react-bootstrap';
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const token = localStorage.getItem("token");

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortOrder, setSortOrder] = useState('desc'); // Default: Descending order
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/appoitment/`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            const data = await response.json();
            setAppointments(data.data || []);
            setFilteredAppointments(data.data || []);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setAppointments([]);
            setFilteredAppointments([]);
        }
    };

    // Filter by Date Range
    const filterByDate = () => {
        if (!startDate || !endDate) {
            setFilteredAppointments(appointments);
            return;
        }

        const filtered = appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.createdAt);
            return appointmentDate >= new Date(startDate) && appointmentDate <= new Date(endDate);
        });

        setFilteredAppointments(filtered);
    };

    // Sort by Created At
    const sortAppointments = () => {
        const sorted = [...filteredAppointments].sort((a, b) => {
            if (sortOrder === 'asc') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            } else {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });
        setFilteredAppointments(sorted);
    };

    // Search by User Name or Mission
    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);

        if (!value) {
            setFilteredAppointments(appointments);
            return;
        }

        const filtered = appointments.filter(appointment =>
            appointment.user?.firstname.toLowerCase().includes(value) ||
            appointment.user?.lastname.toLowerCase().includes(value) ||
            appointment.mission?.name.toLowerCase().includes(value)
        );

        setFilteredAppointments(filtered);
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAppointments = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Export Table Data to CSV
    const exportToCSV = () => {
        const headers = ['#', 'User', 'Mission', 'Status', 'Assigned By', 'Date'];
        const rows = currentAppointments.map((appointment, index) => [
            indexOfFirstItem + index + 1,
            `${appointment.user?.firstname} ${appointment.user?.lastname}`,
            appointment.mission?.name,
            appointment.status,
            `${appointment.assigner?.firstname} ${appointment.assigner?.lastname}`,
            new Date(appointment.createdAt).toLocaleDateString()
        ]);

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += headers.join(",") + "\r\n"; // Add headers
        rows.forEach(row => {
            csvContent += row.join(",") + "\r\n";
        });

        // Trigger download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "appointments_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Bar Chart Data with Custom Colors
    const getStatusCounts = () => {
        const statusCounts = filteredAppointments.reduce((acc, appointment) => {
            acc[appointment.status] = (acc[appointment.status] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
    };

    // Assign different colors based on status
    const getStatusColors = () => {
        const statusColorMap = {
            'active': 'rgba(255, 99, 132, 0.6)',
            'completed': 'rgba(54, 162, 235, 0.6)',
            'ongoing': 'rgba(255, 159, 64, 0.6)',
            'inactive': 'rgba(75, 192, 192, 0.6)',
            'closed': 'rgba(153, 102, 255, 0.6)',
        };

        return filteredAppointments.map(appointment => statusColorMap[appointment.status] || 'rgba(255, 205, 86, 0.6)');
    };

    const chartData = {
        labels: getStatusCounts().map(item => item.status),
        datasets: [
            {
                label: 'Appointments by Status',
                data: getStatusCounts().map(item => item.count),
                backgroundColor: getStatusColors(),
                borderColor: getStatusColors().map(color => color.replace('0.6', '1')), // Make border more opaque
                borderWidth: 1
            }
        ]
    };

    return (
        <div className="container mt-4">
           
            <h2 className="text-center mb-4" style={{backgroundColor:'lightgreen',padding:'0.3cm',color:'black',borderRadius:'6px'}}>Appointments Report</h2>
      

            {/* Filter Inputs */}
            <div className="d-flex gap-2 mb-3">
                <Form.Control  type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                <Form.Control type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                <Button  style={{ border: '1px solid green', backgroundColor: 'lightgreen', color: 'black',margonTop:'-1cm' }} onClick={filterByDate}>Filter</Button>
            </div>

            {/* Search & Sorting */}
            <div className="d-flex gap-2 mb-3">
                <Form.Control  type="text"  style={{ border: '1px solid green', backgroundColor: 'white', color: 'black',margonTop:'-1cm' }} placeholder="Search by user or mission..." value={searchTerm} onChange={handleSearch} />
                <Button style={{ border: '1px solid green', backgroundColor: 'lightgreen', color: 'black',margonTop:'-1cm' }} onClick={() => { setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); sortAppointments(); }}>
                    Sort by Date ({sortOrder === 'asc' ? 'Oldest' : 'Newest'})
                </Button>
                {/* Export Button */}
                <Button  style={{ border: '1px solid green', backgroundColor: 'lightgreen', color: 'black',margonTop:'-1cm' }} onClick={exportToCSV}>Export to CSV</Button>
            </div>

            {/* Bar Chart */}
            <Table hover className='member'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>User</th>
                        <th>Mission</th>
                        <th>Status</th>
                        <th>Assigned By</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {currentAppointments.length > 0 ? (
                        currentAppointments.map((appointment, index) => (
                            <tr key={appointment.id}>
                                <td>{indexOfFirstItem + index + 1}</td>
                                <td>{appointment.user?.firstname} {appointment.user?.lastname}</td>
                                <td>{appointment.mission?.name}</td>
                                <td>{appointment.status}</td>
                                <td>{appointment.assigner?.firstname} {appointment.assigner?.lastname}</td>
                                <td>{new Date(appointment.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No appointments found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>


            {/* Appointments Table */}


            {/* Pagination */}
            <Pagination>
                {[...Array(Math.ceil(filteredAppointments.length / itemsPerPage)).keys()].map(number => (
                    <Pagination.Item key={number + 1} onClick={() => paginate(number + 1)} active={number + 1 === currentPage}>
                        {number + 1}
                    </Pagination.Item>
                ))}
            </Pagination>



            <div className="row member m-3">
                <div className="col-12 col-md-6 mb-3"> {/* Change col-md-4 to col-md-8 or col-md-12 */}
                    <div className="mb-4">
                        <h4>Appointments by Status</h4>
                        <Bar data={chartData} style={{ height: '10cm', width: '100%' }} />
                    </div>
                </div>
            </div>


            <ToastContainer />
        </div>
    );
};

export default AppointmentsPage;
