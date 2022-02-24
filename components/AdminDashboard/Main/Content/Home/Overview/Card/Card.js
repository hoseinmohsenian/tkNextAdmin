import styles from "./Card.module.css";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

function Card({ title, color, number, data }) {
    const colors = {
        blue: "#545cd8",
        green: "#3ac47d",
        red: "#d92550",
        yellow: "#f7b924",
    };

    // Chart init
    Chart.defaults.font = {
        size: 16,
        family: "IranianSans",
    };
    const chartData = {
        backgroundColor: "pink",
        labels: new Array(data?.length).fill(title),
        datasets: [
            {
                data: data,
                backgroundColor: "white",
                borderColor: colors[color],
                borderWidth: 1,
            },
        ],
    };
    const chartOptions = {
        maintainAspectRatio: false,
        scales: { xAxes: { display: false }, yAxes: { display: false } },
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return (
        <div className={`col-sm-6 ${styles.card}`}>
            <div
                className={`${styles.card__wrapper} ${
                    styles[`card__wrapper--${color}`]
                }`}
            >
                <span className={styles.number}>{number}</span>
                <span className={styles.title}>{title}</span>
                {data && (
                    <div className={styles.chart}>
                        <Line
                            data={chartData}
                            width={400}
                            height={200}
                            options={chartOptions}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Card;
