/* eslint-disable react/prop-types */
import { TableCell, TableRow } from "@/components/ui/table";


export const Skeleton = ({ height, width }) => (
  <div
    className="animate-pulse bg-gray-300 rounded"
    style={{ height, width }}
  ></div>
);

export const TableSkeleton = ({ rows, columns }) => (
  <>
    {[...Array(rows)].map((_, rowIndex) => (
      <TableRow key={rowIndex}>
        {[...Array(columns)].map((_, colIndex) => (
          <TableCell key={colIndex}>
            <Skeleton height={20} width="100%" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);
