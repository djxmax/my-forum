import { Card } from "../core/Card";

type Props = { label: string; value: number };

export function StatCard({ label, value }: Props) {
  return (
    <Card>
      <div className="text-center py-2">
        <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
          {value}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {label}
        </div>
      </div>
    </Card>
  );
}
