import { useState, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom";
import axios from "axios";

export function Timeline() {
    const { idTeam, name, year } = useLocation().state || {};

    const [eventData, setEventData] = useState<{ idEvent:number, name: string, description: string, img: string}[]>([]);
    const [NPData, setNPData] = useState<{ idPlayer:number, name: string,img: string, position:string}[]>([]);
    const [TTData, setTTData] = useState<{ idTrophy:number, name: string, img: string, amount:number}[]>([]);


    const typingIndex = useRef(0);
    const typingInterval = useRef<number | null>(null);

    const [hoveredEventId, setHoveredEventId] = useState<number | null>(null);
    const [typedDescription, setTypedDescription] = useState<string>("");

    const buttonStyle = "bg-[var(--acent)] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[var(--accent)] dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 cursor-pointer";

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

        getTeamsTrophies();
        getNotablePlayers();
        getTimeline();

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
                }, 5); // Typing speed in ms
            }
        } else {
            setTypedDescription("");
            if (typingInterval.current) clearInterval(typingInterval.current);
        }
        return () => {
            if (typingInterval.current) clearInterval(typingInterval.current);
        };
    }, [hoveredEventId, eventData]);

    return (
        <>
        <div className="flex items-center justify-center gap-2 pt-10">
        <img src={`src/assets/teams/${name}.png`} className="w-25 h-25" />
        <p className="font-medium"> {name} <br/> Starting Season: {year} </p>
        </div>

        <div className="flex items-center justify-center m-10">
            <button className={buttonStyle}>Trophies</button>
            <button className={buttonStyle}>Timeline</button>
            <button className={buttonStyle}>Notable Players</button>
            <button className={buttonStyle}>Historic 11</button>
        </div>

        <div className="">
        <h1 className="font-bold m-2">Trophie Case</h1>
        <div className="flex flex-wrap justify-center items-center pointer-events-none">
        {TTData.map(TTData => (
            <div key={TTData.idTrophy} className="m-2 ">
                <img src={`src/assets/trophies/${TTData.img}`} className="h-[150px] w-[150px] m-auto" alt={TTData.img} />
                <p className="text-center"> {TTData.name} </p>
                <p className="text-center"> {TTData.amount} </p>
            </div>
        ))}
        </div>
        </div>

        <div className="m-2 mb-10">
        {eventData.map(eventData => (
            <div key={eventData.idEvent} className="mb-2 flex w-[33%]">
                <div className="bg-[var(--accent)] w-full h-40 flex rounded-2xl hover:bg-[var(--white)] hover:text-[var(--black)] ease-in-out duration-200 " onMouseOver={() => setHoveredEventId(eventData.idEvent)}
                onMouseOut={() => setHoveredEventId(null)}>
                <img src={`src/assets/events/${eventData.img}`} className="hidden lg:flex w-[30%] p-2 rounded-2xl" />
                <h1 className="text-xl font-semibold m-auto text-center">"{eventData.name}"</h1>
            </div>

                <div className={hoveredEventId === eventData.idEvent ? "bg-[var(--gray)] p-2 text-xl absolute w-[66%] translate-x-[50%] rounded-xl border-2 border-[var(--accent)]" : "hidden"} key={eventData.idEvent}>
                    <p>{hoveredEventId === eventData.idEvent ? typedDescription : ""}</p>
                </div>
            </div>

        ))}
        </div>


        <div className="m-2 mb-10">
        <h1 className="font-bold m-2" id="NotablePlayers">Notable Players</h1>
        <div className="flex flex-wrap ">
        {NPData.map(NPData => (
            <div key={NPData.idPlayer} className="m-2 ">
                <img src={`src/assets/players/${NPData.img}`} className="h-[100px] w-[100px] m-auto" alt={NPData.img} />
                <p className="text-center font-bold"> {NPData.name} </p>
                <p className="text-center font-light"> {NPData.position} </p>
            </div>
        ))}
        </div>
        </div>

    </>
    )
}