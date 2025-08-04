import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function Home() {
    const [teamsData, setTeamsData] = useState<{ name: string, year: number, idTeam: number, color: string}[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
      const getTeams = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/teams");
          setTeamsData(response.data);
          console.log(teamsData)
        } catch (error) {
          console.error("Error fetching teams data:", error);
        }
      };
      getTeams();
    }, []);

    const handleSubmit = (name: string, year: number, idTeam: number, color:string) => {
        console.log("Form submitted with:", { name, idTeam, year, color });
        navigate(`/timeline/${name}`, { state: { name, idTeam, year,color } });
    };


    return(
        <>


        <div className="flex justify-center items-center min-h-screen">
        
              <div className="grid grid-cols-7 gap-4">

                { teamsData.map(teamsData => (
                <button className="rounded-2xl bg-red-100 flex flex-col items-center justify-center  hover:bg-red-800 hover:cursor-pointer hover:scale-[105%] text-transparent hover:text-black" onClick={() => {handleSubmit(teamsData.name, teamsData.year, teamsData.idTeam, teamsData.color)}}>
                  <div className="relative p-4">
                <img className="h-30 w-30" src={`src/assets/teams/${teamsData.name}.png`} alt={teamsData.name}/>
                  <div className="absolute inset-0 bg-white hover:opacity-60 rounded-2xl opacity-0 width-full h-full">

                <p className= "absolute inset-0 flex flex-col  justify-center text-center">
                {teamsData.name}<br/>{teamsData.year}
                </p>
                </div>
                </div>
                </button>
             )) 
            }

              </div>
          </div>








        </>


        
    )








}