import { useState } from "react";

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T, index: number) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  showIndex?: boolean;
  pageSize?: number;
};

const DataTable = <T extends object>({
  columns,
  data,
  showIndex = false,
  pageSize = 5,
}: DataTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="card">
      {/* TABLE */}
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-striped mb-0">
            <thead>
              <tr>
                {showIndex && <th>#</th>}
                {columns.map((col, i) => (
                  <th style={{ minWidth: "150px" }} key={i}>{col.label}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (showIndex ? 1 : 0)}
                    className="text-center text-muted py-3"
                    style={{ minWidth: "150px" }}
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {showIndex && (
                      <td>{startIndex + rowIndex + 1}</td>
                    )}

                    {columns.map((col, colIndex) => (
                      <td key={colIndex}>
                        {col.render
                          ? col.render(row, startIndex + rowIndex)
                          : String(row[col.key as keyof T])}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="card-footer">
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => goToPage(currentPage - 1)}
                >
                  Previous
                </button>
              </li>

              {Array.from({ length: totalPages }).map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => goToPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => goToPage(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default DataTable;
