// React hooks (useState, useEffect) for state management and lifecycle events.
// Imports clubs and matches from a configuration file and a CSS file for styling.
import React, { useState, useEffect } from 'react';
import { clubs, matches } from '../config/config.js';
import '../style/DrawPage.css';

function DrawPage() {
    const [showNotice, setShowNotice] = useState(true); // showNotice: Controls the display of a notice to the user.
    const [potIndex, setPotIndex] = useState(1); // showNotice: Controls the display of a notice to the user.
    const [pickedClubs, setPickedClubs] = useState([]); // showNotice: Controls the display of a notice to the user.
    const [club, setClub] = useState(""); // club: Stores the currently selected club.
    // clubSelected & opponentsSelected: Flags to manage the state of club/opponent selection.
    const [clubSelected, setClubSelected] = useState(false);
    const [opponentsSelected, setOpponentsSelected] = useState(true);
    const [donePot, setDonePot] = useState(false); // donePot: Indicates if the current pot has been completed.

    // useEffect with beforeunload: Prevents the user from accidentally leaving the page. This is useful for maintaining the state during the draw process.
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    /* getClub Function:
        Selects a random club based on the current potIndex.
        Updates state to mark the club as selected and ready for opponent selection.
        Uses randomClub helper function to pick a random club not already selected.*/
    const getClub = async () => {
        try {            
            const res = randomClub()
            if (!res) return;

            setClub(res);
            pickedClubs.push(res);
            setClubSelected(true);
            setOpponentsSelected(false);
        } catch (error) {
            console.error('Error fetching club:', error);
        }
    }

    /* randomClub Function:
        Filters the clubs array based on the current pot and clubs already picked.
        Randomly selects a club that meets these conditions.*/
    const randomClub = () => {
        const conditions = [
            (c) => c.pot === potIndex,
            (c) => !pickedClubs.includes(c.name)
        ];

        const availableClubs = clubs.filter((c) => conditions.every((condition) => condition(c)));
        const randomIndex = Math.floor(Math.random() * availableClubs.length);
        const c = availableClubs[randomIndex];

        return c ? c.name : "";
    }
    
    /* getOpponents Function:
        Selects opponents for the chosen club.
        Uses the randomOpponents helper function to assign opponents to the selected club.
        Updates state after opponents are selected.*/
    const getOpponents = async () => {
        if (potIndex < 4 && pickedClubs.length >= 9) setDonePot(true);
    
        try {
            const res = randomOpponents(club);
            if (!res) return;
    
            setClubSelected(false);
            setOpponentsSelected(true);
        } catch (error) {
            console.error('Error fetching opponents:', error);
        }
    }

    /* randomOpponents Function:
        Iterates through pots to find suitable opponents.
        Uses getOpponent to ensure opponents meet the conditions (e.g., not from the same nation).
        Updates the matches object with selected opponents for both home and away matches.*/
    const randomOpponents = (c) => {
        for(let i = 1; i <= 4; i++){
            const homeMatchKey = `pot${i}H`;
            const awayMatchKey = `pot${i}A`;

            if(matches[c][homeMatchKey] === ""){
                const homeOpponent = getOpponent(c, i, awayMatchKey, `pot${potIndex}A`);
                if(homeOpponent){
                    matches[c][homeMatchKey] = homeOpponent;
                    matches[homeOpponent][`pot${potIndex}A`] = c;
                }
            }

            if(matches[c][awayMatchKey] === ""){
                const awayOpponent = getOpponent(c, i, homeMatchKey, `pot${potIndex}H`);
                if(awayOpponent){
                    matches[c][awayMatchKey] = awayOpponent;
                    matches[awayOpponent][`pot${potIndex}H`] = c;
                }
            }

            if(i === 4) return true;
        }
        return false;
    }

    const getOpponent = (cl, potIndex, matchKey, oppositeMatchKey) => {
        const conditions = [
            c => c.nation !== getClubInfo(cl)?.nation,
            c => c.name !== matches[cl][matchKey],
            c => matches[c.name][oppositeMatchKey] === "",
            c => c.pot === potIndex
        ];

        const availableOpponents = clubs.filter(co => conditions.every(condition => condition(co)));

        if (availableOpponents.length === 0) return "";

        const randomIndex = Math.floor(Math.random() * availableOpponents.length);
        return availableOpponents[randomIndex].name;
    }

    const getClubInfo = (clubName) => {
        return clubs.find(club => club.name === clubName);
    }
    
    /* getAllPot and allPot Functions:
        Automates the selection of clubs and opponents for the entire pot.
        Calls randomClub and randomOpponents in sequence to fill the pot.*/
    const getAllPot = async () => {
        try {
            const res = allPot();
            if (!res) return;
    
            if (potIndex < 4) setDonePot(true);

            setClubSelected(true);
            setOpponentsSelected(true);
        } catch (error) {
            console.error('An error occurred: ' + error.message);
        }
    }

    const allPot = async () => {
        for (let i = 1; i <= 9; i++) {
            console.log(`Processing iteration: ${i} for Pot ${potIndex}`);
    
            const res = await randomClub();
            if (!res) {
                console.warn(`Failed to select a random club on iteration ${i}`);
                return false;
            }
            setClub(res);
            pickedClubs.push(res);
            console.log(`Selected Club: ${res}`);
            
            const opponents = await randomOpponents(res);
            if (!opponents) {
                console.warn(`Failed to select opponents for club: ${club}`);
                return false;
            }
    
            if (i === 9) return true;
        }
        return false;
    };
    
    /* nextPot Function:
        Moves to the next pot and resets relevant state variables.
        Useful for managing the draw's progress across different pots.*/
    const nextPot = () => {
        setPotIndex(potIndex + 1);
        setDonePot(false);
        setClubSelected(false);
        setOpponentsSelected(true);
        setPickedClubs([]);
        console.log(matches);
    }

    const getClubIndex = (club) => {
        return clubs.findIndex((c) => c.name === club);
    };

    // getCurrentPotClubs: Displays clubs in the current pot with an image and name.
    const getCurrentPotClubs = () => {
        return (
            <>
                {clubs.filter((c) => c.pot === potIndex)
                    .map((c, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 40, marginBottom: 2, marginLeft: '20%', fontSize: '14px', fontFamily: 'Kanit' }}>
                            <img src={require(`../img/${c.name}.png`)} alt={c.name} width={24} height={24} />
                            <p style={{ color: pickedClubs.includes(c.name) ? 'darkgrey' : 'black' }}>{c.name}</p>
                        </div>
                    ))}
            </>
        )
    }

    // getMatchesPot: Displays matches for the current pot with club names and images.
    const getMatchesPot = () => {
        return (
            Object.keys(matches).map((c, i) =>
                c && c !== '' && clubs[getClubIndex(c)].pot === potIndex ?
                    <div key={i} className='match'>
                        <div className='club-name'>
                            <img src={require(`../img/${c}.png`)} alt={c} style={{ width: 24, height: 24, marginRight: 5 }} />
                            <p>{c}</p>
                        </div>
                        <div className='opponents-names'>
                            {Object.keys(matches[c]).map((matchkey, i) =>
                                <div key={i} className='opponent'>
                                    {matches[c][matchkey] &&
                                        <>
                                            <img src={require(`../img/${matches[c][matchkey]}.png`)} alt={matches[c][matchkey]} style={{ width: 22, height: 22 }} />
                                            <p>{matches[c][matchkey]}</p>
                                        </>
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                    : null
            )
        )
    }

    // ClubImage: A small reusable component to display club images with a tooltip.
    const ClubImage = ({ src, alt, tooltip }) => (
        <div className="club-img-container">
            <img src={src} alt={alt} className="club-img" />
            <div className="tooltip">
                {tooltip !== null &&
                    Object.keys(tooltip).map((c, i) =>
                        matches[alt][c] !== "" && matches[alt][c] !== null ?
                            <img key={i} src={require(`../img/${matches[alt][c]}.png`)} alt={matches[alt][c]} style={{ width: 26, height: 26 }} />
                            : null
                    )
                }
            </div>
        </div>
    );

    // getPot: Renders images for each pot.
    const getPot = (potIndex) => {
        return (
            Object.keys(matches).map((c, i) =>
                c && c !== '' && clubs[getClubIndex(c)].pot === potIndex ?
                    <React.Fragment key={i}>
                        <ClubImage src={require(`../img/${c}.png`)} alt={c} tooltip={matches[c]} />
                    </React.Fragment>
                    : null
            )
        )
    }

    return (
        <div className='c'>
            {/* Shows a notice when showNotice is true. */}
            {showNotice && (
                <div className="notice">
                    <div className="notice-content">
                        <p>
                            This project is an unofficial simulation of the UEFA Champions League draw. It is not affiliated with or endorsed by UEFA.
                        </p>
                        <button className='ok-btn' onClick={() => setShowNotice(false)}>OK</button>
                    </div>
                </div>
            )}
            {/* Main draw content is rendered only if the notice is dismissed (showNotice is false). */}
            {!showNotice && (
                <>
                    {/* Header: Contains a disclaimer about the simulation. */}
                    <header className='header'>This project is an unofficial simulation of the UEFA Champions League draw. It is not affiliated with or endorsed by UEFA.</header>
                    
                    {/* Left Aside: Buttons to control the draw (e.g., "GET CLUB", "GET OPPONENTS") and a display for the current pot. */}
                    <aside className='left-aside'>

                        {/* Buttons use handlers like getClub, getOpponents, and nextPot to control the draw process. */}
                        <div className='buttons'>
                            {!donePot ? (
                                <button className='get-club' onClick={() => getClub()} disabled={clubSelected}>GET CLUB</button>
                            ) : (
                                <button className='next-pot' onClick={() => nextPot()}>NEXT POT</button>
                            )}

                            <div className='current-club'>
                                {club &&
                                    <>
                                        <img src={require(`../img/${club}.png`)} alt={club} width={28} height={28} />
                                        <p> {club} </p>
                                    </>
                                }
                            </div>

                            <button className='get-opponents' onClick={() => getOpponents()} disabled={opponentsSelected}>GET OPPONENTS</button>
                            <button className='get-all-pot' onClick={() => getAllPot()} disabled={clubSelected || donePot}>GET ALL POT</button>
                        </div>

                        <hr className='line' />
                        <div className='current-pot'>
                            <p style={{ width: '100%', margin: 0, marginBottom: '15px', marginTop: '10px', textAlign: 'center', fontSize: 'larger', fontStyle: 'italic', fontWeight: 'bold' }}>Pot {potIndex}</p>
                            {getCurrentPotClubs()}
                        </div>
                    </aside>
                    
                    {/* Main: Displays matches for the current pot using getMatchesPot. */}
                    <main className='main'>
                        {getMatchesPot()}
                    </main>
                    
                    {/* Right Aside: Shows the state of all pots (getPot). */}
                    <aside className='right-aside'>
                        {potIndex >= 1 &&
                            <div className='pot'>Pot 1{getPot(1)}</div>
                        }
                        {potIndex >= 2 &&
                            <div className='pot'>Pot 2{getPot(2)}</div>
                        }
                        {potIndex >= 3 &&
                            <div className='pot'>Pot 3{getPot(3)}</div>
                        }
                        {potIndex >= 4 &&
                            <div className='pot'>Pot 4{getPot(4)}</div>
                        }
                    </aside>
                </>
            )}
        </div>
    );
}

export default DrawPage;
