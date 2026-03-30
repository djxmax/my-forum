import { Button } from "../core/Button";
import { Text } from "../core/Text";

type Props = {
  page: number;
  totalPages: number | undefined;
  total: number | undefined;
  totalLabel: string;
  isLoading?: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export function Pagination({
  page,
  totalPages,
  total,
  totalLabel,
  isLoading,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className="flex w-full">
      <div className="basis-1/3 flex justify-start">
        <Button size="xl" disabled={page == 0} onClick={onPrev}>
          Précédent
        </Button>
      </div>
      <div className="basis-1/3 flex justify-center items-center">
        <Text>
          Page {page + 1} sur {totalPages} - {total} {totalLabel}
        </Text>
      </div>
      <div className="basis-1/3 flex justify-end">
        <Button
          size="xl"
          disabled={isLoading || totalPages == page + 1}
          onClick={onNext}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
