import React, { useEffect, useState } from 'react';

const SkillsCard = ({ skill }) => {
  return (
    <div className="bg-white  rounded-lg overflow-hidden" style={{borderBottom:'2px solid whitesmoke'}}>
     
      <div className="p-4">
        <h3 className="text-xl font-semibold">{skill.name}</h3>
        <p className="text-gray-600">{skill.description}</p>
      </div>
    </div>
  );
};

const SkillsList = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      const token = localStorage.getItem("token");

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/v1/sordierskills/myskills`, {
        headers: {
          accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setSkills(data);
    };

    fetchSkills();
  }, []);

  return (
    <div className="">
        <h2 style={{ backgroundColor: "lightgreen", padding: "10px", borderRadius: "6px",margin:'0.4cm' }}>Skills list</h2>
       

      {skills.map(skill => (
        <SkillsCard key={skill.id} skill={skill} />
      ))}
    </div>
  );
};

export default SkillsList;
