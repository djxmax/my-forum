import { Card } from "../../core/Card";
import { Chart } from "react-google-charts";

type Props = {
  title: string;
  dataType: string;
  dataValueDescription: string;
  data: [string, number][];
};

export function PieChartCard({
  title,
  dataType,
  dataValueDescription,
  data,
}: Props) {
  const isDark = localStorage.getItem("theme") === "dark";
  const options = {
    title: title,
    pieHole: 0.4,
    backgroundColor: "transparent",
    legend: {
      textStyle: {
        color: isDark ? "#ffffff" : "#000000", // couleur du texte de la légende
      },
    },
    pieSliceTextStyle: {
      color: isDark ? "#ffffff" : "#000000", // couleur du texte dans les tranches
    },
    chartArea: { width: "95%", height: "95%" },
  };

  const finalData = [[dataType, dataValueDescription], ...data];

  return (
    <Card>
      <div className="text-center py-2">
        <Chart chartType="PieChart" data={finalData} options={options} />
      </div>
    </Card>
  );
}
