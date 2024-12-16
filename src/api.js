export const fetchRobots = async () => {
    const response = await fetch("http://localhost:8000/robots");
    return response.json();
  };
  