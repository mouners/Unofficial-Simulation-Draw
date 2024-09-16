// Imports: The code imports React hooks (useEffect, useState) and a CSS file for styling.
import React, {useEffect, useState} from 'react';
import '../style/AboutPage.css';

// AboutPage is a functional component with state management and a scroll event handler.
function AboutPage() {
    // isShrunk state controls the shrinking effect of the top bar based on the scroll position.
    const [isShrunk, setIsShrunk] = useState(false);

    // The useEffect hook adds a scroll event listener to the window object that sets isShrunk to true if the scroll position exceeds 100 pixels, triggering a CSS class change.
    useEffect(() => {
        const handleScroll = () => {
        if (window.scrollY > 100) {
            setIsShrunk(true);
        } else {
            setIsShrunk(false);
        }
        };

        window.addEventListener('scroll', handleScroll);

        // he event listener is removed during cleanup to prevent memory leaks.
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div>
            {/*  Contains a disclaimer about the project not being affiliated with UEFA. */}
            <p className='header'>
                This project is an unofficial simulation of the UEFA Champions League draw. It is not affiliated with or endorsed by UEFA.
            </p>
            {/*  Uses the isShrunk state to conditionally apply the 'shrink' class to topBar for a shrinking effect on scroll. */}
            <div className={`topBar ${isShrunk ? 'shrink' : ''}`}>
                {/*  Contains navigation links to "Home", "Draw", and "About" pages. */}
                <nav>
                    <a href='/'>Home</a>
                    <a href='/draw'>Draw</a>
                    <a href='/about'>About</a>
                </nav>
            </div>
            {/* The main content is divided into different sections: "Introduction", "How It Works", "Features", "Credits", and "Contact". */}
            <div className="about-container">
                <h1>About</h1>
                <section className="section">
                    <h2>Introduction</h2>
                    <p>
                        A few week ago, I watched the UEFA Champions League Group Stage Draw, and for the first time, the draw was conducted using a computer. While watching, I couldn't help but wonder: How was it done? What algorithm was behind it?
                    </p>
                    <p>
                        After some research and development, I found the answers. Today, I'm excited to present a full simulation of the UEFA Champions League Group Stage Draw. With this project, you can now host your very own draw!
                    </p>
                </section>

                <section className="section">
                    <h2>How It Works</h2>
                    <p>This simulation mimics the UEFA Champions League draw process. Each pot consists of a group of teams based on their rankings and performance. The draw process involves randomly selecting clubs from each pot and pairing them to form the matches. The simulation ensures that the clubs are matched according to the real-world rules, such as avoiding clashes between teams from the same country.</p>
                    <p>Click "Start Draw" to begin the simulation and see how the teams are matched!</p>
                </section>

                <section className="section">
                    <h2>Features</h2>
                    <ul>
                        <li>Simulate the Champions League group stage draw with full automation.</li>
                        <li>View and manage matches between teams from different pots.</li>
                        <li>Host your own draw with customizable settings.</li>
                    </ul>
                </section>

                <section className="section">
                    <h2>Limitations</h2>
                    <ul>
                        <li>Due to the rules of the draw, there may be situations where a club cannot be paired with an opponent because all valid options have already been chosen.</li>
                        <li>This limitation is inherent to the draw rules and cannot be resolved through the current algorithm.</li>
                        <li>If you encounter this issue, please restart the draw by refreshing the page.</li>
                    </ul>
                </section>


                <section className="section">
                    <h2>Credits</h2>
                    <p>
                        This project utilizes the following technologies and libraries:
                    </p>
                    <ul>
                        <li><strong>React:</strong> For building the frontend user interface.</li>
                        <li><strong>Python:</strong> For the algorithm and logic behind the draw.</li>
                        <li><strong>JavaScript:</strong> For the client-side scripting and interactive elements.</li>
                        <li><strong>CSS:</strong> Ensures responsive design, adapting the layout to fit any device.</li>
                    </ul>
                </section>

                <section className="section">
                    <h2>Contact</h2>
                    <p>
                        If you have any questions or feedback, feel free to reach out:
                    </p>
                    <ul className='contact'>
                        <li>Email: <a href="mailto:example@example.com">mouner.shami@gmail.com</a></li>
                        <li>Instagram: <a href="https://instagram.com/mouner.sh/" target="_blank" rel="noopener noreferrer">instagram.com/mouner.sh</a></li>
                        <li>GitHub: <a href="https://github.com/mouners" target="_blank" rel="noopener noreferrer">github.com/mouners</a></li>
                        <li>LinkedIn: <a href="https://linkedin.com/in/mounersh" target="_blank" rel="noopener noreferrer">linkedin.com/in/mounersh</a></li>
                    </ul>
                </section>
                </div>
        </div>
      );
    }
    
export default AboutPage;