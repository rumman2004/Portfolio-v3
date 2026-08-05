import React from 'react';
import Loader from '../../UI/Loader';
import { Trash2, Edit } from 'lucide-react';

const DataTable = ({ 
  columns, 
  data, 
  loading, 
  onEdit, 
  onDelete, 
  emptyMessage = "No records found." 
}) => {
  if (loading) return <Loader />;

  const dropClass = "bg-md-surface shadow-sm rounded-2xl border border-md-outline-variant";
  const btnClass = "w-10 h-10 rounded-full flex items-center justify-center text-md-on-surface-variant hover:text-md-primary hover:bg-md-surface-container-highest transition-colors";

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className={dropClass + " w-full p-8 text-center"}>
        <p className="text-gray-500 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-12">
      {data.map((row, rowIdx) => (
        <div key={row._id || row.id || rowIdx} className={dropClass + " flex flex-col md:flex-row md:items-center justify-between p-5 gap-4 overflow-hidden min-w-0"}>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-1 min-w-0">
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-md-on-surface-variant uppercase tracking-wider mb-1">{col.header}</span>
                <div className="text-md-on-surface font-medium min-w-0 break-words">
                  {col.render ? col.render(row) : row[col.accessor]}
                </div>
              </div>
            ))}
          </div>

          {(onEdit || onDelete) && (
            <div className="flex items-center gap-2 shrink-0 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-md-surface-variant">
              {onEdit && (
                <button 
                  onClick={() => onEdit(row)} 
                  className={btnClass}
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button 
                  onClick={() => onDelete(row._id || row.id)} 
                  className={btnClass + " hover:text-red-500"}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DataTable;


