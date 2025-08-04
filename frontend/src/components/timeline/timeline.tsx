import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export function Timeline() {
    const { idTeam, name, year, color } = useLocation().state || {};
    const navigate = useNavigate();

    const [eventData, setEventData] = useState<{ idEvent:number, season:string, name: string, description: string, img: string}[]>([]);

    const [NPData, setNPData] = useState<{ idPlayer:number, name: string,img: string, position:string}[]>([]);
    const [TTData, setTTData] = useState<{ idTrophy:number, name: string, img: string, amount:number}[]>([]);
    const [HEData, setHEData] = useState<{ idEleven:number, year:number, img: string}[]>([]);

    const typingIndex = useRef(0);
    const typingInterval = useRef<number | null>(null);

    const [hoveredEventId, setHoveredEventId] = useState<number | null>(null);
    const [typedDescription, setTypedDescription] = useState<string>("");

    const colorTeam = color || "#FF5D73"; // Default color if colors is not provided
    const buttonStyle = 'focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none cursor-pointer hover:scale-[105%] ease-in-out duration-200';

    useEffect(() => {
        const getTimeline = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/events?idTeam=${idTeam}`);
                setEventData(response.data);
                // console.log(eventData) // Removed to avoid dependency warning
            } catch (error) {
                console.error("Error fetching timeline data:", error);
            }
        };

        const getNotablePlayers = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/notable-players?idTeam=${idTeam}`);
                setNPData(response.data);
            } catch (error) {
                console.error("Error fetching notable players data:", error);
            }
        }

        const getTeamsTrophies = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/teams-trophies?idTeam=${idTeam}`);
                setTTData(response.data);
            } catch (error) {
                console.error("Error fetching teams trophies data:", error);
            }
        }

        const getHistoricEleven = async () => {
            try {
                 const response = await axios.get(`http://localhost:5000/api/historic-eleven?idTeam=${idTeam}`);
                 setHEData(response.data);
            } catch (error) {
                console.error("Error fetching historic eleven data:", error);
            }
        }

        getTeamsTrophies();
        getNotablePlayers();
        getTimeline();
        getHistoricEleven();
    }, [idTeam]);

    useEffect(() => {
        if (hoveredEventId !== null) {
            const event = eventData.find(e => e.idEvent === hoveredEventId);
            if (event) {
                setTypedDescription("");
                typingIndex.current = 0;
                if (typingInterval.current) clearInterval(typingInterval.current);
                typingInterval.current = window.setInterval(() => {
                    typingIndex.current += 1;
                    setTypedDescription(event.description.slice(0, typingIndex.current));
                    if (typingIndex.current >= event.description.length) {
                        if (typingInterval.current) clearInterval(typingInterval.current);
                    }
                }, 10); // Typing speed in ms
            }
        } else {
            setTypedDescription("");
            if (typingInterval.current) clearInterval(typingInterval.current);
        }
        return () => {
            if (typingInterval.current) clearInterval(typingInterval.current);
        };
    }, [hoveredEventId, eventData]);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }
    
    const Home = () => {
        navigate("/");
    }

    return (
        <>
        <button className={buttonStyle} onClick={() => Home()}>Home</button>

        <div className="flex items-center justify-center gap-2 pt-10">
        <img src={`../src/assets/teams/${name}.png`} className="w-25 h-25" />
        <p className="font-medium"> {name} <br/> Starting Season: {year} </p>
        </div>

        <div className="flex items-center justify-center m-10">
            <button className={buttonStyle} style={{backgroundColor: colorTeam}} onClick={() => scrollTo("Trophies")}>Trophies</button>
            <button className={buttonStyle} style={{backgroundColor: colorTeam}} onClick={() => scrollTo("Timeline")}>Timeline</button>
            <button className={buttonStyle} style={{backgroundColor: colorTeam}} onClick={() => scrollTo("NotablePlayers")}>Notable Players</button>
            <button className={buttonStyle} style={{backgroundColor: colorTeam}} onClick={() => scrollTo("HistoricEleven")}>Historic 11</button>
        </div>

        <div className="" id="Trophies">
        <h1 className="font-bold m-2">Trophie Case</h1>
        <div className="flex flex-wrap justify-center items-center pointer-events-none">
        {TTData.map(TTData => (
            <div key={TTData.idTrophy} className="m-2 ">
                <img src={`../src/assets/trophies/${TTData.img}`} className="h-[150px] w-[150px] m-auto" alt={TTData.img} />
                <p className="text-center"> {TTData.name} </p>
                <p className="text-center"> {TTData.amount} </p>
            </div>
        ))}
        </div>
        </div>

        <div className="m-2 mb-10" id="Timeline">
        <h1 className="font-bold m-2">Timeline</h1>
        {eventData.map(eventData => (
            
            <div key={eventData.idEvent} className="mb-2 flex flex-col w-[33%] select-none">
                
                <h1 className="text-center w-full bg-white font-black text-black rounded-t-2xl">{eventData.season}</h1>
                <div className="w-full h-40 flex ease-in-out duration-200 rounded-b-2xl hover:scale-[101%] hover:rounded-t-sm" style={{backgroundColor: colorTeam}}onMouseOver={() => setHoveredEventId(eventData.idEvent)}
                onMouseOut={() => setHoveredEventId(null)}>
                
                
                
                <img src={`../src/assets/events/${eventData.img}`} className="hidden lg:flex w-[30%] p-2 rounded-2xl " />
                <h1 className="text-xl font-semibold m-auto text-center">"{eventData.name}"</h1>
            
                </div>
                <div className={hoveredEventId === eventData.idEvent ? "bg-[var(--gray)] p-2 text-xl absolute w-[66%] translate-x-[50%] rounded-xl border-2 duration-300 ease-in-out opacity-100" : "opacity-0 absolute w-[66%] translate-x-[50%]"} style={{borderColor: colorTeam}} key={eventData.idEvent}>
                    <p>{hoveredEventId === eventData.idEvent ? typedDescription : ""}</p>
                </div>
                
            </div>
            

        ))}
        </div>


        <div className="m-2 mb-10" id="NotablePlayers">
        <h1 className="font-bold m-2" id="NotablePlayers">Notable Players</h1>
        <div className="flex flex-wrap ">
        {NPData.map(NPData => (
            <div key={NPData.idPlayer} className="m-2 ">
                <img src={`../src/assets/players/${NPData.img}`} className="h-[100px] w-[100px] m-auto" alt={NPData.img} />
                <p className="text-center font-bold"> {NPData.name} </p>
                <p className="text-center font-light"> {NPData.position} </p>
            </div>
        ))}
        </div>
        </div>

        <div className="m-2 mb-10" id="HistoricEleven">
        <h1 className="font-bold m-2" id="HistoricEleven">Historic Eleven</h1>
        <div className="flex flex-wrap ">
        {HEData.map(HEData => (
            <div key={HEData.idEleven} className="m-2 ">
                <img src={`../src/assets/historicEleven/${HEData.img}`} className="h-[300px] w-[250px] m-auto" alt={HEData.img} />
                <p className="text-center font-bold"> {HEData.year} </p>
            </div>
        ))}
        </div>
        </div>

    </>
    )

}
