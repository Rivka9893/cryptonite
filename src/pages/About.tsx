export default function About() {
    return (
        <section className="page about">
            <h2>About</h2>

            <h3>The project</h3>
            <p>
                Cryptonite is a single page application that shows information and live reports about
                virtual currencies. The home page shows the 100 most popular coins with their prices, the
                reports page shows a live chart of the coins you selected, and the recommendations page uses
                ChatGPT to suggest whether a coin is worth buying. The project was built with React,
                TypeScript and Redux.
            </p>

            <h3>About me</h3>
            <img src={`${import.meta.env.BASE_URL}profile.jpg`} alt="Me" width={160} height={160} />
            <p>Name: Rivka Ryza</p>
            <p>Email: RR3229893@gmail.com</p>
            <p>Full Stack Web Developer student at John Bryce.</p>
            <p dir="auto">חיוך הוא קו עקום שמישר הכל 🙂</p>
        </section>
    )
}
