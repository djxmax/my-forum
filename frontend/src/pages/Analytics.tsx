import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { Card } from "../core/Card";
import { Stack } from "../core/Stack";
import { Text } from "../core/Text";
import { AnalyticsData } from "../entities";
import { StatCard } from "../components/StatCard";

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
            <Card>
              <Stack spacing={2}>
                {data.topPosters.map((poster, i) => (
                  <div
                    key={poster.username}
                    className="flex items-center justify-between py-2 border-b last:border-0 border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-400 dark:text-gray-500 w-5">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {poster.username}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {poster.postCount} post{poster.postCount > 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </Stack>
            </Card>
          </div>
        </>
      )}
    </Stack>
  );
}
