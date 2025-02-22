import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button, Container, Badge, Form, Pagination } from 'react-bootstrap';

const CountryMissionsPage = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [countriesPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/mission/countries/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*',
        },
      });

      const data = await response.json();
      if (data.success) {
        setCountries(data.data);
        setFilteredCountries(data.data); // Initially show all countries
      }
    };

    fetchCountries();
  }, [token]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRegionFilter = (e) => {
    setSelectedRegion(e.target.value);
  };

  const filteredData = () => {
    return filteredCountries.filter(country => {
      const searchMatch = country.common_name.toLowerCase().includes(searchTerm.toLowerCase());
      const regionMatch = selectedRegion ? country.region === selectedRegion : true;
      return searchMatch && regionMatch;
    });
  };

  const paginateData = () => {
    const startIndex = (currentPage - 1) * countriesPerPage;
    const endIndex = startIndex + countriesPerPage;
    return filteredData().slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredData().length / countriesPerPage);

  return (
    <Container className="mt-1">
      <Form className="mb-4">
        <Row className="g-3">
          {/* Small Search Input in col-md-4 */}
          <Col md={4}>
            <Form.Group controlId="search">
              <Form.Control 
                type="text" 
                placeholder="Search by country name" 
                value={searchTerm} 
                onChange={handleSearch} 
              />
            </Form.Group>
          </Col>

          {/* Region Filter Dropdown in col-md-4 */}
          <Col md={4}>
            <Form.Group controlId="region">
              <Form.Control 
                as="select" 
                value={selectedRegion} 
                onChange={handleRegionFilter}
              >
                <option value="">Select Region</option>
                <option value="Africa">Africa</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                {/* Add more regions as required */}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <Row xs={1} sm={2} md={4} lg={4} className="g-2">
        {paginateData().map(country => (
          <Col key={country.id} md={4}>
            <Card>
              <Card.Img variant="top" src={country.flag_url} alt={`${country.common_name} Flag`} />
              <Card.Body>
                <Card.Title>{country.common_name}</Card.Title>
                <Card.Text>
                  <strong>Official Name:</strong> {country.official_name}
                </Card.Text>
                <Card.Text>
                  <strong>Capital:</strong> {country.capital}
                </Card.Text>
                <Card.Text>
                  <strong>Region:</strong> {country.region}
                </Card.Text>
                <Card.Text>
                  <strong>Population:</strong> {country.population}
                </Card.Text>
                <Card.Text>
                  <strong>Languages:</strong> 
                  {
                    Array.isArray(country.languages) ? 
                    country.languages.join(', ') : 
                    typeof country.languages === 'object' ? 
                    Object.values(country.languages).join(', ') : 
                    country.languages || 'No languages available'
                  }
                </Card.Text>

                <h5 className="mt-3">Missions:</h5>
                {country.missionscountry.length > 0 ? (
                  country.missionscountry.map(mission => (
                    <Card key={mission.id} className="mb-3">
                      <Card.Body>
                        <Card.Title>{mission.name}</Card.Title>
                        <Card.Text>{mission.description}</Card.Text>
                        <Card.Text>
                          <small>
                            {new Date(mission.start_date).toLocaleDateString()} - {new Date(mission.end_date).toLocaleDateString()}
                          </small>
                        </Card.Text>
                        <Button variant="primary" href={mission.google_map_url} target="_blank">
                          View on Google Map
                        </Button>
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <Badge pill bg="warning">No Missions Available</Badge>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination controls */}
      <Pagination>
        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
        {[...Array(totalPages).keys()].map(num => (
          <Pagination.Item 
            key={num + 1} 
            active={num + 1 === currentPage} 
            onClick={() => setCurrentPage(num + 1)}
          >
            {num + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
      </Pagination>
    </Container>
  );
};

export default CountryMissionsPage;
