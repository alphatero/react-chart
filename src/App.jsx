import { useState, useEffect } from "react";

import LineChart from "./Charts/LineChart";

import { createServer } from "miragejs";

let server = createServer();
server.get("/api/users", [
  {
    name: "ASYNC_CONTRACT_LAYOUT",
    date: "2022-03-18",
    count: 6,
  },
  {
    name: "PII",
    date: "2022-03-21",
    count: 1,
  },
  {
    name: "TOC",
    date: "2022-03-22",
    count: 2,
  },
  {
    name: "PII",
    date: "2022-03-22",
    count: 1,
  },
  {
    name: "CONTRACT_TYPE",
    date: "2022-03-23",
    count: 1,
  },
  {
    name: "PII",
    date: "2022-03-23",
    count: 2,
  },
]);

function App() {
  const [data, setData] = useState([]);

  const [userData, setUserData] = useState({});

  const [loaded, setLoaded] = useState(false);

  function groupBy(data) {
    return data.reduce((acc, cur) => {
      const { name } = cur;

      if (!acc[name]) acc[name] = [];

      acc[name].push(cur);

      return acc;
    }, {});
  }

  function getDate(data) {
    const labels = [...new Set(data.map((item) => item.date))];
    return labels;
  }

  const colors = ["#777", "#FF0000", "#FFFF00", "#800000"];

  function chart(data) {
    const labels = data.labels;

    setUserData({
      labels: labels,

      datasets: data.filterData.map(([key, value], index) => {
        return {
          label: key,
          data: labels.map((label) =>
            value.find((item) => item.date === label)
              ? value.find((item) => item.date === label).count
              : 0
          ),
          backgroundColor: colors[index],
          borderColor: colors[index],
        };
      }),
    });

    setLoaded(true);
  }

  function fetchChart() {
    fetch("/api/users")
      .then((res) => res.json())
      .then((json) => {
        const filterData = [...Object.entries(groupBy(json))];
        const labels = getDate(json);

        return { labels, filterData };
      })
      .then((object) => chart(object));
  }

  useEffect(() => {
    if (loaded === false) {
      fetchChart();
    }
  }, [loaded]);

  if (!loaded) {
    return loaded;
  } else {
    return (
      <div className="App flex h-screen w-screen items-center justify-center">
        <div className="rounded-lg p-4 shadow-lg">
          <div style={{ width: 700 }}>
            {loaded ? (
              <LineChart
                chartData={userData}
                options={{
                  responsive: true,
                  title: { text: "THICCNESS SCALE", display: true },
                  scales: {
                    yAxes: {
                      ticks: {
                        beginAtZero: true,
                      },
                    },
                  },
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
