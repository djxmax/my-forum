import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { Card } from "../core/Card";
import { Stack } from "../core/Stack";
import { Text } from "../core/Text";
import { AnalyticsData } from "../entities";
import { StatCard } from "../components/StatCard";
import { PieChartCard } from "../components/charts/PieChartCard";

export default function Analytics() {
  const { data, isLoading, isError } = useQuery<AnalyticsData>({
    queryKey: ["analytics"],
    queryFn: () => api.get("/analytics/me").then((r) => r.data),
  });

  return (
    <Stack spacing={6}>
      <Text variant="title">Mes statistiques</Text>

      {isLoading && (
        <p className="text-sm text-gray-500 dark:text-gray-400">Chargement…</p>
      )}

      {isError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm dark:bg-red-900/20 dark:text-red-400">
          Impossible de charger les statistiques.
        </div>
      )}

      {data && (
        <>
          <div>
            <Text variant="subtitle">Total</Text>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <StatCard label="Posts publiés" value={data.totalPosts} />
              <StatCard label="Likes reçus" value={data.totalLikes} />
            </div>
          </div>

          <div>
            <Text variant="subtitle">
              {data.recentLimitDays} derniers jours
            </Text>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <StatCard label="Posts publiés" value={data.recentPosts} />
              <StatCard label="Likes reçus" value={data.recentLikes} />
            </div>
          </div>

          <div>
            <Text variant="subtitle">Top 5 des contributeurs</Text>
            <div className="mt-3">
              <PieChartCard
                title=""
                dataType="Nom de utilisateurs"
                dataValueDescription="Nombre de posts"
                data={data.topPosters.map(
                  (p) => [p.username, p.postCount] as [string, number],
                )}
              ></PieChartCard>
            </div>
          </div>
        </>
      )}
    </Stack>
  );
}
